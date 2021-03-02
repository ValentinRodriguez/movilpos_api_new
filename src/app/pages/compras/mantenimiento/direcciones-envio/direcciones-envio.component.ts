import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { DireccionesService } from 'src/app/services/direcciones.service';
import { UiMessagesService } from 'src/app/services/ui-messages.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-direcciones-envio',
  templateUrl: './direcciones-envio.component.html',
  styleUrls: ['./direcciones-envio.component.scss']
})
export class DireccionesEnvioComponent implements OnInit {

  usuario: any;
  index: number = 0;
  direcciones: any[] = [];
  id_categoria: any;
  cols: any[];
  loading: boolean;

  constructor(private uiMessage: UiMessagesService,
              private usuariosServ: UsuarioService,
              private dirService: DireccionesService,
              private confirmationService: ConfirmationService,
              public dialogService: DialogService) { 
                this.usuario = this.usuariosServ.getUserLogged();                
              }

  ngOnInit(): void {
    this.todasLasDirecciones();

    this.dirService.guardar.subscribe((resp: any)=>{  
      this.index = resp;
    })
    
    this.cols = [
      { field: 'id', header: 'Código' },
      { field: 'nombre', header: 'Representante' },
      { field: 'direccion_a', header: 'Direccion_a' },
      { field: 'direccion_b', header: 'Direccion_b' },
      { field: 'ciudad', header: 'Ciudad' },
      { field: 'pais', header: 'Pais' },
      { field: 'telefono', header: 'Teléfono' },
      { field: 'acciones', header: 'Acciones' },
    ] 

    this.dirService.direccionGuardada.subscribe((resp: any)=>{
      this.todasLasDirecciones();
    })

    this.dirService.direccionBorrada.subscribe((resp: any)=>{      
      this.todasLasDirecciones();   
    })

    this.dirService.direccionActualizada.subscribe((resp: any) => {
      this.todasLasDirecciones();
    })
  }

  todasLasDirecciones() {
    this.loading = true;
    this.dirService.getDatos().then((resp: any) => {
      this.direcciones = resp;
      this.loading = false;
    });
  }
  
  actualizarMoneda(data) {
    this.index = 1;   
    this.dirService.actualizando(data);
  }

  borrarCategoria(direccion) { 
    this.confirmationService.confirm({
      message:"Esta seguro de borrar este registro?",
      accept:() =>{ 
        this.dirService.borrarDireccion(direccion).then((resp: any)=>{
          this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente',resp.msj);   
        })       
      }
    })
  }


}
