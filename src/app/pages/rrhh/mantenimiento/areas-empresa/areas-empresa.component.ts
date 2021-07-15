import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { AreasEmpresaService } from 'src/app/services/areas-empresa.service';
import { UiMessagesService } from 'src/app/services/ui-messages.service';
import { UsuarioService } from 'src/app/services/usuario.service';

import { GlobalFunctionsService } from 'src/app/services/global-functions.service';
@Component({
  selector: 'app-areas-empresa',
  templateUrl: './areas-empresa.component.html',
  styleUrls: ['./areas-empresa.component.scss']
})
export class AreasEmpresaComponent implements OnInit {

  usuario: any;
  index: number = 0;
  areas: any[] = [];
  id_categoria: any;
  cols: any[];
  

  constructor(private globalFunction: GlobalFunctionsService,private uiMessage: UiMessagesService,
              private usuariosServ: UsuarioService,
              private areasServ: AreasEmpresaService,
              private confirmationService: ConfirmationService,
              public dialogService: DialogService) { 
                this.usuario = this.usuariosServ.getUserLogged();                
              }

  ngOnInit(): void {
    this.todasLasAreas();

    this.areasServ.guardar.subscribe((resp: any)=>{  
      this.index = resp;
    })

    this.cols = [
      { field: 'id', header: 'Código' },
      { field: 'descripcion', header: 'descripcion' },
      { field: 'sucursal', header: 'sucursal' },
      { field: 'empresa', header: 'empresa' },
      { field: 'departamento', header: 'departamento' },
      { field: 'acciones', header: 'Acciones' },
    ] 

    this.areasServ.areaGuardada.subscribe((resp: any)=>{
      this.todasLasAreas();
    })

    this.areasServ.areaBorrada.subscribe((resp: any)=>{      
      this.todasLasAreas();   
    })

    this.areasServ.areaAct.subscribe((resp: any) => {
      this.todasLasAreas();
    })
  }

  todasLasAreas() {
    this.areasServ.getDatos().then((resp: any) => {
      this.areas = resp;
    });
  }
  
  actualizarArea(data) {
    this.index = 1;   
    this.areasServ.actualizando(data);
  }

  borrarCategoria(categoria) { 
    this.confirmationService.confirm({
      message:"Esta seguro de borrar este registro?",
      accept:() =>{ 
        this.areasServ.borrarArea(categoria).then((resp: any)=>{
          this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro eliminado de manera correcta');   
        })       
      }
    })
  }


}
