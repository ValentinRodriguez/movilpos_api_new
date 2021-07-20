import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { DepartamentosService } from 'src/app/services/rrhh/departamentos.service';
import { UiMessagesService } from 'src/app/services/globales/ui-messages.service';
import { UsuarioService } from 'src/app/services/panel-control/usuario.service';

import { GlobalFunctionsService } from 'src/app/services/globales/global-functions.service';
@Component({
  selector: 'app-departamentos',
  templateUrl: './departamentos.component.html',
  styleUrls: ['./departamentos.component.scss']
})
export class DepartamentosComponent implements OnInit {
  
  usuario: any; 
  departamentos: any[] = [];
  actualizando = false; 
  actualizar = false;
  id_categoria: any;
  cols: any[];
  
  index: number = 0;

  constructor(private uiMessage: UiMessagesService,
              private usuariosServ: UsuarioService,
              private departamentoServ: DepartamentosService,
              private confirmationService: ConfirmationService,
              public dialogService: DialogService) { 
                this.usuario = this.usuariosServ.getUserLogged();
                this.todasLosDepartamentos();
              }

  ngOnInit(): void {
    
    this.cols = [
      { field: 'id', header: 'Código' },
      { field: 'titulo', header: 'Nombre' },
      { field: 'descripcion', header: 'Descripción'},
      { field: 'tipodepartamento', header: 'Tipo Departamento'},
      { field: 'acciones', header: 'Acciones' },
    ] 

    this.departamentoServ.guardar.subscribe((resp: any)=>{  
      this.index = resp;
    })

    this.departamentoServ.departamentoEscogido.subscribe((resp: any)=>{
      this.todasLosDepartamentos();
    })

    this.departamentoServ.departamentoBorrado.subscribe((resp: any)=>{      
     this.todasLosDepartamentos()  
    })

    this.departamentoServ.departamentoAct.subscribe((resp: any) => {
      this.todasLosDepartamentos();
    });
  }

  todasLosDepartamentos() {
    this.departamentoServ.getDatos().then((resp: any) => {
      this.departamentos = resp;
    })
  }

  actualizarDepartamento(data) {
    this.index = 1;   
    this.departamentoServ.actualizando(data);
  }

  borrarDepartamento(departamento) { 
    this.confirmationService.confirm({
      message:"Esta seguro de borrar este registro?",
      accept:() =>{ 
        this.departamentoServ.borrarDepartamento(departamento).then(()=>{
          this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro eliminado de manera correcta');   
        })       
      }
    })
  }

}
