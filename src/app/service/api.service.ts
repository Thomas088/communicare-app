import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Values } from '../interfaces/values.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ApiService {

 private apiUrl: string = 'https://canalytics.comunicare.io/api/predictionHospitalizationCovidFhir' ;

  constructor(
    private http: HttpClient
  ) { }

  submitForm(data): Observable<Values> {
    return this.http.post<Values>(this.apiUrl, data);
  }

}
 