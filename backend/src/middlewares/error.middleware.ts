import { FastifyError, FastifyRequest, FastifyReply } from 'fastify';
import { HTTP_STATUS } from '../constants/httpStatus';

export const errorHandler = (error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
  request.log.error(error); // Log to console/file

  const statusCode = error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  
  reply.status(statusCode).send({
    error: statusCode === 500 ? 'Internal Server Error' : error.message,
    statusCode
  });
};