import { get, post } from "./request";

export const getUSI = (usi: string) => {
  return get("/pride/molecules/ws/spectrum", { usi, resultType: 'FULL' });
};