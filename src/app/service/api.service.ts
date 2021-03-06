import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class ApiService {

 private apiUrl: string = 'https://canalytics.comunicare.io/api/predictionHospitalizationCovidFhir' ;

  constructor(
    private http: HttpClient
  ) { }

  submitForm(data) {
    return this.http.post(this.apiUrl, data);
  }

}
 