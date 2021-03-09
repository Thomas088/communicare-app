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

   // A partir du tableau des risques et du tableau des symptômes (formulaire),
   // On construit les templates a envoyer au modèle principal (this.toPost)

   patient.facteurDeRisque.forEach(facteur => {

      let templateRisque: Object = {
   
         "valueQuantity":{
            "value": 1 
         },
         "code":{
            "coding":[
               {
                  "code":`${facteur}`,
                  "display":`${facteur}`,
                  "system":"http://comunicare.io"
               }
            ]
         }
      };
      arrayToMerge[0]["component"].push(templateRisque);
   })

   patient.symptomes.forEach(symptome => {

      let templateRisque: Object = {
   
         "valueQuantity":{
            "value": 1
         },
         "code":{
            "coding":[
               {
                  "code":`${symptome}`,
                  "display":`${symptome}`,
                  "system":"http://comunicare.io"
               }
            ]
         }
      };
      arrayToMerge[0]["component"].push(templateRisque);
   })
}
  
  createBodyPost(patient: DataPatient): Array<Object> {

   // template initial avec juste le nom et le sexe
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

   // On push les risques et les symptomes juste après
   this.mergeRisksAndSymptoms(patient, this.toPost);

   return this.toPost;
  }
}
