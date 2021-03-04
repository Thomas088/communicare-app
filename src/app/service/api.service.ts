import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataPatient } from '../dataPatient.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

apiUrl: string  = 'https://canalytics.comunicare.io/api/predictionHospitalizationCovidFhir';

  constructor(
    private http: HttpClient
  ) { }

  toPost: Array<Object>;

  createBodyPost(patient: DataPatient): Array<Object> {

    this.toPost = [
      {
         "subject":{
            "reference": `${patient.idPatient}`,
            "display": `Patient: ${patient.idPatient}`
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
            },
            {
               "valueQuantity":{
                  "value": patient.facteurDeRisque ? 1 : 0
               },
               "code":{
                  "coding":[
                     {
                        "code":`${patient.facteurDeRisque}`,
                        "display":`${patient.facteurDeRisque}`,
                        "system":"http://comunicare.io"
                     }
                  ]
               }
            },
            {
               "valueQuantity":{
                  "value": patient.symptomes ? 1 : 0
               },
               "code":{
                  "coding":[
                     {
                        "code":`${patient.symptomes}`,
                        "display":`${patient.symptomes}`,
                        "system":"http://comunicare.io"
                     }
                  ]
               }
            }
         ]
      }
   ];

   return this.toPost;
  }

  submitForm(data) {
    return this.http.post(this.apiUrl, data);
  }

}
