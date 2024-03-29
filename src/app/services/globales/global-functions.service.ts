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
  finalizar = new EventEmitter;
  formSubmitted = new EventEmitter;
  clearProductfu = new EventEmitter();
  enviarImagen = new EventEmitter(); 

  usuario: any;
  usuarioExiste = 3;
  listSubscribers: any = [];
  
  constructor(private http: HttpClient,
    private usuariosServ: UsuarioService) { 
    
  }
  
  ngOnDestroy() {
    console.log('destruido');    
    this.listSubscribers.forEach(a => {
      if (a !== undefined) {
        a.unsubscribe()        
      }
    });
  }
  
  editando(id: string, ruta: string) {
    return new Promise( resolve => {
      this.listSubscribers.push(this.http.get(`${URL}/${ruta}/${id}`).subscribe((resp: any) => {  
        if (resp['ok'])  {          
          resolve(resp.data);            
        }
      }))
    })
  }
 
  decodeJson(rowData) {
    return JSON.parse(rowData);
  }
  
  finalizando() {
    this.finalizar.emit(true);
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

  ClearProductFU() {
    this.clearProductfu.emit();
  }

  enviarurlClean(data: any) {
    this.enviarImagen.emit(data);
  }
}

