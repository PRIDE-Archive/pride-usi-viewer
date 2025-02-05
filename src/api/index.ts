import { get, post } from "./request";
export const getSpectrum = (usi: string) => {
  return get("/pride/molecules/ws/spectrum", { usi, resultType: 'FULL' });
};

export const spectrumAnnotation = (param: any) => {
  return post("/pride/molecules/ws/spectrum_annotations", param);
};

export const annotateUsi = (param: any) => {
  return post("/pride/molecules/ws/annotate_usi", param);
};

export const spectrumPrediction = (usi: string) => {
  return get("/pride/molecules/ws/spectrum_prediction", { usi, resultType: 'FULL' });
};