import {Injectable} from '@angular/core';


@Injectable()
export class SoapService {
  constructor() {}

  soapCall(lat1: any, lat2: any, long1: any, long2: any) {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', 'http://localhost:8080/DistanceService_war_exploded/services/DistanceService?wsdl', true);
    const sr =
      `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:exam="http://example/">
         <soapenv:Header/>
         <soapenv:Body>
            <exam:calculDistance>
               <arg0>` + lat1 + `</arg0>
               <arg1>` + long1 + `</arg1>
               <arg2>` + lat2 + `</arg2>
               <arg3>` + long2 + `</arg3>
            </exam:calculDistance>
         </soapenv:Body>
      </soapenv:Envelope>`;

    xmlhttp.onreadystatechange =  () => {
      if (xmlhttp.readyState === 4) {
        if (xmlhttp.status === 200) {
          const xml = xmlhttp.responseText;
          console.log(xml);
        }
      }
    };
    xmlhttp.setRequestHeader('Content-Type', 'text/xml');
    xmlhttp.send(sr);
  }
}
