import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FHIRData } from '../interfaces/values.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ApiService {

 private apiUrl: string = 'https://canalytics.comunicare.io/api/predictionHospitalizationCovidFhir' ;

  constructor(
    private http: HttpClient
  ) { }

  submitForm(data): Observable<FHIRData> {
    return this.http.post<FHIRData>(this.apiUrl, data);
  }

}
 