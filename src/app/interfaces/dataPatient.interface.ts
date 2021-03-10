// Interface client pour mieux ménager les données en envoi
export interface DataPatient {
  idPatient: number;
  prenom?: string;
  nom?: string;
  age: number;
  predictionDate: string;
  sexe: number;
  facteurDeRisque: Array<string>;
  symptomes: Array<string>;
}
