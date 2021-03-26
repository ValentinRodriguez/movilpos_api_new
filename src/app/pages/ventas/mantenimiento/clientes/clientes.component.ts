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
    this.todosLosClientes();

    this.cols = [
      { field: 'nombre', header: 'Cliente' },
      { field: 'documento', header: 'Documento' },
      { field: 'email', header: 'Email' },
      { field: 'celular', header: 'Celular' },
      { field: 'acciones', header: 'Acciones' },
    ] 

    this.clientesServ.ClienteCreado.subscribe(()=>{
      this.todosLosClientes()
    })

    this.clientesServ.clientAct.subscribe(()=>{
      this.todosLosClientes()
    })

    this.clientesServ.clienteBorrado.subscribe(()=>{
      this.todosLosClientes()
    })   
  }
  
  todosLosClientes() {
    this.clientesServ.getDatos().then((resp: any) => {
      this.clientes = resp; 
      console.log(resp);
       
    })
  }
  
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
