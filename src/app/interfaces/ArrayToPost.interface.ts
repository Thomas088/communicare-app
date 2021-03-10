export interface ToPost {
  subject: {
    reference: number;
    display: string;
  };

  issued: string;
  component: {
    valueQuantity: {
        value: number;
    };
    code: {
        coding: {
            code: string;
            display: string;
            system: string;
        }[];
      };
  }[];
}