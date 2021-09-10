import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from 'primeng/api';
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
              private datosEstaticosServ: DatosEstaticosService) { }

  ngOnInit(): void {
    this.year = this.datosEstaticosServ.getYear();
  }

  // data => this.handleResponse(data),
  // error => this.handlerError(error)
  onSubmit() {
    // const formData = this.form.getRawValue();
    this.usuarioServ.login(this.form).then((resp: any) => {
      this.usuarioServ.getMyOauthToken(this.form).then((resp2: any) => {
        const data = Object.assign(resp, resp2);
        this.handleResponse(data);
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
