import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../service/api.service';
import { DataPatient } from '../dataPatient.interface';
import { Observable, Subscriber, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { PatientService } from '../service/patient.service';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts'; 

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit {

  covidForm: FormGroup;
  dateObject: Date = new Date();
  predictionResult: Array<Object> = [];

  // Risques valeurs (select)
  risques: Object  = {
    'fr_diabete' : 'Diabete',
    'fr_maladie_cardiovasculaire': 'Maladie Cardiovasculaire',
    'fr_asthme': 'Asthme',
    'fr_bpco': 'BPCO',
    'fr_obese': 'Obésité'
  }

  // Symptomes valeurs (select)
  symptomes: Object  = {

    'symp_fievre': 'Fièvre',
    'symp_dyspnee' : 'Difficultés respiratoires',
    'symp_myalgies': 'Douleurs musculaires',
    'symp_cephalees': 'Mal de tête',
    'symp_toux': 'Toux',
    'symp_digestifs': 'Troubles digestifs'
  }

  // Date de prédiction 
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
        nom: ['', Validators.pattern('[a-zA-ZÀ-ÖØ-öø-ÿ-\' ]*')],
        prenom: ['', Validators.pattern('[a-zA-ZÀ-ÖØ-öø-ÿ-\' ]*')],
        age: ['', Validators.pattern('[0-9]*')],
        sexe: ['', Validators.required],
        facteurDeRisque: [[''], Validators.required],
        symptomes: [[''], Validators.required]
      });
     }

chartLabels: Label[] = ['Random Forest', 'Neuronal Network','Gradient Boost Tree'];

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
    // Couleur soins ambulatoire
    { backgroundColor: '#3DADF2' },
    // Couleur hospitalisation
    { backgroundColor: '#020F59' },
  ];

  chartType: ChartType = 'bar';
  chartLegend = true;
  // chartPlugins = [pluginDataLabels];
  chartsData: ChartDataSets[] = [];

closeMessage(): void {
  this.predictionResult.length = 0;
}

// Spinner 
toggleSpinner(): void {

  document.querySelector(".container__spinner").classList.remove("invisible");
  document.querySelector(".container__spinner").classList.add("visible");

  setTimeout(() => {
    document.querySelector(".container__spinner").classList.remove("visible");
    document.querySelector(".container__spinner").classList.add("invisible");
  }, 5000)
  
}

// Get data from API
sendDatas(): Observable<Object> {
  this.dataPatient = this.patientService.updateDatasPatient(this.dataPatient, this.covidForm);
  let dataToSend: Array<Object> = this.patientService.createBodyPost(this.dataPatient);
  // Zone de debug pour les données a envoyer
  console.log(dataToSend);
  return this.api.submitForm(dataToSend);
}

getPredictionResults(): Subscription  {

  if(this.predictionResult.length) {
    this.closeMessage();
  }

  this.toggleSpinner();

  return this.sendDatas().pipe(

    // Map des données renvoyé pour faciliter la récupération des données à l'affichage
    // Création d'un template comme pour le patient sur this.predictionResult
    map(
      values => {

        let userName: string = values['data'][0]['subject']['display'] 
        let idPatient: number = values['data'][0]['subject']['reference'] 
        let predictions: Object = values['data'][0]['prediction'];
        let indexSummary: number = values['data'][0]['prediction'].length - 1
        let summary: Object = values['data'][0]['prediction'][indexSummary]
        let pourcentage: number = Math.round(summary['probabilityDecimal'] * 100)
        let etatPrediction: string = summary['outcome']['coding'][0]['code']

        // Le template démarre ici 
        this.predictionResult.push(
          {
            'idPatient': Number(idPatient),
            'nomPatient': userName,
            'summary': summary,
            'etatPrediction': etatPrediction,
            'pourcentage': pourcentage,
            'tableauPredictionsBrut': predictions,
            'valeursPredictions': {
              'rfAmbulatoire': Math.round(predictions[0]['probabilityDecimal'] * 100),
              'rfHospitalise': Math.round(predictions[1]['probabilityDecimal'] * 100),
              'nnAmbulatoire': Math.round(predictions[2]['probabilityDecimal'] * 100),
              'nnHospitalise': Math.round(predictions[3]['probabilityDecimal'] * 100),
              'gbtAmbulatoire': Math.round(predictions[4]['probabilityDecimal'] * 100),
              'gbtHospitalise': Math.round(predictions[5]['probabilityDecimal'] * 100),
            }
          }
        )

         // On configure le dataset pour les charts
         // Le choix d'une boucle dessus aurait été un peu de trop pour ce que c'est car nous avons que 3 modèles
         // Aussi prendre en compte qu'il aurait fallu jongler avec les valeurs Ambulatoire / Hospitalisation et aussi prendre en compte que l'index du dernier est le summary (donc pas utile pour le graphe, utile juste pour le calcul final).

          this.chartsData = [
          { data: [
            this.predictionResult[0]['valeursPredictions']['rfAmbulatoire'],
            this.predictionResult[0]['valeursPredictions']['nnAmbulatoire'],
            this.predictionResult[0]['valeursPredictions']['gbtAmbulatoire']
            ], label: 'Soins Ambulatoire' }, 

          { data: [
            this.predictionResult[0]['valeursPredictions']['rfHospitalise'],
            this.predictionResult[0]['valeursPredictions']['nnHospitalise'],
            this.predictionResult[0]['valeursPredictions']['gbtHospitalise']
          ], label: 'Hospitalisation' }
        ]
      } 
    )
  )
.subscribe(
  // Zone de debug pour vérifier la nouvelle structure de données
   () => console.log(this.predictionResult)
)
}

ngOnInit() {
    document.querySelector(".container__spinner").classList.add("invisible");
  }
}
