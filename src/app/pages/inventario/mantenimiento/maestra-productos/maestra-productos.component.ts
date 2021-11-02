import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { InventarioService } from 'src/app/services/inventario/inventario.service';
import { UiMessagesService } from 'src/app/services/globales/ui-messages.service';
import { GlobalFunctionsService } from 'src/app/services/globales/global-functions.service';

@Component({
  selector: 'app-maestra-productos',
  templateUrl: './maestra-productos.component.html',
  styleUrls: ['./maestra-productos.component.scss'],
  providers:[InventarioService]
})
export class MaestraProductosComponent implements OnInit {

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

  constructor(private inventarioServ: InventarioService,
              private uiMessage: UiMessagesService,
              private confirmationService: ConfirmationService) { }

  ngOnDestroy(): void {
    this.listSubscribers.forEach(a => a.unsubscribe());
  }

  ngOnInit(): void {
    this.todosLosProductos();
    this.listObserver();

    this.cols = [
       { field: 'img', header:''},
       { field: 'regular_price', header: 'precio regular'},
       { field: 'precio', header: 'precio'},
       { field: 'categoria', header: 'categoria'},
       { field: 'proveedor', header: 'Proveedor'},
       { field: 'disponible', header: 'disponible'},
       { field: 'average_rating', header: 'rating'},
       { field: 'envios', header: 'envios'},
       { field: 'stock_quantity', header: 'cantidad'},
       { field: 'acciones', header: 'Acciones'}
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
    this.inventarioServ.getDatos().subscribe((resp: any) =>{   
      console.log(resp);      
      if (resp.ok) {     
        this.productos = resp.data;           
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

  actualizarProducto(data) {
    this.index = 1;   
    this.inventarioServ.actualizando(data);
  }

  borrarProducto(id) {
    console.log(id);
    
    this.confirmationService.confirm({
      message:"Esta seguro de borrar este registro?",
      accept:() =>{ 
        this.inventarioServ.borrarInvProducto(id).subscribe((resp: any)=>{
          if (resp.ok) {
            this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro eliminado de manera correcta');   
            this.inventarioServ.productoBorrado.emit(resp.data)
          }
        })       
      }
    })
  }
}
