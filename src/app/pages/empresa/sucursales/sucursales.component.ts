import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';

import { UsuarioService } from '../../../services/panel-control/usuario.service';
import { SucursalesService } from '../../../services/mi-empresa/sucursales.service';
import { UiMessagesService } from 'src/app/services/globales/ui-messages.service';

@Component({
  selector: 'app-sucursales',
  templateUrl: './sucursales.component.html',
  styleUrls: ['./sucursales.component.scss'],
  providers:[SucursalesService,]
})
export class SucursalesComponent implements OnInit {

  usuario: any;
  index: number = 0;
  sucursales: any[] = [];
  id_categoria: any;
  cols: any[];
  detalles: any;  
  listSubscribers: any = [];

  constructor(private uiMessage: UiMessagesService,
              
              private sucursalesServ: SucursalesService,
              private confirmationService: ConfirmationService,
              public dialogService: DialogService) { 
                ;                
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
