
import {Component, Input, OnInit, OnChanges} from '@angular/core';
import {Trajet} from '../variables/trajet.variable';
import {DateVariable} from '../variables/date.variable';


@Component({
  selector: 'app-trajet-unique',
  templateUrl: './trajet-unique.component.html',
  styleUrls: ['./trajet-unique.component.css']
})
export class TrajetUniqueComponent implements OnInit, OnChanges {
  @Input() trajet: any;
  @Input() distance: any;
  @Input() choixDate: string;
  trajetListe: Trajet[] = [];
  dureeTotale: any;
  constructor() { }
  ngOnChanges() {
    if (this.trajet) {
      this.choixDate = this.dateToString(this.choixDate);
      this.trajetListe = [];
      this.trajet.forEach(j => {
        this.trajetListe.push(new Trajet(j.from.stop_point,
          j.to.stop_point,
          new DateVariable(
            this.dateToString(j.departure_date_time),
            this.timeToString(j.departure_date_time)),
          new DateVariable(
            this.dateToString(j.arrival_date_time),
            this.timeToString(j.arrival_date_time)),
                    this.distance,
                    this.secondesToTime(j.duration),
          j.duree
          ));
      });
     
    }
  }
  ngOnInit(): void {
  }

  dateToString(date: string) {
    const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai',
      'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    const monthDate = date.substr(4, 2)[0] === '0' ? date.substr(4, 6)[1] : date.substr(4, 6);
    const month = months[parseInt(monthDate , 0) - 1];
    return date.substr(6, 2) + ' ' + month + ' ' + date.substr(0, 4);
  }
  timeToString(date: string) {
    return date.substr(9, 2) + 'h' + date.substr(11, 2);
  }
  
  secondesToTime(totalSeconds: number) {
    const heures   = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds - (heures * 3600)) / 60);

    let result = (heures < 10 ? '0' + heures : heures);
    result += 'H' + (minutes < 10 ? '0' + minutes : minutes);
    return result;
  }

  
}
