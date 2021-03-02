import { Component, OnInit } from '@angular/core';

import { ConfirmationService } from 'primeng/api';
import { ClientesService } from 'src/app/services/clientes.service';
import { UiMessagesService } from 'src/app/services/ui-messages.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent implements OnInit {

  

  clientes : any[] = [];
  page = 1;
  clienteExiste = 3;
  tipo_cliente=[];
  vendedor=[];
  parametro: string;
  usuario: any;
  cols: any[];

  constructor( private uiMessage: UiMessagesService,
               private usuariosServ: UsuarioService,
               private clientesServ: ClientesService,
               private confirmationService: ConfirmationService) {
                this.usuario = this.usuariosServ.getUserLogged();
  }

  ngOnInit(): void {
   
    

    this.cols = [
      { field: 'nombre', header: 'Cliente' },
      { field: 'num_rnc', header: 'RNC' },
      { field: 'email', header: 'Email' },
      { field: 'celular', header: 'Celular' },
      // { field: 'vendedor', header: 'Vendedor' },
      { field: 'acciones', header: 'Acciones' },
    ] 

    this.clientesServ.clientAct.subscribe((resp:any)=>{
      this.todosLosClientes()
    })

    this.clientesServ.clienteBorrado.subscribe((resp:any)=>{
      this.todosLosClientes()
    })   
  }
  
  todosLosClientes() {
    this.clientesServ.getDatos().then((resp: any) => {
      this.clientes = resp;  
    })
  }
  
  // guardarCliente(){
  //   this.guardando = true;
  //   console.log(this.forma.value);    
  //   if (this.forma.invalid) {
  //     this.uiMessage.getMiniInfortiveMsg('tst','error','Atención','Debe completar los campos que son obligatorios'); 
  //     Object.values(this.forma.controls).forEach(control =>{          
  //       control.markAllAsTouched();
  //     })
  //     this.guardando = false;
  //   }else{      
  //     this.forma.value.usuario_creador = this.usuario.username;
  //     this.guardando = false;
  //     this.clientesServ.crearCliente(this.forma.value).then((resp: any)=>{
  //       this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente',resp.msj);              
  //     })
  //   }  
  // } 

  actualizarCliente(producto) { 

  }

  borrarCliente(id) {
    this.confirmationService.confirm({
      message:"Esta seguro de borrar este registro?",
      accept:() =>{ 
        this.clientesServ.borrarCliente(id).then((resp: any)=>{
          this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente',resp.msj);   
        })       
      }
    })
  }
   
  buscaPersona(data) {
    console.log(data);    
  }

  


}
