import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { RrhhService } from 'src/app/services/rrhh/rrhh.service';
import { UiMessagesService } from 'src/app/services/globales/ui-messages.service';
import { UsuarioService } from 'src/app/services/panel-control/usuario.service';


@Component({
  selector: 'app-listado-empleados',
  templateUrl: './listado-empleados.component.html',
  styleUrls: ['./listado-empleados.component.scss']
})
export class ListadoEmpleadosComponent implements OnInit {

  empleado: any[] = [];
  empleadosSeleccionados: any;
  productos: any[] = [];
  cols: any[]= [];
   

  constructor(private empleadosServ: RrhhService,
              private ref: DynamicDialogRef,
              private usuariosServ: UsuarioService,
              private uiMessage: UiMessagesService) { }

  ngOnInit(): void {
    this.todosLosEmpleados();
    this.cols = [
      { field: 'esc', header: '' },
      { field: 'primernombre', header: 'Nombre' },
      { field: 'cedula', header: 'Cedula' },
      { field: 'depto', header: 'Departamento' }
    ] 
  }

  todosLosEmpleados() {
     
    this.empleadosServ.getDatos().then((resp: any) => {
      this.empleado = resp;
       
    })
  }

  enviarEmpleado() {
    if (this.empleadosSeleccionados !== null) {      
      this.usuariosServ.busquedaNumEmp(this.empleadosSeleccionados.id).subscribe((res: any) => {        
        if (res.length !== 0) {
          const usuario = res[0].username.toUpperCase();
          this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR',`Este empleado ya tiene el usuario ${usuario} creado`);         
        }else{
          this.empleadosServ.empleadoEscogidos(this.empleadosSeleccionados)
          this.ref.close(); 
        }
      })
    } else {
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe escoger al menos una cuenta');
    }
  }
}
