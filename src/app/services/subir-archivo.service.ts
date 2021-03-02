import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpRequest, HttpClient, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

const URL =environment.url

@Injectable({
  providedIn: 'root'
})
export class SubirArchivoService {

  constructor(private http: HttpClient) { }

  subirFoto(archivo: File, tipo: string, id: string, urlLaravel: string):Observable<HttpEvent<any>>{
    let url = URL + '/' + urlLaravel;
    let formData = new FormData();
    formData.append("imagen", archivo);
    const req = new HttpRequest('POST', url, formData, { reportProgress: true });
    return this.http.request(req);
  }
  
  subirArchivo( archivo: File, urlLaravel: string ) {

    return new Promise( (resolve, reject ) => {

      const formData = new FormData();
      const xhr = new XMLHttpRequest();

      formData.append( 'imagen', archivo, archivo.name );

      xhr.onreadystatechange = function() {

        if ( xhr.readyState === 4 ) {

          if ( xhr.status === 200 ) {
            console.log( 'Imagen subida' );
            console.log(xhr.response);
            
            //resolve( JSON.parse( xhr.response ) );
          } else {
            console.log( 'Fallo la subida' );
            reject( xhr.response );
          }
        }
      };

      const url = URL + '/' + urlLaravel;

      xhr.open('POST', url, true );
      xhr.send( formData );
    });
  }
}
