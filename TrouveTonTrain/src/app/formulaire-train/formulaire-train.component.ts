import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SncfService } from '../services/sncf.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Lieux } from '../variables/Lieux.variable';
import {SoapService} from '../services/soap.service';
@Component({
  selector: 'app-formulaire-train',
  templateUrl: './formulaire-train.component.html',
  styleUrls: ['./formulaire-train.component.scss']
})
export class FormulaireTrainComponent implements OnInit {

  trajet: any;
  trajetAbonne: Subscription;
  journee = new Date();
  placeSource: Lieux;
  placeDestination: Lieux;
  formGroup: FormGroup;
  optionsSource: any;
  optionsDestination: any;
  temps: any;
  choixDate: string;
  distance: string;
  selectionDate: any;

  constructor(private sncfService: SncfService, private soapService: SoapService) {
    this.trajetAbonne = this.sncfService.trajetAbonneSub.subscribe(
      (data: any) => {
        this.trajet = data;
      }
    );
  }
  
  ngOnInit() {
    this.formGroup = new FormGroup({
      from: new FormControl('', [Validators.minLength(2), Validators.required]),
      to: new FormControl('', [Validators.minLength(2), Validators.required]),
      date: new FormControl(this.journee),
      temps: new FormControl({
        heure: this.journee.getHours(),
        minute: this.journee.getMinutes()
      }, Validators.required)
    });
  
  }
  onSubmit() {
    const data = this.formGroup.value;
    this.selectionDate = this.dateToString(this.formatDate(data.date));
    data.from = data.from.trim();
    data.to = data.to.trim();
    data.from = data.from[0].toUpperCase() + data.from.slice(1);
    data.to = data.to[0].toUpperCase() + data.to.slice(1);
    data.date.setHours(data.temps.hour, data.temps.minute);
    this.choixDate = this.formatDate(data.date);
    this.sncfService.lieuxRequest(data.from).subscribe((res: any) => {
      this.placeSource = this.sncfService.getPlace(res, data.from);
      this.sncfService.lieuxRequest(data.to).subscribe((result: any) => {
        this.placeDestination = this.sncfService.getPlace(result, data.to);
        this.sncfService.trajetRequest(this.placeSource.id, this.placeDestination.id, this.formatDate(data.date));
        this.CalculDistance();
      });
    });
  }

  formatDate(str: string) {
    if (str !== '') {
      const date = new Date(str);
      return date.getFullYear().toString()
        + (date.getMonth() + 1 < 10 ? '0' : '') + (date.getMonth() + 1).toString()
        + (date.getDate() < 10 ? '0' : '') + date.getDate().toString()
        + 'T'
        + (date.getHours() < 10 ? '0' : '') + date.getHours().toString()
        + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes().toString()
        + (date.getSeconds() < 10 ? '0' : '') + date.getSeconds().toString();
    }
  }
  CalculDistance() {
    let lat1 = parseFloat(this.placeSource.lat);
    const lon1 = parseFloat(this.placeSource.long);
    let lat2 = parseFloat(this.placeDestination.lat);
    const lon2 = parseFloat(this.placeDestination.long);
    const R = 6371; // en km
    const dLat = this.EnDegres(lat2 - lat1);
    const dLon = this.EnDegres(lon2 - lon1);
    lat1 = this.EnDegres(lat1);
    lat2 = this.EnDegres(lat2);

    const x = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
    this.distance =  (R * c).toFixed(0);
    
  }

  EnDegres(Value) {
    return Value * Math.PI / 180;
  }
  getOptions(value: string, id: number) {
    if (value.trim().length > 1) {
      this.sncfService.getAdminPlace(value)
        .subscribe(data => {
          if (id === 1) {
            this.optionsSource = data.map(val => val.administrative_region.name);
          } else {
            this.optionsDestination = data.map(val => val.administrative_region.name);
          }
        });
    }
  }

  
  dateToString(date: string) {
    const mois = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai',
      'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    const dateMois = date.substr(4, 2)[0] === '0' ? date.substr(4, 6)[1] : date.substr(4, 6);
    const unmois = mois[parseInt(dateMois , 0) - 1];
    return date.substr(6, 2) + ' ' + unmois + ' ' + date.substr(0, 4);
  }
}
