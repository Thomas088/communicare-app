// Interface générée avec "Json To Code" VS Code Extension
export interface FHIRData {
  success: boolean;
  message: null;
  data: Datum[];
}

export interface Datum {
  subject: Subject;
  identifier: Identifier[];
  issued: string;
  prediction: Prediction[];
}

export interface Identifier {
  value: string;
  system: string;
}

export interface Prediction {
  outcome: Outcome;
  rationale: string;
  probabilityDecimal: number;
  order: number;
}

export interface Outcome {
  coding: Coding[];
}

export interface Coding {
  code: string;
  display: string;
  system: string;
}

export interface Subject {
  reference: string;
  display: string;
}
