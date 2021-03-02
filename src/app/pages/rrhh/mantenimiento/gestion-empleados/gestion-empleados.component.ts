import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { RrhhService } from 'src/app/services/rrhh.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { AmonestacionesComponent } from './amonestaciones/amonestaciones.component';
import { AusenciasComponent } from './ausencias/ausencias.component';
import { DescuentosComponent } from './descuentos/descuentos.component';
import { HorasExtrasComponent } from './horas-extras/horas-extras.component';
import { VacacionesComponent } from './vacaciones/vacaciones.component';

@Component({
  selector: 'app-gestion-empleados',
  templateUrl: './gestion-empleados.component.html',
  styleUrls: ['./gestion-empleados.component.scss']
})
export class GestionEmpleadosComponent implements OnInit {
 
  empleados: any[] = [];
  usuario: any;
  actualizando = false;
  actualizar = false;
  cols: any[];

  constructor(private empleadosServ: RrhhService,
              private usuariosServ: UsuarioService,
              private confirmationService: ConfirmationService,
              private dialogService: DialogService) { 
                this.usuario = this.usuariosServ.getUserLogged();
              }

  ngOnInit(): void {    
    this.todosLosEmpleados();

    this.cols = [
      { field: 'foto_empleado', header: 'Foto' },
      { field: 'id_numemp', header: 'Código' },
      { field: 'cedula', header: 'Cédula' },
      { field: 'depto', header: 'Departamento' },
      { field: 'fecha_entrada', header: 'Entrada' },
      { field: 'sueldo', header: 'Sueldo' },
      { field: 'acciones', header: 'Acciones' },
    ] 
  }

  todosLosEmpleados() {
    this.empleadosServ.getDatos().then((resp:any) =>{
      console.log(resp);   
      this.empleados = resp;   
    })
  }

  actualizarEmpleado(empleado) {
    
  }

  ausenciasEmpleado(empleado) {
    const ref = this.dialogService.open(AusenciasComponent, {
      data: { empleado },
      header: `Ausencias ${empleado.primernombre} ${empleado.primerapellido}`,
      width: '70%'
    });
  }

  amonestacionesEmpleado(empleado) {
    const ref = this.dialogService.open(AmonestacionesComponent, {
      data: { empleado },
      header: `Amonestaciones ${empleado.primernombre} ${empleado.primerapellido}`,
      width: '70%'
    });
  }

  horasExtrasEmpleado(empleado) {
    const ref = this.dialogService.open(HorasExtrasComponent, {
      data: { empleado },
      header: `Horas Extras ${empleado.primernombre} ${empleado.primerapellido}`,
      width: '70%'
    });
  }

  incentivosEmpleado(empleado) {
    const ref = this.dialogService.open(HorasExtrasComponent, {
      data: { empleado },
      header: `Horas Extras ${empleado.primernombre} ${empleado.primerapellido}`,
      width: '70%'
    });
  }

  descuentosEmpleado(empleado) {
    const ref = this.dialogService.open(DescuentosComponent, {
      data: { empleado },
      header: `Descuentos ${empleado.primernombre} ${empleado.primerapellido}`,
      width: '70%'
    });
  }

  vacacionesEmpleado(empleado) {
    const ref = this.dialogService.open(VacacionesComponent, {
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
    console.log(files);    
  }
}
