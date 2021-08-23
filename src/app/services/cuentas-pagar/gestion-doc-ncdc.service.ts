import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class GestionDocNcdcService {

  constructor(private http: HttpClient) { }


  getDatos(){
    return this.http.get(`${URL}/gestion-documentos-ndnc`);
  }

    crearDocumento(data:any){
      return this.http.post(`${URL}/gestion-documentos-ndnc`,data);
    }

  
}
