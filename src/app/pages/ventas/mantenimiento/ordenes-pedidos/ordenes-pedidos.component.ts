import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { OrdenPedidosService } from 'src/app/services/orden-pedidos.service';
import { UiMessagesService } from 'src/app/services/ui-messages.service';

@Component({
  selector: 'app-ordenes-pedidos',
  templateUrl: './ordenes-pedidos.component.html',
  styleUrls: ['./ordenes-pedidos.component.scss']
})
export class OrdenesPedidosComponent implements OnInit {
 
  panelOpenState = false;
  cols: any[];  
  simbolo: any = '$';
  ordenes: any[] = [];
  loading: boolean;
  displayPosition: boolean;
  detalleDireccion: any = {};
  index: number = 0;

  constructor(private ordenServ :OrdenPedidosService,
              private uiMessage: UiMessagesService,
              private confirmationService: ConfirmationService,
              ){ }

  ngOnInit(): void {
    this.todosLasOrdenes(); 

    this.cols = [
      {field: 'num_oc', header: 'Orden'},
      {field: 'cotizacion_no', header: 'Cotización'},
      {field: 'fecha_orden', header: 'Fecha Orden'},
      {field: 'fecha_entrega', header: 'Fecha Entrega'},
      {field: 'nombre', header: 'Cliente'},
      {field: 'nombre_empleado', header: 'Vendedor'},
      // {field: 'direccion', header: 'Dirección'},
      {field: 'ubicacion', header: 'Ubicación'},
      {field: 'estado_despacho', header: 'Despachada'},
      {field: 'acciones', header: 'Acciones' }
    ]

    this.ordenServ.ordenCreada.subscribe(resp => {
      this.todosLasOrdenes();
    })

    this.ordenServ.ordenBorrada.subscribe(resp => {
      this.todosLasOrdenes();
    })

    this.ordenServ.ordenAct.subscribe(resp => {
      this.todosLasOrdenes();
    })

    this.ordenServ.guardar.subscribe(resp => {
      this.index = resp;
    })
  }

  todosLasOrdenes() {
    this.loading = true;
    this.ordenServ.getDatos().then((resp: any) => { 
      this.ordenes = resp;      
      this.loading = false
    })
  }

  boorarPedido(data) {
    this.confirmationService.confirm({
      message:"Esta seguro de borrar este registro?",
      accept:() =>{ 
        this.ordenServ.borrarOrden(data).then((resp: any)=>{
          this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente',resp.msj);   
        })       
      }
    })   
  }

  actualizarPedido(data) {
    this.index = 1;   
    this.ordenServ.actualizando(data);
  }

  detallesDirecion(data) {
    console.log(data);
    this.detalleDireccion.direccion = data.direccion;
    this.detalleDireccion.referencia = data.ubicacion;
    this.detalleDireccion.pais_cliente = data.pais_cliente;
    this.detalleDireccion.ciudad_cliente = data.ciudad_cliente;
    this.detalleDireccion.urbanizacion_cliente = data.urbanizacion_cliente;

    // this.detalleDireccion.direccion_cliente = data.direccion_cliente;
    
    console.log(this.detalleDireccion);
    this.displayPosition = true;
  }

}
