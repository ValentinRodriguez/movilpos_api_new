import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { RrhhService } from 'src/app/services/rrhh/rrhh.service';

import { AmonestacionesComponent } from './amonestaciones/amonestaciones.component';
import { AusenciasComponent } from './ausencias/ausencias.component';
import { DescuentosComponent } from './descuentos/descuentos.component';
import { HorasExtrasComponent } from './horas-extras/horas-extras.component';
import { VacacionesComponent } from './vacaciones/vacaciones.component';

@Component({
  selector: 'app-gestion-empleados',
  templateUrl: './gestion-empleados.component.html',
  styleUrls: ['./gestion-empleados.component.scss'],
  providers:[RrhhService]
})
export class GestionEmpleadosComponent implements OnInit {
 
  empleados: any[] = [];
  usuario: any;
  actualizando = false;
  actualizar = false;
  cols: any[];
  
  listSubscribers: any = [];
  index = 0;

  constructor(private empleadosServ: RrhhService,
              
              private confirmationService: ConfirmationService,
              private dialogService: DialogService) { 
                ;
              }

  ngOnDestroy(): void {
    this.listSubscribers.forEach(a => a.unsubscribe());
  }
            
  ngOnInit(): void {    
    this.todosLosEmpleados();
    this.listObserver();
    
    this.cols = [
      { field: 'img_empleado', header: 'img' },
      { field: 'id', header: 'Código' },
      { field: 'cedula', header: 'Cédula' },
      { field: 'depto', header: 'Departamento' },
      { field: 'fecha_entrada', header: 'Entrada' },
      { field: 'sueldo', header: 'Sueldo' },
      { field: 'acciones', header: 'Acciones' },
    ] 
  }

  listObserver = () => {
    const observer2$ = this.empleadosServ.empleadoEscogido.subscribe(() => {
      this.todosLosEmpleados();
    });

    const observer3$ = this.empleadosServ.empleadoAct.subscribe(() => {
      this.todosLosEmpleados();
    });

    const observer4$ = this.empleadosServ.empleadoBorrado.subscribe(() => {
      this.todosLosEmpleados();
    });

    const observer5$ = this.empleadosServ.guardar.subscribe((resp: any) => {
            
      this.index = resp;
    });

    const observer6$ = this.empleadosServ.empleadoCreado.subscribe(() => {
      this.todosLosEmpleados();
    });

    this.listSubscribers = [observer2$,observer3$,observer4$, observer5$,observer6$];
  };

  todosLosEmpleados() {
    this.empleadosServ.getDatos().then((resp:any) =>{          
      this.empleados = resp;   
    })
  }

  actualizarEmpleado(data) {
    this.index = 1;   
    this.empleadosServ.actualizando(data);
  }

  duplicarEmpleado(data) {
    this.index = 1;   
    this.empleadosServ.duplicando(data);
  }
  ausenciasEmpleado(empleado) {
     this.dialogService.open(AusenciasComponent, {
      data: { empleado },
      header: `Ausencias ${empleado.primernombre} ${empleado.primerapellido}`,
      width: '70%'
    });
  }

  amonestacionesEmpleado(empleado) {
     this.dialogService.open(AmonestacionesComponent, {
      data: { empleado },
      header: `Amonestaciones ${empleado.primernombre} ${empleado.primerapellido}`,
      width: '70%'
    });
  }

  horasExtrasEmpleado(empleado) {
     this.dialogService.open(HorasExtrasComponent, {
      data: { empleado },
      header: `Horas Extras ${empleado.primernombre} ${empleado.primerapellido}`,
      width: '70%'
    });
  }

  incentivosEmpleado(empleado) {
     this.dialogService.open(HorasExtrasComponent, {
      data: { empleado },
      header: `Horas Extras ${empleado.primernombre} ${empleado.primerapellido}`,
      width: '70%'
    });
  }

  descuentosEmpleado(empleado) {
     this.dialogService.open(DescuentosComponent, {
      data: { empleado },
      header: `Descuentos ${empleado.primernombre} ${empleado.primerapellido}`,
      width: '70%'
    });
  }

  vacacionesEmpleado(empleado) {
     this.dialogService.open(VacacionesComponent, {
      data: { empleado },
      header: `Vacaciones ${empleado.primernombre} ${empleado.primerapellido}`,
      width: '70%'
    });
  }

  borrarEmpleado(empleado) { 
    this.confirmationService.confirm({
      message:"Esta seguro de borrar este registro?",
      accept:() =>{ 
           
      }
    })
  }

  onBasicUpload(files){  
  }
}
