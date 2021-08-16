import { Component, OnInit } from '@angular/core';
import { ConfirmationService, SelectItem } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { UiMessagesService } from 'src/app/services/globales/ui-messages.service';
import { UsuarioService } from 'src/app/services/panel-control/usuario.service';
import { AreasEmpresaService } from 'src/app/services/rrhh/areas-empresa.service';
import { TiendaService } from 'src/app/services/tienda/tienda.service';

@Component({
  selector: 'app-creacion-productos-tienda',
  templateUrl: './creacion-productos-tienda.component.html',
  styleUrls: ['./creacion-productos-tienda.component.scss']
})
export class CreacionProductosTiendaComponent implements OnInit {

  usuario: any;
  index: number = 0;
  productos: any[] = [];
  id_categoria: any;
  cols: any[];
  sortOptions: SelectItem[];
  sortOrder: number;
  sortField: string;
  
  constructor(private uiMessage: UiMessagesService,
              private usuariosServ: UsuarioService,
              private productosServ: TiendaService,
              private confirmationService: ConfirmationService,
              public dialogService: DialogService) { 
                this.usuario = this.usuariosServ.getUserLogged();                
              }

  ngOnInit(): void {
    this.todosLosProductos();

    this.productosServ.guardar.subscribe((resp: any)=>{  
      this.index = resp;
    });

    this.sortOptions = [
      {label: 'Price High to Low', value: '!price'},
      {label: 'Price Low to High', value: 'price'}
    ];

    this.cols = [
      { field: 'id', header: 'Código' },
      { field: 'descripcion', header: 'descripcion' },
      { field: 'sucursal', header: 'sucursal' },
      { field: 'empresa', header: 'empresa' },
      { field: 'departamento', header: 'departamento' },
      { field: 'acciones', header: 'Acciones' },
    ] 

    this.productosServ.productoGuardado.subscribe((resp: any)=>{
      this.todosLosProductos();
    })

    this.productosServ.productoBorrada.subscribe((resp: any)=>{      
      this.todosLosProductos();   
    })

    this.productosServ.productoAct.subscribe((resp: any) => {
      this.todosLosProductos();
    })
  }

  todosLosProductos() {
    this.productosServ.getDatos().subscribe((resp: any) => {
      this.productos = resp.data;
    });
  }
  
  actualizarArea(data) {
    this.index = 1;   
    // this.productosServ.actualizando(data);
  }

  borrarCategoria(categoria) { 
    this.confirmationService.confirm({
      message:"Esta seguro de borrar este registro?",
      accept:() =>{ 
        this.productosServ.borrarProducto(categoria).subscribe(()=>{
          this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro eliminado de manera correcta');   
        })       
      }
    })
  }

  onSortChange(event) {
    let value = event.value;

    if (value.indexOf('!') === 0) {
        this.sortOrder = -1;
        this.sortField = value.substring(1, value.length);
    }
    else {
        this.sortOrder = 1;
        this.sortField = value;
    }
}

}
