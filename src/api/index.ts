import { get, post } from "./request";

export const getUSI = (id: number) => {
  return get("/delivery/fetch", {id});
};