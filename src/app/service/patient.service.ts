import { Injectable } from '@angular/core';
import { DataPatient } from '../dataPatient.interface';

@Injectable({
  providedIn: 'root'
})

export class PatientService {

  constructor() { }

  // Les méthodes pour update et formater l'envoi en POST

  toPost: Array<Object>;

  updateDatasPatient(patient: DataPatient, form): DataPatient {
    patient.nom = form.value.nom;
    patient.prenom = form.value.prenom;
    patient.age = form.value.age;
    patient.sexe = form.value.sexe;
    patient.facteurDeRisque = form.value.facteurDeRisque;
    patient.symptomes = form.value.symptomes;
    return patient;
}


mergeRisksAndSymptoms(patient: DataPatient, arrayToMerge: Array<Object>): void {

      for(let i: number = 0; i < patient.facteurDeRisque.length; i++) {

         let templateRisque: Object = {
   
            "valueQuantity":{
               "value": 1 
            },
            "code":{
               "coding":[
                  {
                     "code":`${patient.facteurDeRisque[i]}`,
                     "display":`${patient.facteurDeRisque[i]}`,
                     "system":"http://comunicare.io"
                  }
               ]
            }
         };
         arrayToMerge[0]["component"].push(templateRisque);
      }
   
      for(let i: number  = 0; i < patient.symptomes.length; i++) {
   
         let templateSymptome: Object = {
            "valueQuantity":{
               "value": 1
            },
            "code":{
               "coding":[
                  {
                     "code":`${patient.symptomes[i]}`,
                     "display":`${patient.symptomes[i]}`,
                     "system":"http://comunicare.io"
                  }
               ]
            }
         };
         arrayToMerge[0]["component"].push(templateSymptome);
      }
   }
  
  createBodyPost(patient: DataPatient): Array<Object> {

    this.toPost = [
         {
         "subject":{
            "reference": Number(patient.idPatient),
            "display": `${patient.nom} ${patient.prenom}`
         },
         "issued": `${patient.predictionDate}`,
         "component":[
            {
               "valueQuantity":{
                  "value": Number(patient.age)
               },
               "code":{
                  "coding":[
                     {
                        "code":"age",
                        "display":"age",
                        "system":"http://comunicare.io"
                     }
                  ]
               }
            },
            {
               "valueQuantity":{
                  "value": Number(patient.sexe)
               },
               "code":{
                  "coding":[
                     {
                        "code":"sexe",
                        "display":"sexe",
                        "system":"http://comunicare.io"
                     }
                  ]
               }
            }
         ]
      }
   ];

   this.mergeRisksAndSymptoms(patient, this.toPost);

   return this.toPost;
  }
}
