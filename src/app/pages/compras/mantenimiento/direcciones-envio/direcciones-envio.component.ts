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
  formSubmitted = false;
  listSubscribers: any = [];
  constructor(private uiMessage: UiMessagesService,
              private usuariosServ: UsuarioService,
              private dirService: DireccionesService,
              private confirmationService: ConfirmationService,
              public dialogService: DialogService) { 
                this.usuario = this.usuariosServ.getUserLogged();                
              }

  ngOnDestroy(): void {
    this.listSubscribers.forEach(a => a.unsubscribe());
  }

  ngOnInit(): void {
    this.todasLasDirecciones();
    this.listObserver();

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
  }

  listObserver = () => {
    const observer1$ = this.dirService.guardar.subscribe((resp: any)=>{  
      this.index = resp;
    })

    const observer2$ = this.dirService.direccionGuardada.subscribe(()=>{
      this.todasLasDirecciones();
    })

    const observer3$ = this.dirService.direccionBorrada.subscribe(()=>{      
      this.todasLasDirecciones();   
    })

    const observer4$ = this.dirService.direccionActualizada.subscribe(() => {
      this.todasLasDirecciones();
    })

    const observer5$ = this.dirService.formSubmitted.subscribe((resp) => {
      this.formSubmitted = resp;
    })

    this.listSubscribers = [observer1$,observer2$,observer3$,observer4$,observer5$];
   };

  todasLasDirecciones() {
     
    this.dirService.getDatos().then((resp: any) => {
      this.direcciones = resp;
       
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
          this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro eliminado de manera correcta');   
        })       
      }
    })
  }


}
