import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Lieux} from '../variables/Lieux.variable';
import {map} from 'rxjs/operators';

@Injectable()
export class SncfService {
  private sncfToken = '08ac4f0f-5729-40a6-a61e-656374c1f228'; // Clé obtenu sur l'api SNCF
  private trajet: any;
  trajetAbonneSub = new Subject<any>();
  constructor(private httpClient: HttpClient) {}

  emitDataJourneySubject() {
    this.trajetAbonneSub.next(this.trajet);
  }
  getPlace(data: any, placeName) {
    const place = data.places.find(p => p.administrative_region.name === placeName);
    return new Lieux(
      placeName,
      place.administrative_region.id,
      place.administrative_region.coord.lat,
      place.administrative_region.coord.lon);
  }
  getAdminPlace(name: string) {
    return this.lieuxRequest(name)
      .pipe(map((response: any) => response.places.filter(
        (item: any) => item.embedded_type === 'administrative_region'
        ))
      );
  }
  trajetRequest(f: string, t: string, dt: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: this.sncfToken
      }),
      params: {from: f, to: t, datetime: dt, min_nb_journeys : '10' , datetime_represents : 'departure'}
    };
    this.httpClient
      .get('https://api.sncf.com/v1/coverage/sncf/journeys',
        httpOptions)
      .pipe(
        map((response: any) =>
          response.journeys
            .map(j => j.sections.filter((sec: any) => sec.type === 'public_transport'))
        )
      )
      .subscribe(
        (response: any) => {
          this.trajet = response;
          this.emitDataJourneySubject();
        },
        (error) => {
          console.log('error' + error);
        }
      );
  }
  lieuxRequest(name: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: this.sncfToken
      }),
      params: {q: name}
    };
    return this.httpClient
      .get('https://api.sncf.com/v1/coverage/sncf/places',
        httpOptions);
  }
  

}
