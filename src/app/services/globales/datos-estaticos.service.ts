import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class DatosEstaticosService {
  
  constructor(private http: HttpClient) { 
    
  }

  getMedidas() {
    return this.http.get<any>('assets/demo/data/medidas.json')
      .toPromise()
      .then(res => res.data as any[])
      .then(data => data);
  }

  getYear() {
    const today = new Date();
    const date = today.getFullYear();
    return date;
  }

  getYearsOld(data) {
    const years = moment().diff(data, 'years',false);
    return years
  }

  getDiffMilliseconds(data1, data2) {    
    var a =  moment().diff(data1);
    var b = moment().diff(data2);
    return a - b;    
  }

  isBetweenDate(data1, data2, data3) {
    if (data2 === null) {
      return this.getDiffMilliseconds(data1,data3)
    } else {
      return moment(data3).isBetween(data1, data2);      
    }
  }

  getChasis() {
    return this.http.get<any>('assets/demo/data/chasis.json')
    .toPromise()
    .then(res => res.specification as any[]);
  } 
  
  getDate() {
    let today = new Date();
    let month = today.getMonth();
    let year = today.getFullYear();
    let day = today.getDate();
    return `${year}/${month+1}/${day}`;
  }

  getHour() {
    let today = new Date();
    let hora = today.getHours();
    let minuto = today.getMinutes();
    let segundos = today.getSeconds();
    return `${hora}:${minuto}:${segundos}`;
  }

  getHourFormatted(data) {
    let hora = data.getHours();
    let minuto = data.getMinutes();
    // let segundos = data.getSeconds();
    return `${hora}:${minuto}`;
  }

  getDataFormated(fecha) {    
    let month = fecha.getMonth();
    let year = fecha.getFullYear();
    let day = fecha.getDate();
    return `${year}/${month+1}/${day}`;
  }

  getDateTimeFormated(data) {
    const fecha = this.getDataFormated(data)
    const hora = this.getHourFormatted(data)

    return fecha +' '+ hora;
  }

  getHourAmp() {
    let today = new Date();
    let minutos: any;
    var hours = today.getHours();
    var minutes = today.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutos = minutes < 10 ? '0'+minutes : minutes;

    var strTime = hours + ':' + minutos + ' ' + ampm;
    return strTime;
  }

  getCountries() {
    return this.http.get<any>('https://restcountries.eu/rest/v2/lang/es')
      .toPromise()
      .then(res => res as any[])
      .then(data => data);
  }

  getCountriesLocal() {
    return this.http.get<any>('assets/demo/data/countries.json')
      .toPromise()
      .then(res => res as any[])
      .then(data => data);
  }

  getFiles() {
    return this.http.get<any>('assets/demo/data/filesystem.json')
      .toPromise()
      .then(res => res as any[])
      .then(data => data);
  }

  getMonedas() {   
    return new Promise( resolve => {
      this.http.get('assets/demo/data/monedas.json').subscribe((resp: any) => {
        resolve(resp.data);
      })
    })
  }

  getMetEnvios() {
    return this.http.get<any>('assets/demo/data/metodosEnvio.json')
      .toPromise()
      .then(res => res.data as any[])
      .then(data => data);
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  decimalAdjust(type, value, exp) {
    // Si el exp no está definido o es cero...
    if (typeof exp === 'undefined' || +exp === 0) {
      return Math[type](value);
    }
    value = +value;
    exp = +exp;
    // Si el valor no es un número o el exp no es un entero...
    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
      return NaN;
    }
    // Shift
    value = value.toString().split('e');
    value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
    // Shift back
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
  }
}

