import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ProveedoresService } from 'src/app/services/proveedores.service';
import { UiMessagesService } from 'src/app/services/ui-messages.service';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.scss']
})
export class ProveedoresComponent implements OnInit {

 
  proveedores: any[]=[];  
  cols: any[]; 
  index: number = 0;
  cuenta_no: any;  
  listSubscribers: any = [];
  constructor(private uiMessage: UiMessagesService,
    private proveedoresServ:ProveedoresService,
    private confirmationService: ConfirmationService) {
  }

  ngOnDestroy(): void {
    this.listSubscribers.forEach(a => a.unsubscribe());
  }
  
  ngOnInit(): void {
    this.todosLosProveedores();
    this.listObserver();


    this.cols = [
      { field: 'nom_sp', header: 'Proveedor' },
      { field: 'documento', header: 'Documento' },
      { field: 'tel_sp', header: 'Teléfono' },
      { field: 'email', header: 'Email' },
      { field: 'ciudad', header: 'Ciudad' },
      { field: 'acciones', header: 'Acciones' },
    ] 
  }

  listObserver = () => {
    const observer1$ = this.proveedoresServ.guardar.subscribe((resp: any)=>{  
      this.index = resp;
    })

    const observer2$ = this.proveedoresServ.proveedoresCreados.subscribe(() =>{
      this.todosLosProveedores();
    })

    const observer3$ = this.proveedoresServ.proveeact.subscribe(() =>{
      this.todosLosProveedores();
    })

    const observer4$ = this.proveedoresServ.proveedorBorrado.subscribe(() =>{
      this.todosLosProveedores();
    })
    
    this.listSubscribers = [observer1$,observer2$,observer3$,observer4$];
   };

  todosLosProveedores() {
    this.proveedoresServ.getDatos().then((resp: any) => {
      this.proveedores = resp; 
      console.log(resp);
    })
  }

  actualizarProveedor(cod_sp, cod_sp_sec) { 
    this.index = 1;   
    this.proveedoresServ.actualizando(cod_sp, cod_sp_sec);
  }
    
  borrarProveedor(id) {
    this.confirmationService.confirm({
      message:"Esta seguro de borrar este registro?",
      accept:() =>{ 
        this.proveedoresServ.borrarProveedor(id).then((resp: any)=>{
          this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente',resp.msj);   
        })       
      }
    }) 
  }
}
