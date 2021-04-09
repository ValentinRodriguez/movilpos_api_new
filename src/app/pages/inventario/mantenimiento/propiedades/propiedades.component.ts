import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { PropiedadesService } from 'src/app/services/propiedades.service';
import { UiMessagesService } from 'src/app/services/ui-messages.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-propiedades',
  templateUrl: './propiedades.component.html',
  styleUrls: ['./propiedades.component.scss']
})
export class PropiedadesComponent implements OnInit {

  usuario: any; 
  propiedades: any[] = [];
  actualizando = false; 
  actualizar = false;
  cols: any[];
    formSubmitted = false;
  listSubscribers: any = [];

  constructor(private uiMessage: UiMessagesService,
              private usuariosServ: UsuarioService,
              private propiedadesServ: PropiedadesService,
              private confirmationService: ConfirmationService,
              public dialogService: DialogService) { 
                this.usuario = this.usuariosServ.getUserLogged();
                this.todasLasPropiedades();
              }
              ngOnDestroy(): void {
                this.listSubscribers.forEach(a => a.unsubscribe());
              }
  ngOnInit(): void {
    this.listObserver();
    this.cols = [
      { field: 'id', header: 'Código' },
      { field: 'descripcion', header: 'Descripción' },
      { field: 'acciones', header: 'Acciones' },
    ] 
  }

  listObserver = () => {    
    const observer1$ = this.propiedadesServ.propiedadActualizada.subscribe(() => {
      this.todasLasPropiedades();
    })

    const observer2$ = this.propiedadesServ.propiedadGuardada.subscribe(()=>{
      this.todasLasPropiedades();
    })

    const observer3$ = this.propiedadesServ.propiedadBorrada.subscribe(()=>{      
      this.todasLasPropiedades();    
    })

    const observer5$ = this.propiedadesServ.formSubmitted.subscribe((resp) => {
      this.formSubmitted = resp;
    })
    
    this.listSubscribers = [observer1$,observer5$,observer2$,observer3$];
  };
  todasLasPropiedades() {
    this.propiedadesServ.getDatos().then((resp: any) => {
      if (resp) {
        this.propiedades = resp;        
      }
    })
  }

  actualizarPropiedad(propiedad) {

  }

  borrarPropiedad(propiedad) { 
    this.confirmationService.confirm({
      message:"Esta seguro de borrar este registro?",
      accept:() =>{ 
        this.propiedadesServ.borrarPropiedad(propiedad).then((resp: any)=>{
          this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente',resp.msj);   
        })       
      }
    })
  }

}
