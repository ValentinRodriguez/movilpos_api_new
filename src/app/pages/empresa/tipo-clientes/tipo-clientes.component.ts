import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { TipoClienteService } from 'src/app/services/mi-empresa/tipo-cliente.service';
import { UiMessagesService } from 'src/app/services/globales/ui-messages.service';
import { UsuarioService } from 'src/app/services/panel-control/usuario.service';

import { GlobalFunctionsService } from 'src/app/services/globales/global-functions.service';
@Component({
  selector: 'app-tipo-clientes',
  templateUrl: './tipo-clientes.component.html',
  styleUrls: ['./tipo-clientes.component.scss']
})
export class TipoClientesComponent implements OnInit {

  usuario: any;
  tipoClientes: any[] = [];
  actualizando = false;
  actualizar = false;
  id_categoria: any;
  cols: any[];
   
  index: number = 0;
  
  
  constructor(private uiMessage: UiMessagesService,
              private usuariosServ: UsuarioService,
              private tipoClienteServ: TipoClienteService,
              private confirmationService: ConfirmationService,
              public dialogService: DialogService) { 
                this.usuario = this.usuariosServ.getUserLogged();
              }

  ngOnInit(): void {
    this.obtenerTipoClientes();
    this.cols = [
      { field: 'tipo_cliente', header: 'Tipo' },
      { field: 'descripcion', header: 'Descripcion' },
      { field: 'acciones', header: 'Acciones' },
    ]     
    
    this.tipoClienteServ.tipoClienteguardado.subscribe(resp => {
      this.obtenerTipoClientes();
    })

    this.tipoClienteServ.tipoClienteBorrado.subscribe(resp => {
      this.obtenerTipoClientes();
    })

    this.tipoClienteServ.tipoClienteAct.subscribe(resp => {
      this.obtenerTipoClientes();
    })

    this.tipoClienteServ.guardar.subscribe((resp: any)=>{  
      this.index = resp;
    })
  }

  obtenerTipoClientes() {    
     
    this.tipoClienteServ.getDatos().then((resp: any) =>{
      this.tipoClientes = resp;   
                
       
    })
  }

  actTipoCliente(data) {
    this.index = 1;   
    this.tipoClienteServ.actualizando(data);
  }

  borrarTipoCliente(data) {
    this.confirmationService.confirm({
      message:"Esta seguro de borrar este registro?",
      accept:() =>{ 
        this.tipoClienteServ.borrarTipoCliente(data).then((resp: any)=>{
          this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro eliminado de manera correcta');   
        })       
      }
    })
  }
}
