import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { TipoProveedorService } from 'src/app/services/tipo-proveedor.service';
import { UiMessagesService } from 'src/app/services/ui-messages.service';
import { UsuarioService } from 'src/app/services/usuario.service';

import { GlobalFunctionsService } from 'src/app/services/global-functions.service';
@Component({
  selector: 'app-tipos-proveedores',
  templateUrl: './tipos-proveedores.component.html',
  styleUrls: ['./tipos-proveedores.component.scss']
})
export class TiposProveedoresComponent implements OnInit {
  
  usuario: any; 
  tipo: any[] = [];
  actualizando = false; 
  id_categoria: any;
  cols: any[];
  index: number = 0;
  
  listSubscribers: any = [];

  constructor(private globalFunction: GlobalFunctionsService,private uiMessage: UiMessagesService,
              private usuariosServ: UsuarioService,
              private tipoProveedorServ: TipoProveedorService,
              private confirmationService: ConfirmationService,
              public dialogService: DialogService) { 
                this.usuario = this.usuariosServ.getUserLogged();
                this.todosLosTiposP();
              }
  ngOnDestroy(): void {
    this.listSubscribers.forEach(a => a.unsubscribe());
  }

  ngOnInit(): void {
    this.listObserver();
    this.cols = [
      { field: 'descripcion', header: 'Descripción' },
      { field: 'cuenta_no', header: 'Cuenta' },
      { field: 'acciones', header: 'Acciones' },
    ] 

  }

  listObserver = () => {    
    const observer1$ = this.tipoProveedorServ.guardar.subscribe((resp: any)=>{             
      this.index = resp;
    })

    const observer2$ = this.tipoProveedorServ.tipoPguardado.subscribe(()=>{
      this.todosLosTiposP();
    })

    const observer3$ = this.tipoProveedorServ.tipoPborrado.subscribe(()=>{      
      this.todosLosTiposP();    
    })

    const observer4$ = this.tipoProveedorServ.tipoPact.subscribe(() => {
      this.todosLosTiposP();
    })

    this.listSubscribers = [observer1$,observer2$,observer3$,observer4$];
  };
  
  todosLosTiposP() {
    this.tipoProveedorServ.getDatos().then((resp: any) => {
      this.tipo = resp;
    })
  }

  actualizarTproveedor(data) {
    this.index = 1;   
    this.tipoProveedorServ.actualizando(data);
  }

  borrarTproveedor(tipo) { 
    this.confirmationService.confirm({
      message:"Esta seguro de borrar este registro?",
      accept:() =>{ 
        this.tipoProveedorServ.borrarTproveedor(tipo).then((resp: any)=>{
          this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro eliminado de manera correcta');   
        })       
      }
    })
  }

}
