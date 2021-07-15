import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'jspdf-autotable';
import { SelectItem, ConfirmationService } from 'primeng/api';
import { InventarioService } from 'src/app/services/inventario.service';
import { TiendaService } from 'src/app/services/tienda.service';
import { UiMessagesService } from 'src/app/services/ui-messages.service';

import { GlobalFunctionsService } from 'src/app/services/global-functions.service';
@Component({
  selector: 'app-formulario-tienda',
  templateUrl: './formulario-tienda.component.html',
  styleUrls: ['./formulario-tienda.component.scss']
})
export class FormularioTiendaComponent implements OnInit {

  @ViewChild('dt') table: Table;
  sortOptions: SelectItem[];
  sortOrder: number;
  sortField: string;
  productos = [];
  selectedState: any = null;
  states: any[] = [];
  index: number = 0;
  cols: any[] = [];   
  
  listSubscribers: any = [];
  selectedProducts3: any = [];

  constructor(private globalFunction: GlobalFunctionsService,private inventarioServ: InventarioService,
              private miTienda: TiendaService,
              private uiMessage: UiMessagesService,
              private confirmationService: ConfirmationService) { }

  ngOnDestroy(): void {
    this.listSubscribers.forEach(a => a.unsubscribe());
  }

  ngOnInit(): void {
    this.todosLosProductos();
    this.listObserver();

    this.cols = [
      { field: 'id', header: '' },
      { field: 'imagen', header: 'Imagen' },
      { field: 'codigo', header: 'Código' },
      { field: 'marca', header: 'Marca' },
      { field: 'categoria', header: 'Modelo'},
      { field: 'propiedad', header: 'Color'},
      { field: 'almacen', header: 'Almacen' },
      { field: 'tipoinventario', header: 'Tipo inventario' },
      { field: 'cantidad', header: 'Cantidad' },
      { field: 'acciones', header: 'Acciones' },
    ]
  }
   
  listObserver = () => {
    const observer1$ = this.inventarioServ.productoGuardado.subscribe(()=>{
      this.todosLosProductos();
    })

    const observer2$ = this.inventarioServ.productoActualizado.subscribe(()=>{
      this.todosLosProductos();
    })

    const observer3$ = this.inventarioServ.productoBorrado.subscribe(()=>{      
      this.todosLosProductos();    
    })

    const observer4$ = this.inventarioServ.guardar.subscribe((resp: any)=>{    
      this.index = resp;
    })

    const observer6$ = this.inventarioServ.finalizar.subscribe((resp: number) =>{
      this.index = resp;
    })
    
    this.listSubscribers = [observer1$,observer2$,observer3$,observer4$,observer6$];
 };

  todosLosProductos() {     
    this.inventarioServ.getDatos().then((resp: any) =>{
      this.productos = resp;        
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

  guardarProducto(data) {
    console.log(data);
    this.miTienda.crearProducto(data).then((resp: any) => {
      console.log(resp);      
    })
    
  }

  borrarProducto(id) {
    this.confirmationService.confirm({
      message:"Esta seguro de borrar este registro?",
      accept:() =>{ 
        this.inventarioServ.borrarInvProducto(id).then((resp: any)=>{
          this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro eliminado de manera correcta');   
        })       
      }
    })
  }

}
