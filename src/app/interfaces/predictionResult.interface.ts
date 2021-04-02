import { Prediction } from './values.interface';

export interface PredictionResult {

  idPatient: number;
  nomPatient: string;
  summary: object;
  etatPrediction: string;
  pourcentage;
  tableauPredictionsBrut: Prediction[];
  valeursPredictions;
}
