import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../service/api.service';
import { DataPatient } from '../interfaces/dataPatient.interface';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { PatientService } from '../service/patient.service';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { Prediction, FHIRData } from '../interfaces/values.interface';
import { PredictionResult } from '../interfaces/predictionResult.interface';
import { resultClassifier } from '../enums/resultClassifier.enum';
import { ClassifierAmbulatoire } from '../enums/classifierAmbulatoire.enum';
import { ClassifierHospitalise } from '../enums/classifierHospitalise.enum';
import { DatasetHospitalisation } from '../interfaces/datasetHospitalisation.interface';
import { DatasetAmbulatoire } from '../interfaces/datasetAmbulatoire.interface';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit {

  covidForm: FormGroup;
  dateObject: Date = new Date();
  predictionResult: Array<PredictionResult> = [];
  errorMessage = '';

  risques: object  = {
    fr_diabete : 'Diabete',
    fr_maladie_cardiovasculaire: 'Maladie Cardiovasculaire',
    fr_asthme: 'Asthme',
    fr_bpco: 'BPCO',
    fr_obese: 'Obésité'
  };

  symptomes: object  = {

    symp_fievre: 'Fièvre',
    symp_dyspnee : 'Difficultés respiratoires',
    symp_myalgies: 'Douleurs musculaires',
    symp_cephalees: 'Mal de tête',
    symp_toux: 'Toux',
    symp_digestifs: 'Troubles digestifs'
  };

resultClassifier: string[] = Object.keys(resultClassifier)
                                   .filter(key => !isNaN(resultClassifier[key]));

classifierAmbulatoire: string[] = Object.keys(ClassifierAmbulatoire)
                                        .filter(key => !isNaN(ClassifierAmbulatoire[key]));

classifierHospitalise: string[] = Object.keys(ClassifierHospitalise)
                                        .filter(key => !isNaN(ClassifierHospitalise[key]));

  day: number = this.dateObject.getDay();
  month: number = this.dateObject.getMonth() + 1;
  year: number = this.dateObject.getFullYear();

  dataPatient: DataPatient = {

    idPatient: Math.floor(Math.random() * 10000),
    prenom: '',
    nom: '',
    age: 0,
    predictionDate: `${this.day}/${this.month}/${this.year}`,
    sexe: 0,
    facteurDeRisque: [],
    symptomes: [],
  };

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private patientService: PatientService
  ) {
      this.covidForm = this.formBuilder.group({
        nom: ['', Validators.pattern('[a-zA-ZÀ-ÖØ-öø-ÿ-\' ]*')],
        prenom: ['', Validators.pattern('[a-zA-ZÀ-ÖØ-öø-ÿ-\' ]*')],
        age: ['', Validators.pattern('[0-9]*')],
        sexe: ['', Validators.required],
        facteurDeRisque: [[''], Validators.required],
        symptomes: [[''], Validators.required]
      });
     }

chartLabels: Label[] = ['Random Forest', 'Neuronal Network', 'Gradient Boost Tree'];

chartOptions: ChartOptions = {
    responsive: true,
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };
  chartColors: Color[] = [
    // Ambulatoire
    { backgroundColor: '#3DADF2' },
    // Hospitalisation
    { backgroundColor: '#020F59' },
  ];

  chartType: ChartType = 'bar';
  chartLegend = true;
  // chartPlugins = [pluginDataLabels];
  chartsData: ChartDataSets[] = [];

  templateDatasetAmbulatoire: DatasetAmbulatoire = {
    data: [],
    label: 'Soins Ambulatoire'
  };

  templateDatasetHospitalisation: DatasetHospitalisation = {
    data: [],
    label: 'Hospitalisation'
  };

closeResultMessage(): void {
  this.predictionResult.length = 0;
}

closeErrorMesssage(): void {
  this.errorMessage = '';
}
 closeSpinner(): void  {
  document.querySelector('.container__spinner').classList.remove('visible');
  document.querySelector('.container__spinner').classList.add('invisible');
 }

displaySpinner(): void {
  document.querySelector('.container__spinner').classList.remove('invisible');
  document.querySelector('.container__spinner').classList.add('visible');
}

sendDatas(): Observable<FHIRData> {
  this.dataPatient = this.patientService.updateDatasPatient(this.dataPatient, this.covidForm);
  const dataToSend: Array<object> = this.patientService.createBodyPost(this.dataPatient);
  return this.api.submitForm(dataToSend);
}

getPredictionResults(): Subscription  {

  if (this.predictionResult.length) {
    this.closeResultMessage();
  }

  return this.sendDatas().pipe(

    map(
      fhirResults => {

        const data = fhirResults.data[0];
        const userName: string = data.subject.display;
        const idPatient: string = data.subject.reference;
        const predictions: Prediction[] = data.prediction;
        const summary: Partial<Prediction[]> = predictions.filter(prediction => prediction.rationale === 'summary');
        const pourcentage: number = Math.round(summary[0].probabilityDecimal * 100);
        const etatPrediction: string = summary[0].outcome.coding[0].code;
        const templateResult: object = {};

        this.resultClassifier.forEach((value, i) => templateResult[value] = Math.round(predictions[i].probabilityDecimal * 100));

        this.predictionResult.push(
          {
            idPatient: Number(idPatient),
            nomPatient: userName,
            summary,
            etatPrediction,
            pourcentage,
            tableauPredictionsBrut: predictions,
            valeursPredictions: templateResult
          }
        );

        this.classifierAmbulatoire.forEach((classifier) =>  {
          const predictionScore = templateResult[classifier];
          this.templateDatasetAmbulatoire.data.push(predictionScore);
        });

        this.classifierHospitalise.forEach((classifier) =>  {
         const predictionScore = templateResult[classifier];
         this.templateDatasetHospitalisation.data.push(predictionScore);
        });

        this.chartsData.push(this.templateDatasetAmbulatoire, this.templateDatasetHospitalisation);
      }
    )
  )
.subscribe(
  () => {
    this.closeErrorMesssage();
    this.displaySpinner();
    console.log('Requete HTTP reussie.');
  },
  err => {
    this.closeSpinner();
    this.errorMessage = err;
  }
);
}

ngOnInit() {
  this.closeErrorMesssage();
  this.closeSpinner();
  }
}