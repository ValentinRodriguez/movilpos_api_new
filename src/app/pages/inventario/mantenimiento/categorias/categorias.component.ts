import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { CategoriasService } from 'src/app/services/categorias.service';
import { UiMessagesService } from 'src/app/services/ui-messages.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.scss']
})
export class CategoriasComponent implements OnInit {

  usuario: any; 
  categorias: any[] = [];
  actualizando = false; 
  actualizar = false;
  id_categoria: any;
  cols: any[];   
  index: number = 0;
    formSubmitted = false;
  listSubscribers: any = [];






  constructor(private uiMessage: UiMessagesService,
              private usuariosServ: UsuarioService,
              private categoriasServ: CategoriasService,
              private confirmationService: ConfirmationService,
              public dialogService: DialogService) { 
                this.usuario = this.usuariosServ.getUserLogged();
                this.todasLasCategorias();
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
    const observer1$ = this.categoriasServ.categoriaGuardada.subscribe(()=>{
      this.todasLasCategorias();
    })

    const observer2$ = this.categoriasServ.categoriaActualizada.subscribe(() => {
      this.todasLasCategorias();
    })

    const observer3$ = this.categoriasServ.guardar.subscribe((resp: any)=>{  
      this.index = resp;
    })

    const observer4$ = this.categoriasServ.categoriaBorrada.subscribe(()=>{
      this.todasLasCategorias();   
    })

    const observer5$ = this.categoriasServ.formSubmitted.subscribe((resp) => {
      this.formSubmitted = resp;
    })

    this.listSubscribers = [observer1$,observer5$,observer2$,observer3$,observer4$];
  };
   
  todasLasCategorias() {
    this.categoriasServ.getDatos().then((resp: any) => {       
      this.categorias = resp;
    })
  }

  actualizarCategoria(data) {
    this.index = 1;   
    this.categoriasServ.actualizando(data);
  }

  borrarCategoria(categoria) { 
    this.confirmationService.confirm({
      message:"Esta seguro de borrar este registro?",
      accept:() =>{ 
        this.categoriasServ.borrarCategoria(categoria).then((resp: any)=>{
          this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente',resp.msj);   
        })       
      }
    })
  }
}
