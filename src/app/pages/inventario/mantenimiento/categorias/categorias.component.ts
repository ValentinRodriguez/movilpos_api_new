import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { CategoriasService } from 'src/app/services/inventario/categorias.service';
import { UiMessagesService } from 'src/app/services/globales/ui-messages.service';


@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.scss'],
  providers:[CategoriasService]
})
export class CategoriasComponent implements OnInit {

  usuario: any; 
  categorias: any[] = [];
  actualizando = false; 
  actualizar = false;
  id_categoria: any;
  cols: any[];   
  index: number = 0;    
  listSubscribers: any = [];

  constructor(private uiMessage: UiMessagesService,              
              private categoriasServ: CategoriasService,
              private confirmationService: ConfirmationService,
              public dialogService: DialogService) {                 
                this.todasLasCategorias();
              }
  ngOnDestroy(): void {
    this.listSubscribers.forEach(a => a.unsubscribe());
  }

  ngOnInit(): void {
    this.listObserver();
    this.cols = [
      { field: 'uid', header: 'Código' },
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

    this.listSubscribers = [observer1$,observer2$,observer3$,observer4$];
  };
   
  todasLasCategorias() {
    this.categoriasServ.getDatos().subscribe((resp: any) => {  
      console.log(resp.data);
      
      if (resp.ok) {
        this.categorias = resp.data;        
      }     
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
          this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro eliminado de manera correcta');   
          this.categoriasServ.categoriaBorrada.emit(true);
        })       
      }
    })
  }
}
