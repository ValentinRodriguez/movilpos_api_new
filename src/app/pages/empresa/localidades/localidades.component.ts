import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { LocalidadesService } from 'src/app/services/localidades.service';
import { UiMessagesService } from 'src/app/services/ui-messages.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-localidades',
  templateUrl: './localidades.component.html',
  styleUrls: ['./localidades.component.scss']
})
export class LocalidadesComponent implements OnInit {

  usuario: any;
  index: number = 0;
  localidades: any[] = [];
  id_categoria: any;
  cols: any[];
  detalles: any;
   

  constructor(private uiMessage: UiMessagesService,
              private usuariosServ: UsuarioService,
              private localidadesServ: LocalidadesService,
              private confirmationService: ConfirmationService,
              public dialogService: DialogService) { 
                this.usuario = this.usuariosServ.getUserLogged();                
              }

  ngOnInit(): void {
    this.todasLasLocalidades();

    this.localidadesServ.guardar.subscribe((resp: any)=>{  
      this.index = resp;
    })

    this.cols = [
      { field: 'id', header: 'Código' },
      { field: 'descripcion', header: 'Descripción' },
      { field: 'acciones', header: 'Acciones' },
    ] 

    this.localidadesServ.localidadesGuardada.subscribe((resp: any)=>{
      this.todasLasLocalidades();
    })

    this.localidadesServ.localidadesBorrada.subscribe((resp: any)=>{      
      this.todasLasLocalidades();   
    })

    this.localidadesServ.localidadesAct.subscribe((resp: any) => {
      this.todasLasLocalidades();
    })
  }

  todasLasLocalidades() {
    this.localidadesServ.getDatos().then((resp: any) => {
      this.localidades = resp;
      console.log(resp);    
    });
  }
  
  actualizarMoneda(data) {
    this.index = 1;   
    this.localidadesServ.actualizando(data);
  }

  borrarCategoria(categoria) { 
    this.confirmationService.confirm({
      message:"Esta seguro de borrar este registro?",
      accept:() =>{ 
        this.localidadesServ.borrarLocalidades(categoria).then((resp: any)=>{
          this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro eliminado de manera correcta');   
        })       
      }
    })
  }

}
