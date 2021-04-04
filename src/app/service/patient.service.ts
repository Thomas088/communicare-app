import { Injectable } from '@angular/core';
import { DataPatient } from '../interfaces/dataPatient.interface';
import { ToPost } from '../interfaces/ArrayToPost.interface';


@Injectable({
  providedIn: 'root'
})

export class PatientService {

  constructor() { }

  // Les méthodes pour update et formater l'envoi en POST
  toPost: Array<ToPost>;

updateDatasPatient(patient: DataPatient, form): DataPatient {
    patient.nom = form.value.nom;
    patient.prenom = form.value.prenom;
    patient.age = form.value.age;
    patient.sexe = form.value.sexe;
    patient.facteurDeRisque = form.value.facteurDeRisque;
    patient.symptomes = form.value.symptomes;
    return patient;
}

mergeRisksAndSymptoms(patient: DataPatient, arrayToMerge: Array<ToPost>): void {

   patient.facteurDeRisque.forEach(facteur => {

      const templateRisque = {

         valueQuantity: {
            value: 1
         },
         code: {
            coding: [
               {
                  code: `${facteur}`,
                  display: `${facteur}`,
                  system: 'http://comunicare.io'
               }
            ]
         }
      };
      arrayToMerge[0].component.push(templateRisque);
   });

   patient.symptomes.forEach(symptome => {

      const templateRisque = {

         valueQuantity: {
            value: 1
         },
         code: {
            coding: [
               {
                  code: `${symptome}`,
                  display: `${symptome}`,
                  system: 'http://comunicare.io'
               }
            ]
         }
      };
      arrayToMerge[0].component.push(templateRisque);
   });
}

  createBodyPost(patient: DataPatient): Array<ToPost> {

    this.toPost =  [{
         subject: {
            reference: Number(patient.idPatient),
            display: `${patient.nom} ${patient.prenom}`
         },
         issued: `${patient.predictionDate}`,
         component: [
            {
               valueQuantity: {
                  value: Number(patient.age)
               },
               code: {
                  coding: [
                     {
                        code: 'age',
                        display: 'age',
                        system: 'http://comunicare.io'
                     }
                  ]
               }
            },
            {
               valueQuantity: {
                  value: Number(patient.sexe)
               },
               code: {
                  coding: [
                     {
                        code: 'sexe',
                        display: 'sexe',
                        system: 'http://comunicare.io'
                     }
                  ]
               }
            }
         ]
      }];

    this.mergeRisksAndSymptoms(patient, this.toPost);

    return this.toPost;
  }
}
