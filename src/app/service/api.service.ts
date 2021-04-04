import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FHIRData } from '../interfaces/values.interface';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class ApiService {

 private apiUrl: string = 'https://canalytics.comunicare.io/api/predictionHospitalizationCovidFhir';
 
 errorMessage: string = '';

  constructor(
    private http: HttpClient
  ) { }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('Une erreur est survenue : ', error.error.message);
    } else {
      console.error(
        `Code retour backend : ${error.status}, ` +
        `Body : ${error.error}`);
    }
    return throwError(`Une erreur est survenue : veuillez réessayer plus tard.`);
  }

  submitForm(data): Observable<FHIRData> {
    return this.http.post<FHIRData>(this.apiUrl, data).pipe(
      catchError(this.handleError)
    );
  }

}
