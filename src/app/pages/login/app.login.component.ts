import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from 'primeng/api';
import { DatosEstaticosService } from 'src/app/services/datos-estaticos.service';
import { UsuarioService } from 'src/app/services/panel-control/usuario.service';

import { GlobalFunctionsService } from 'src/app/services/global-functions.service';
@Component({
  selector: 'app-login',
  templateUrl: './app.login.component.html',
})
export class AppLoginComponent implements OnInit{
  form = {
    email: 'valentinrodriguez1427@gmail.com',
    password: null
  };
  error = null;
  tryout = null;
  wait = false;
  year: any;
  timeLeft = 60;
  interval;
  // guardando = false;
  msgs: Message[] = [];
  
  
  constructor(private globalFunction: GlobalFunctionsService,private usuarioServ: UsuarioService,
              private router: Router,
              private datosEstaticosServ: DatosEstaticosService) { }

  ngOnInit(): void {
    this.year = this.datosEstaticosServ.getYear();
  }

  onSubmit() {
    this.usuarioServ.login(this.form).subscribe(
      data => this.handleResponse(data),
      error => this.handlerError(error)
    );
  }

  handleResponse(data) {
    this.usuarioServ.handleToken(data);
    this.router.navigateByUrl('/');     
  }

  handlerError(error) {
    switch (error.status) {
      case 401:
        this.error = error.error.error;
        this.showErrorViaMessages();
        break;

      case 429:
        this.tryout = 'Cantidad de intentos excedida, espere: ';
        this.startTimer();
        break;

      default:
        break;
    }     
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

  startTimer() {
    this.wait = true;
    this.error = null;
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.timeLeft = 0;
        this.tryout = null;
        this.wait = false;
      }
    }, 1000);
  }
}
