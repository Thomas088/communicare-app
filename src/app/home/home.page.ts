import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../service/api.service';
import { DataPatient } from '../dataPatient.interface';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})


export class HomePage implements OnInit {

  covidForm: FormGroup;
  dateObject: Date = new Date();
  predictionResult: Array<Object> = [];

  day: number = this.dateObject.getDay();
  month: number = this.dateObject.getMonth() + 1;
  year: number = this.dateObject.getFullYear();

  dataPatient: DataPatient = {

    idPatient: Math.floor(Math.random() * 10000),
    prenom: "",
    nom: "",
    age: 0,
    predictionDate: `${this.day}/${this.month}/${this.year}`,
    sexe: 0,
    facteurDeRisque: "",
    symptomes: "",
  };

  constructor( 
    private formBuilder: FormBuilder,
    private api: ApiService,
     ) {
      this.covidForm = this.formBuilder.group({
        nom: ['', Validators.pattern('[a-zA-Z-\' ]*')],
        prenom: ['', Validators.pattern('[a-zA-Z-\' ]*')],
        age: ['', Validators.pattern('[0-9]*')],
        sexe: ['', Validators.required],
        facteurDeRisque: [''],
        symptomes: ['']
      });
     }

  updateDatasPatient(patient: DataPatient, form): DataPatient {
    patient.nom = form.value.nom;
    patient.prenom = form.value.prenom;
    patient.age = form.value.age;
    patient.sexe = form.value.sexe;
    patient.facteurDeRisque = form.value.facteurDeRisque;
    patient.symptomes = form.value.symptomes;
    return patient;
}

createPostTemplateData(patient: DataPatient): Array<Object>  {
  return this.api.createBodyPost(this.dataPatient);
}


  sendDatas(){
    this.dataPatient = this.updateDatasPatient(this.dataPatient, this.covidForm);
    const dataToSend = this.createPostTemplateData(this.dataPatient);
    this.api.submitForm(dataToSend).subscribe(data => this.predictionResult.push(data));
    console.log(this.predictionResult);
  }

  ngOnInit() {}

}
