import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { PuestosService } from 'src/app/services/puestos.service';
import { UiMessagesService } from 'src/app/services/ui-messages.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-puestos',
  templateUrl: './puestos.component.html',
  styleUrls: ['./puestos.component.scss']
})
export class PuestosComponent implements OnInit {

  usuario: any;
  index: number = 0;
  puestos: any[] = [];
  id_categoria: any;
  cols: any[];
  loading: boolean;

  constructor(private uiMessage: UiMessagesService,
              private usuariosServ: UsuarioService,
              private puestosServ: PuestosService,
              private confirmationService: ConfirmationService,
              public dialogService: DialogService) { 
                this.usuario = this.usuariosServ.getUserLogged();                
              }

  ngOnInit(): void {
    this.todasLosPuestos();

    this.puestosServ.guardar.subscribe((resp: any)=>{  
      this.index = resp;
    })

    this.cols = [
      { field: 'id_puesto', header: 'Código' },
      { field: 'titulo', header: 'Título' },
      { field: 'descripcion', header: 'Desripción' },
      { field: 'sueldo_inicial', header: 'Sueldo Inicial' },
      { field: 'sueldo_actual', header: 'Sueldo Actual' },
      { field: 'acciones', header: 'Acciones' }
    ] 

    this.puestosServ.puestoGuardada.subscribe(()=>{
      this.todasLosPuestos();
    })

    this.puestosServ.puestoBorrada.subscribe(()=>{      
      this.todasLosPuestos();   
    })

    this.puestosServ.puestoAct.subscribe(() => {
      this.todasLosPuestos();
    })
  }

  todasLosPuestos() {
    this.loading = true;
    this.puestosServ.getDatos().then((resp: any) => {
       
      this.puestos = resp;
      this.loading = false;
    });
  }
  
  actualizarPuesto(data) {
    this.index = 1;   
    this.puestosServ.actualizando(data);
  }

  borrarPuesto(puesto) { 
    this.confirmationService.confirm({
      message:"Esta seguro de borrar este registro?",
      accept:() =>{ 
        this.puestosServ.borrarPuesto(puesto).then((resp: any)=>{
          this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente',resp.msj);   
        })       
      }
    })
  }

}
