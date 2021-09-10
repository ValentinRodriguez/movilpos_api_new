import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from 'primeng/api';
import { LocalService } from 'src/app/services/crypt/local.service';
import { DatosEstaticosService } from 'src/app/services/globales/datos-estaticos.service';
import { UsuarioService } from 'src/app/services/panel-control/usuario.service';


@Component({
  selector: 'app-login',
  templateUrl: './app.login.component.html',
  providers:[UsuarioService]
})
export class AppLoginComponent implements OnInit{
  
  form = {
    email: 'valentinrodriguez1427@gmail.com',
    password: null,
    store: false
  };

  error = null;
  tryout = null;
  wait = false;
  year: any;
  timeLeft = 60;
  interval;
  // guardando = false;
  msgs: Message[] = [];
  
  
  constructor(private usuarioServ: UsuarioService,
              private router: Router,
              private localService: LocalService,
              private datosEstaticosServ: DatosEstaticosService) { }

  ngOnInit(): void {
    this.year = this.datosEstaticosServ.getYear();
  }

  setLocalStorage(key, data) {
    this.localService.setJsonValue(key, data);
  }

  getLocalStorage(key) {
    return this.localService.getJsonValue(key);
  }

  onSubmit() {    
    // data => this.handleResponse(data),
    // error => this.handlerError(error)
    this.usuarioServ.login(this.form).then((resp: any) => {
      this.usuarioServ.getMyOauthToken(this.form).then((resp2: any) => {
        const data = Object.assign(resp, resp2);
        console.log(data);
        this.setLocalStorage('sessionId', data.sessionId); 
        this.setLocalStorage('access_token', data.access_token);

        console.log(this.getLocalStorage('sessionId'));
        console.log(this.getLocalStorage('access_token'));
        // for (const key in data) {
        //   if (Object.prototype.hasOwnProperty.call(data, key)) {
        //     const element = data[key];
        //     setTimeout(() => {
        //       console.log(key);              
        //       this.setLocalStorage(key, element);              
        //     }, 100);
        //   }
        // }
        // this.usuarioServ.handleToken(data);
      });
    });
  }

  handleResponse(data) {
    this.usuarioServ.handleToken(data);
    // this.router.navigateByUrl('/');     
  }

  showErrorViaMessages() {
    this.msgs = [];
    this.msgs.push({ severity: 'error', summary: 'Credenciales incorrectas' });
  }

  isLoggedInMsg() {
    this.msgs = [];
    this.error = true;
    this.msgs.push({ severity: 'error', summary: 'Este usuario está en uso'});
  }
}
