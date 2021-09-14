import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, SelectItem } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { GlobalFunctionsService } from 'src/app/services/globales/global-functions.service';
import { UiMessagesService } from 'src/app/services/globales/ui-messages.service';

import { TiendaService } from 'src/app/services/tienda/tienda.service';

@Component({
  selector: 'app-creacion-productos-tienda',
  templateUrl: './creacion-productos-tienda.component.html',
  styleUrls: ['./creacion-productos-tienda.component.scss'],
  providers:[TiendaService,TiendaService]
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
  listSubscribers: any = [];
  opciones: any[];
  tipoProducto: string = "basico";
  rating = 10;

  constructor(private uiMessage: UiMessagesService,              
              private productosServ: TiendaService,
              private confirmationService: ConfirmationService,
              private router: Router,
              private tiendaService: TiendaService,
              public dialogService: DialogService) {}

  ngOnInit(): void {
    this.listObserver();
    this.todosLosProductos();

    const rutaActual = this.router.url.split('/')
    if (rutaActual[3] === 'productos-compuestos') {
      this.tipoProducto = 'compuesto'      
    }

    this.opciones = [
      { label: 'Basico', value: 'basico' },
      // { label: 'Variable', value: 'variable' },
      { label: 'Compuesto', value: 'compuesto' },
      // { label: 'Digital', value: 'digital' },
    ];
    
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
  }

  ngOnDestroy() {
    this.listSubscribers.forEach(a => a.unsubscribe());
  }

  listObserver = () => {
    const observer1$ = this.productosServ.guardar.subscribe((resp: any)=>{  
      this.index = resp;
    });

    const observer2$ = this.productosServ.productoGuardado.subscribe((resp: any) => {
      this.todosLosProductos();
    });

    const observer3$ = this.productosServ.productoBorrada.subscribe((resp: any) => {
      this.todosLosProductos();
    });
      
    const observer4$ = this.productosServ.productoAct.subscribe((resp: any) => {
      this.todosLosProductos();
    });

    this.listSubscribers = [observer1$,observer2$,observer3$, observer4$];
  };

  todosLosProductos() {
    this.productosServ.getDatosProducto('productos-plaza').then((resp: any) => {
      this.productos = resp;  
    });
  }
  
  eliminarProducto(id){
    this.confirmationService.confirm({
      message:"Esta seguro de borrar este registro?",
      accept:() =>{ 
        this.productosServ.borrarProducto(id).then((resp: any)=>{
          this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro eliminado de manera correcta');   
        })       
      }
    })
  }

  actualizarProducto(data){
    this.index = 1;   
    this.tiendaService.actualizando(data);
  }

  borrarCategoria(id) { 
    this.confirmationService.confirm({
      message:"Esta seguro de borrar este registro?",
      accept:() =>{ 
        this.productosServ.borrarProducto(id).then(()=>{
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

  setTipo(e) {
    this.tiendaService.tipoProductos(e)
  }

}
