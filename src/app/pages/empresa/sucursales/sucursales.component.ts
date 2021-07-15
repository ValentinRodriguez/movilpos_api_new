import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { UiMessagesService } from '../../../services/ui-messages.service';
import { UsuarioService } from '../../../services/usuario.service';
import { SucursalesService } from "../../../services/sucursales.service";

import { GlobalFunctionsService } from 'src/app/services/global-functions.service';
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
  
  listSubscribers: any = [];

  constructor(private globalFunction: GlobalFunctionsService,private uiMessage: UiMessagesService,
              private usuariosServ: UsuarioService,
              private sucursalesServ: SucursalesService,
              private confirmationService: ConfirmationService,
              public dialogService: DialogService) { 
                this.usuario = this.usuariosServ.getUserLogged();                
              }

  ngOnDestroy(): void {
    this.listSubscribers.forEach(a => a.unsubscribe());
  }

  ngOnInit(): void {
    this.listObserver();
    this.todasLasSucursales();

    this.cols = [
      { field: 'id', header: 'Código' },
      { field: 'descripcion', header: 'Descripción' },
      { field: 'acciones', header: 'Acciones' },
    ];
  }

  listObserver = () => {
    const observer1$ = this.sucursalesServ.guardar.subscribe((resp: any)=>{  
      this.index = resp;
    })
    const observer2$ = this.sucursalesServ.sucursalesGuardada.subscribe(()=>{
      this.todasLasSucursales();
    })

    const observer3$ = this.sucursalesServ.sucursalesBorrada.subscribe(()=>{      
      this.todasLasSucursales();   
    })

    const observer4$ = this.sucursalesServ.sucursalesAct.subscribe(() => {
      this.todasLasSucursales();
    })

    this.listSubscribers = [observer1$,observer2$,observer3$,observer4$];
  }

  todasLasSucursales() {
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
