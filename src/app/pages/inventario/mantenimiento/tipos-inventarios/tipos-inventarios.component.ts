import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { TipoInventarioService } from 'src/app/services/inventario/tipo-inventario.service';
import { UiMessagesService } from 'src/app/services/globales/ui-messages.service';


@Component({
  selector: 'app-tipos-inventarios',
  templateUrl: './tipos-inventarios.component.html',
  styleUrls: ['./tipos-inventarios.component.scss'],
  providers:[TipoInventarioService]
})
export class TiposInventariosComponent implements OnInit {

  
  formaAct: FormGroup;
  usuario: any;
  actualizando = false;
  actualizar = false;
  id_tipoInv: any;   
  tipoInventario: any[] = [];
  cols: any[];
  cuenta_no: any;
  index: number = 0;    
  listSubscribers: any = [];
 
  constructor(private uiMessage: UiMessagesService,
              
              private tipoInventarioServ: TipoInventarioService,
              private confirmationService: ConfirmationService,              
              public dialogService: DialogService) { 
              }
              ngOnDestroy(): void {
                this.listSubscribers.forEach(a => a.unsubscribe());
              }
            
            

  ngOnInit(): void {
    this.listObserver();
    this.todosLosInvtipos();
    
    this.cols = [
      { field: 'cuenta_no', header: 'Cuenta' },
      { field: 'descripcion', header: 'Descripción' },
      { field: 'acciones', header: 'Acciones' },
    ]    
  }

              
  listObserver = () => {
    const observer1$ = this.tipoInventarioServ.guardar.subscribe((resp: any)=>{  
      this.index = resp;
    })

    const observer2$ = this.tipoInventarioServ.TipoInventarioAct.subscribe(()=>{  
      this.todosLosInvtipos();
    })

    const observer3$ = this.tipoInventarioServ.TipoInventarioBorrado.subscribe(()=>{  
      this.todosLosInvtipos();
    })

    const observer4$ = this.tipoInventarioServ.TipoInventarioGuardado.subscribe(()=>{  
      this.todosLosInvtipos();
    })

    this.listSubscribers = [observer1$,observer2$,observer3$,observer4$];
  };

  todosLosInvtipos() {         
    this.tipoInventarioServ.getDatos().then((resp: any) => {       
      this.tipoInventario = resp;      
    })
  }

  actualizarTipoInv(data) {
    this.index = 1;   
    this.tipoInventarioServ.actualizando(data);
  }

  borrarTipoInv(tipoInv) { 
    this.confirmationService.confirm({
      message:"Esta seguro de borrar este registro?",
      accept:() =>{ 
        this.tipoInventarioServ.borrarTipoInventario(tipoInv).then((resp: any)=>{
          this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro eliminado de manera correcta');   
        })       
      }
    })
  }



}
