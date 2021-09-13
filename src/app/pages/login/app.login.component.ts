import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from 'primeng/api';
import { LocalService } from 'src/app/services/crypt/local.service';
import { StorageService } from 'src/app/services/crypt/storage.service';
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
  
  msgs: Message[] = [];  
  
  constructor(public usuarioServ: UsuarioService,
              private storageService:StorageService,
              private datosEstaticosServ: DatosEstaticosService,
              private router: Router) { }

  ngOnInit(): void {
    this.year = this.datosEstaticosServ.getYear();
  }

  onSubmit() {    
    this.usuarioServ.formSubmitted = true;
    this.usuarioServ.login(this.form).then((resp: any) => {
      this.usuarioServ.getMyOauthToken(this.form).then((resp2: any) => {
        const data = Object.assign(resp, resp2);
        this.usuarioServ.clearLocalStorage();        
        this.usuarioServ.setLocalStorage(data);
        
        // this.usuarioServ.getLocalStorage('localStorage').then(resp => {
        //  if (resp) {
           
        //  }
        // });

        setTimeout(() => {
          this.router.navigate(['/home']);          
        }, 2000);
      });
    });
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
