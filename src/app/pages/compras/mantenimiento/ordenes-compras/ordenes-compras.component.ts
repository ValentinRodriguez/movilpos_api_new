import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { OrdenescomprasService } from 'src/app/services/ordenescompras.service';
import { UiMessagesService } from 'src/app/services/ui-messages.service';
import { environment } from 'src/environments/environment';

const URL = environment.url;

@Component({
  selector: 'app-ordenes-compras',
  templateUrl: './ordenes-compras.component.html',
  styleUrls: ['./ordenes-compras.component.scss']
})

export class OrdenesComprasComponent implements OnInit {

  ordenes:any[]=[];
  listSubscribers: any = [];
  index: number = 0;
  cols: any[];
  formSubmitted = false;
  constructor(private uiMessage: UiMessagesService,              
              private ordenServ :OrdenescomprasService,              
              private confirmationService: ConfirmationService, 
              private router: Router) { }

  ngOnDestroy(): void {
    this.listSubscribers.forEach(a => a.unsubscribe());
  }

  ngOnInit(): void {
    this.todosLasOrdenes();
    this.listObserver();
    
    this.cols = [
      { field: 'num_oc', header: 'Orden' },
      { field: 'nom_sp', header: 'Proveedor' },
      //{ field: 'numero_proforma', header: 'Proforma' },
      { field: 'descripcion_pago', header: 'Condición' },
      { field: 'pagada', header: 'Pagada' },
      { field: 'orden_cerrada', header: 'Cerrada' },
      { field: 'total_itbis', header: 'Itbis' },
      { field: 'total_desc', header: 'Descuento' },
      { field: 'total_bruto', header: 'Bruto' },
      { field: 'total_neto', header: 'Neto' },
      { field: 'fecha_enviada', header: 'Fecha' },
      { field: 'acciones', header: 'Acciones' }
    ] 
  }
 
  listObserver = () => {    
    const observer1$ = this.ordenServ.ordenGuardada.subscribe(() =>{
      this.todosLasOrdenes();
    })

    const observer2$ = this.ordenServ.ordenBorrada.subscribe(() =>{
      this.todosLasOrdenes();
    })

    const observer3$ = this.ordenServ.ordenact.subscribe(() =>{
      this.todosLasOrdenes();
    })

    const observer4$ = this.ordenServ.finalizar.subscribe((resp) => {
      this.index = resp;
    })

    this.listSubscribers = [observer1$,observer2$,observer3$,observer4$];
  };
  
  todosLasOrdenes() {     
    this.ordenServ.getDatos().then((resp: any) => {       
      this.ordenes = resp;
      console.log(resp);      
    })
  }

  actualizarOrdenes(producto) { 
    this.router.navigate(['actualizar-orden-compra',producto.id]);
  }

  borrarOrden(orden) {
    this.confirmationService.confirm({
      message:"Esta seguro de borrar este registro?",
      accept:() =>{ 
        this.ordenServ.borrar(orden).then((resp: any)=>{
          this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro eliminado de manera correcta');   
        })       
      }
    })   
  }
   
}
