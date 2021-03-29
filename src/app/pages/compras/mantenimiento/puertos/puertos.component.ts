import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { PuertosService } from 'src/app/services/puertos.service';
import { UiMessagesService } from 'src/app/services/ui-messages.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-puertos',
  templateUrl: './puertos.component.html',
  styleUrls: ['./puertos.component.scss']
})
export class PuertosComponent implements OnInit {

  usuario: any;
  index: number = 0;
  puerto: any[] = [];
  cols: any[];
  loading: boolean;
  listSubscribers: any = [];

  constructor(private uiMessage: UiMessagesService,
              private usuariosServ: UsuarioService,
              private puertosService: PuertosService,
              private confirmationService: ConfirmationService,
              public dialogService: DialogService) { 
                this.usuario = this.usuariosServ.getUserLogged();                
              }

  ngOnDestroy(): void {
    this.listSubscribers.forEach(a => a.unsubscribe());
  }
            
  ngOnInit(): void {
    this.todosLospuertos();
    this.listObserver();

    
    this.cols = [
      { field: 'id', header: 'Código' },
      { field: 'descripcion', header: 'Descripción' },
      { field: 'dias', header: 'Días' },
      { field: 'acciones', header: 'Acciones' },
    ]

  }

  listObserver = () => {
    
    const observer1$ = this.puertosService.guardar.subscribe((resp: any)=>{  
      this.index = resp;
    })

    const observer2$ = this.puertosService.puertoGuardada.subscribe(()=>{
      this.todosLospuertos();
    })

    const observer3$ = this.puertosService.puertoBorrada.subscribe(()=>{      
      this.todosLospuertos();   
    })

    const observer4$ = this.puertosService.puertoActualizada.subscribe(() => {
      this.todosLospuertos();
    })

    this.listSubscribers = [observer1$,observer2$,observer3$,observer4$];
   };

  todosLospuertos() {
    this.loading = true;
    this.puertosService.getDatos().then((resp: any) => {
      this.puerto = resp;
      this.loading = false;
    });
  }
  
  actualizarPuerto(data) {
    this.index = 1;   
    this.puertosService.actualizando(data);
  }

  borrarPuerto(puerto) { 
    this.confirmationService.confirm({
      message:"Esta seguro de borrar este registro?",
      accept:() =>{ 
        this.puertosService.borrarPuerto(puerto).then((resp: any)=>{
          this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente',resp.msj);   
        })       
      }
    })
  }


}
