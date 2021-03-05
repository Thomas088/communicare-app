import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../service/api.service';
import { DataPatient } from '../dataPatient.interface';
import { Observable, Subscribable, Subscriber, Subscription, SubscriptionLike } from 'rxjs';
import { map } from 'rxjs/operators';
import { PatientService } from '../service/patient.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit {

  covidForm: FormGroup;
  dateObject: Date = new Date();
  predictionResult: Array<Object> = [];

  // Risques select values
  risques: Object  = {
    'fr_diabete' : 'Diabete',
    'fr_maladie_cardiovasculaire': 'Maladie Cardiovasculaire',
    'fr_asthme': 'Asthme',
    'fr_bpco': 'BPCO',
    'fr_obese': 'Obésité'
  }

  // Symptomes select values
  symptomes: Object  = {

    'symp_fievre': 'Fièvre',
    'symp_dyspnee' : 'Difficultés respiratoires',
    'symp_myalgies': 'Douleurs musculaires',
    'symp_cephalees': 'Mal de tête',
    'symp_toux': 'Toux',
    'symp_digestifs': 'Troubles digestifs'
  }

  // Date de la demande
  day: number = this.dateObject.getDay();
  month: number = this.dateObject.getMonth() + 1;
  year: number = this.dateObject.getFullYear();

  // Template d'un patient via l'interface
  dataPatient: DataPatient = {

    idPatient: Math.floor(Math.random() * 10000),
    prenom: "",
    nom: "",
    age: 0,
    predictionDate: `${this.day}/${this.month}/${this.year}`,
    sexe: 0,
    facteurDeRisque: [],
    symptomes: [],
  };

  constructor ( 
    private formBuilder: FormBuilder,
    private api: ApiService,

    // Service pour update et créer le template d'envoi de données du patient
    private patientService: PatientService
  ) {
      this.covidForm = this.formBuilder.group({
        nom: ['', Validators.pattern('[a-zA-Z-\' ]*')],
        prenom: ['', Validators.pattern('[a-zA-Z-\' ]*')],
        age: ['', Validators.pattern('[0-9]*')],
        sexe: ['', Validators.required],
        facteurDeRisque: [[''], Validators.required],
        symptomes: [[''], Validators.required]
      });
     }

     
sendDatas(): Observable<Object> {
    this.dataPatient = this.patientService.updateDatasPatient(this.dataPatient, this.covidForm);
    let dataToSend: Array<Object> = this.patientService.createBodyPost(this.dataPatient);
    return this.api.submitForm(dataToSend);
}

getPredictionResults(): void  {

  this.sendDatas().pipe(

    // Map des données renvoyé pour faciliter la récupération des données à l'affichage
    // Création d'un template comme pour le patient sur this.predictionResult
    map(
      values => {

        let userName: string = values['data'][0]['subject']['display'] // optionnel
        let idPatient: number = values['data'][0]['subject']['reference'] // optionnel
        let indexSummary: number = values['data'][0]['prediction'].length - 1
        let summary: Object = values['data'][0]['prediction'][indexSummary]
        let pourcentage: number = Math.round(summary['probabilityDecimal'] * 100)
        let etatPrediction: string = summary['outcome']['coding'][0]['code']

        // Le template démarre ici 
        this.predictionResult.push(
          {
            'id-patient': Number(idPatient),
            'nom-patient': userName,
            'summary': summary,
            'etat-prediction': etatPrediction,
            'pourcentage': pourcentage
          }
        )
      } 
    )
  )
.subscribe()
}

closeMessage(): void {
    this.predictionResult.length = 0;
}

  ngOnInit() {}
}
