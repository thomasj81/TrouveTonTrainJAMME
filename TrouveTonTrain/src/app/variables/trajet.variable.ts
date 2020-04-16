import {DateVariable} from './date.variable';

export class Trajet {
  constructor(
    public source: any,
    public destination: any,
    public departDate: DateVariable,
    public arriveeDate: DateVariable,
    public distance: any,
    public duree: any,
    public durationSeconde: number,
   
  ) {}
}
