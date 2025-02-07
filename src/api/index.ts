import { get, post } from "./request";
export const getSpectrum = (usi: string) => {
  return get("/pride/molecules/ws/spectrum", { usi, resultType: 'FULL' });
};

export const spectrumAnnotation = (param: any) => {
  return post("/pride/molecules/ws/spectrum_annotations", param);
};

export const annotateUsi = (param: any) => {
  return post("/pride/ws/usi/v1/annotate_usi", param);
};

export const spectrumPrediction = (param: any) => {
  return get("/pride/ws/usi/v1/spectrum_prediction", param);
};