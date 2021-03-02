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
  loading: boolean;
  index: number = 0;
  constructor(private uiMessage: UiMessagesService,
              private usuariosServ: UsuarioService,
              private categoriasServ: CategoriasService,
              private confirmationService: ConfirmationService,
              public dialogService: DialogService) { 
                this.usuario = this.usuariosServ.getUserLogged();
                this.todasLasCategorias();
              }

  ngOnInit(): void {
    
    this.cols = [
      { field: 'id', header: 'Código' },
      { field: 'descripcion', header: 'Descripción' },
      { field: 'acciones', header: 'Acciones' },
    ] 

    this.categoriasServ.categoriaGuardada.subscribe((resp: any)=>{
      this.todasLasCategorias();
    })

    this.categoriasServ.categoriaBorrada.subscribe((resp: any)=>{
      this.todasLasCategorias();   
    })

    this.categoriasServ.categoriaActualizada.subscribe((resp: any) => {
      this.todasLasCategorias();
    })

    this.categoriasServ.guardar.subscribe((resp: any)=>{  
      this.index = resp;
    })
  }

  todasLasCategorias() {    
    this.loading = true;    
    this.categoriasServ.getDatos().then((resp: any) => {
      this.loading = false;
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
