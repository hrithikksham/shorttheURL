import { FastifyRequest, FastifyReply } from 'fastify';
import { UrlService } from '../services/url.service';
import { AnalyticsService } from '../services/analytics.service'; // <--- Import this

export const redirectUrl = async (req: FastifyRequest<{ Params: { code: string } }>, reply: FastifyReply) => {
  const { code } = req.params;

  try {
    const longUrl = await UrlService.getOriginalUrl(code);

    if (longUrl) {
      // --- FIRE AND FORGET ANALYTICS ---
      // We do NOT 'await' this fully. We want the redirect to happen ASAP.
      // Catch errors so analytics failure doesn't break the user's redirect.
      AnalyticsService.trackClick(code, req.headers['user-agent'], req.ip)
        .catch(err => console.error('Analytics Error:', err));

      return reply.redirect(longUrl);
    } else {
      return reply.status(404).send({ error: 'URL not found' });
    }
  } catch (error) {
    return reply.status(500).send({ error: 'Internal Server Error' });
  }
};