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
 
  cuenta_no: any;  
  constructor(private uiMessage: UiMessagesService,
    private proveedoresServ:ProveedoresService,
    private confirmationService: ConfirmationService) {
    }

    ngOnInit(): void {
      this.todosLosProveedores();
      
      this.proveedoresServ.proveedoresCreados.subscribe((resp: any) =>{
        this.todosLosProveedores();
      })

      this.cols = [
        { field: 'nom_sp', header: 'Proveedor' },
        { field: 'rnc', header: 'RNC' },
        { field: 'tel_sp', header: 'Teléfono' },
        { field: 'email', header: 'Email' },
        { field: 'ciudad', header: 'Ciudad' },
        { field: 'acciones', header: 'Acciones' },
      ] 
    }

    todosLosProveedores() {
      this.proveedoresServ.getDatos().then((resp: any) => {
        this.proveedores = resp;     
      })
    }

    actualizarProveedor(producto) { 
      
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
