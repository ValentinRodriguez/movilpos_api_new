import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { TipoInventarioService } from 'src/app/services/tipo-inventario.service';
import { UiMessagesService } from 'src/app/services/ui-messages.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-tipos-inventarios',
  templateUrl: './tipos-inventarios.component.html',
  styleUrls: ['./tipos-inventarios.component.scss']
})
export class TiposInventariosComponent implements OnInit {

  
  formaAct: FormGroup;
  usuario: any;
  actualizando = false;
  actualizar = false;
  id_tipoInv: any;
  loading: boolean;
  tipoInventario: any[] = [];
  cols: any[];
  cuenta_no: any;
  index: number = 0;

  constructor(private uiMessage: UiMessagesService,
              private usuariosServ: UsuarioService,
              private tipoInventarioServ: TipoInventarioService,
              private confirmationService: ConfirmationService,
              
              public dialogService: DialogService) { 
                this.usuario = this.usuariosServ.getUserLogged();
              }

  ngOnInit(): void {
    this.tipoInventarioServ.guardar.subscribe((resp: any)=>{  
      this.index = resp;
    })

    this.todosLosInvtipos();
    
    this.cols = [
      { field: 'cuenta_no', header: 'Cuenta' },
      { field: 'descripcion', header: 'Descripción' },
      { field: 'acciones', header: 'Acciones' },
    ] 

    

    this.tipoInventarioServ.TipoInventarioGuardado.subscribe(resp =>{
      this.todosLosInvtipos();
    })

    this.tipoInventarioServ.TipoInventarioAct.subscribe(resp =>{
      this.todosLosInvtipos();
    })

    this.tipoInventarioServ.TipoInventarioBorrado.subscribe((resp: any)=>{      
      this.todosLosInvtipos();
    })
  }

  todosLosInvtipos() {
    this.loading = true;    
    this.tipoInventarioServ.getDatos().then((resp: any) => {
      this.loading = false;
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
          this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente',resp.msj);   
        })       
      }
    })
  }



}
