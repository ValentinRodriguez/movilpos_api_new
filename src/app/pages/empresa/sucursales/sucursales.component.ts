import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { UiMessagesService } from '../../../services/ui-messages.service';
import { UsuarioService } from '../../../services/usuario.service';
import { SucursalesService } from "../../../services/sucursales.service";

@Component({
  selector: 'app-sucursales',
  templateUrl: './sucursales.component.html',
  styleUrls: ['./sucursales.component.scss']
})
export class SucursalesComponent implements OnInit {

  usuario: any;
  index: number = 0;
  sucursales: any[] = [];
  id_categoria: any;
  cols: any[];
  detalles: any;
  formSubmitted = false;

  constructor(private uiMessage: UiMessagesService,
              private usuariosServ: UsuarioService,
              private sucursalesServ: SucursalesService,
              private confirmationService: ConfirmationService,
              public dialogService: DialogService) { 
                this.usuario = this.usuariosServ.getUserLogged();                
              }

  ngOnInit(): void {
    this.todasLasSucursales();

    this.sucursalesServ.guardar.subscribe((resp: any)=>{  
      this.index = resp;
    })

    this.cols = [
      { field: 'id', header: 'Código' },
      { field: 'descripcion', header: 'Descripción' },
      { field: 'acciones', header: 'Acciones' },
    ] 

    this.sucursalesServ.sucursalesGuardada.subscribe((resp: any)=>{
      this.todasLasSucursales();
    })

    this.sucursalesServ.sucursalesBorrada.subscribe((resp: any)=>{      
      this.todasLasSucursales();   
    })

    this.sucursalesServ.sucursalesAct.subscribe((resp: any) => {
      this.todasLasSucursales();
    })

    this.sucursalesServ.formSubmitted.subscribe((resp: any) => {
      this.formSubmitted = resp;
    })
  }

  todasLasSucursales() {
    this.formSubmitted = true;
    this.sucursalesServ.getDatos().then((resp: any) => {
      this.sucursales = resp;
      console.log(resp);    
    });
  }
  
  actualizarMoneda(data) {
    this.index = 1;   
    this.sucursalesServ.actualizando(data);
  }

  borrarCategoria(categoria) { 
    this.confirmationService.confirm({
      message:"Esta seguro de borrar este registro?",
      accept:() =>{ 
        this.sucursalesServ.borrarSucursales(categoria).then((resp: any)=>{
          this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro eliminado de manera correcta');   
        })       
      }
    })
  }

}
