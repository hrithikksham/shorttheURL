// src/utils/base62.ts
const ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const BASE = ALPHABET.length;

// Encodes a database ID (1001) -> Short Code ("g7")
export const encodeId = (id: number): string => {
  if (id === 0) return ALPHABET[0];
  let s = "";
  while (id > 0) {
    s = ALPHABET[id % BASE] + s;
    id = Math.floor(id / BASE);
  }
  return s;
};

// Decodes Short Code ("g7") -> Database ID (1001)
export const decodeId = (str: string): number => {
  let id = 0;
  for (let i = 0; i < str.length; i++) {
    id = id * BASE + ALPHABET.indexOf(str[i]);
  }
  return id;
};