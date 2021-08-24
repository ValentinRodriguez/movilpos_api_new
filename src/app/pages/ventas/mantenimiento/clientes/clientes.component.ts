import { Component, OnInit } from '@angular/core';

import { ConfirmationService } from 'primeng/api';
import { ClientesService } from 'src/app/services/ventas/clientes.service';
import { UiMessagesService } from 'src/app/services/globales/ui-messages.service';


@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss'],
  providers:[ClientesService,]
})
export class ClientesComponent implements OnInit {

  clientes : any[] = [];
  page = 1;
  actualizando = false; 
  clienteExiste = 3;
  tipo_cliente=[];
  vendedor=[];
  parametro: string;
  usuario: any;
  cols: any[];
  index: number = 0;
  listSubscribers: any = [];

  constructor( private uiMessage: UiMessagesService,
               
               private clientesServ: ClientesService,
               private confirmationService: ConfirmationService) {
                ;
  }

  ngOnDestroy(): void {
    this.listSubscribers.forEach(a => a.unsubscribe());
  }

  ngOnInit(): void {
    this.todosLosClientes();
    this.listObserver();
    this.cols = [
      { field: 'nombre', header: 'Cliente' },
      { field: 'documento', header: 'Documento' },
      { field: 'email', header: 'Email' },
      { field: 'celular', header: 'Celular' },
      { field: 'acciones', header: 'Acciones' },
    ] 
  }
  
  listObserver = () => {
    const observer1$ = this.clientesServ.ClienteCreado.subscribe(()=>{
      this.todosLosClientes()
    })
  
    const observer2$ = this.clientesServ.clientAct.subscribe(()=>{
      this.todosLosClientes()
    })
  
    const observer3$ = this.clientesServ.clienteBorrado.subscribe(()=>{
      this.todosLosClientes()
    })   
  
    const observer4$ = this.clientesServ.finalizar.subscribe((resp: number)=>{
      this.index = resp;
    })

    this.listSubscribers = [observer1$,observer2$,observer3$,observer4$];
  };
   
  todosLosClientes() {
    this.clientesServ.getDatos().then((resp: any) => {
      this.clientes = resp;  
    })
  }
  
  actualizarCliente(data) {     
    this.index = 1;   
    this.clientesServ.actualizando(data);     
  }

  borrarCliente(id) {
    this.confirmationService.confirm({
      message:"Esta seguro de borrar este registro?",
      accept:() =>{ 
        this.clientesServ.borrarCliente(id).then((resp: any)=>{
          this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro eliminado de manera correcta');   
        })       
      }
    })
  }
}
