import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from 'primeng/api';
import { DatosEstaticosService } from 'src/app/services/globales/datos-estaticos.service';
import { GlobalFunctionsService } from 'src/app/services/globales/global-functions.service';
import { UsuarioService } from 'src/app/services/panel-control/usuario.service';


@Component({
  selector: 'app-login',
  templateUrl: './app.login.component.html',
  providers:[UsuarioService]
})
export class AppLoginComponent implements OnInit{
  
  form = {
    correo: 'rosvd@sdf.com',
    password: 123456,
    store: false
  };

  error = null;
  tryout = null;
  wait = false;
  year: any;
  formSubmitted = false;
  msgs: Message[] = [];  
  
  constructor(public usuarioServ: UsuarioService,
              private datosEstaticosServ: DatosEstaticosService,
              private router: Router,
              private global: GlobalFunctionsService) { }

  ngOnInit(): void {
    this.year = this.datosEstaticosServ.getYear();
    this.global.formSubmitted.subscribe(resp =>{
      console.log(resp);      
      this.formSubmitted = resp;
    })
  }

  onSubmit() {    
    this.usuarioServ.login(this.form).subscribe((resp: any) => {
      console.log(resp);
      if (resp.ok) {
        this.usuarioServ.clearLocalStorage();        
        this.usuarioServ.setLocalStorage(resp);
        setTimeout(() => {
          this.router.navigate(['/home']);                   
        }, 200);
      }
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
