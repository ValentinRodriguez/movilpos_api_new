import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { UiMessagesService } from 'src/app/services/globales/ui-messages.service';
import { UsuarioService } from 'src/app/services/panel-control/usuario.service';
import { CuadresService } from "src/app/services/contabilidad/cuadres.service";

import { GlobalFunctionsService } from 'src/app/services/globales/global-functions.service';
@Component({
  selector: 'app-cuadre-caja',
  templateUrl: './cuadre-caja.component.html',
  styleUrls: ['./cuadre-caja.component.scss']
})
export class CuadreCajaComponent implements OnInit {

  usuario: any;
  index: number = 0;
  cuadres: any[] = [];
  id_categoria: any;
  cols: any[];
  
  
  constructor(private uiMessage: UiMessagesService,
              private usuariosServ: UsuarioService,
              private cuadresServ: CuadresService,
              private confirmationService: ConfirmationService,
              public dialogService: DialogService) { 
                this.usuario = this.usuariosServ.getUserLogged();                
              }

  ngOnInit(): void {
    this.todosLosCuadres();

    this.cuadresServ.guardar.subscribe((resp: any)=>{  
      this.index = resp;
    })

    this.cols = [
      { field: 'id', header: 'Código' },
      { field: 'cajero', header: 'Cajero' },
      { field: 'fecha', header: 'Fecha' },
      { field: 'caja', header: 'Caja' },
      { field: 'turno', header: 'Turno' },
      { field: 'descripcion', header: 'Descripcion' },
      { field: 'saldo_final', header: 'Saldo_ Final' },
      { field: 'acciones', header: 'Acciones' },
    ] 
    this.cuadresServ.cuadreGuardada.subscribe((resp: any)=>{
      this.todosLosCuadres();
    })

    this.cuadresServ.cuadreBorrada.subscribe((resp: any)=>{      
      this.todosLosCuadres();   
    })

    this.cuadresServ.cuadreAct.subscribe((resp: any) => {
      this.todosLosCuadres();
    })
  }

  todosLosCuadres() {
    
    this.cuadresServ.getDatos().then((resp: any) => {
      this.cuadres = resp;
    });
  }
  
  actualizarCuadre(data) {
    this.index = 1;   
    this.cuadresServ.actualizando(data);
  }

  borrarCategoria(categoria) { 
    this.confirmationService.confirm({
      message:"Esta seguro de borrar este registro?",
      accept:() =>{ 
        this.cuadresServ.borrarCuadre(categoria).then((resp: any)=>{
          this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro eliminado de manera correcta');   
        })       
      }
    })
  }

}
