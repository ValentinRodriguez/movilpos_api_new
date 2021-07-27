import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioService } from '../panel-control/usuario.service';
import { Subject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

const URL = environment.url;
@Injectable({
  providedIn: 'root'
})
export class GlobalFunctionsService {

  private subject = new Subject<any>();
  usuario: any;
  usuarioExiste = 3;
  finalizar = new EventEmitter;
  formSubmitted = new EventEmitter;
  formReceived = new EventEmitter;
  
  constructor(private http: HttpClient,
              private usuariosServ: UsuarioService) { 
                this.usuario = this.usuariosServ.getUserLogged()
  }

  editando(id: string, ruta: string) {
    return new Promise( resolve => {
      this.http.get(`${URL}/${ruta}/${id}`).subscribe((resp: any) => {  
        if (resp['code'] === 200)  {          
          resolve(resp.data);            
        }
      })
    })
  }
 
  finalizando() {
    this.finalizar.emit(true);
  }

  enviando(resp) {
    this.formSubmitted.emit(resp);
  }

  recibiendo(resp) {
    this.formReceived.emit(resp);
  }
  
  sendMessage(message: string) {
    this.subject.next({ text: message });
  }
  
  clearMessage() {
    this.subject.next();
  }
  
  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }

  //array.sort(this.ordenaData);
  ordenaData(a, b) {
    // Use toUpperCase() to ignore character casing
    const bandA = a.brand;
    const bandB = b.brand;
  
    let comparison = 0;
    if (bandA > bandB) {
      comparison = 1;
    } else if (bandA < bandB) {
      comparison = -1;
    }
    return comparison;
  }
}

