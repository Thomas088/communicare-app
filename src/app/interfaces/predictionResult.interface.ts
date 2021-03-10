import { Prediction } from './values.interface';

export interface PredictionResult {

  idPatient: number;
  nomPatient: string;
  summary: object;
  etatPrediction: string;
  pourcentage;
  tableauPredictionsBrut: Prediction[];
  valeursPredictions: {
    rfAmbulatoire: number,
    rfHospitalise: number,
    nnAmbulatoire: number,
    nnHospitalise: number,
    gbtAmbulatoire: number,
    gbtHospitalise: number,
  };
}
