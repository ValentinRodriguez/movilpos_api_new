import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { CgcatalogoService } from 'src/app/services/cgcatalogo.service';
import { DatosEstaticosService } from 'src/app/services/datos-estaticos.service';
import { UiMessagesService } from 'src/app/services/ui-messages.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-catalogo-cuentas',
  templateUrl: './catalogo-cuentas.component.html',
  styleUrls: ['./catalogo-cuentas.component.scss']
})
export class CatalogoCuentasComponent implements OnInit {

  usuario: any; 
  cuentas: any[] = [];
  actualizando = false;
  actualizar = false;
  id_categoria: any;
  cols: any[];
  data: any[] = [];

  constructor(private uiMessage: UiMessagesService,
              private usuariosServ: UsuarioService,
              private cgcatalogoServ: CgcatalogoService,
              private confirmationService: ConfirmationService,
              public dialogService: DialogService,
              public datos: DatosEstaticosService) { 
                this.usuario = this.usuariosServ.getUserLogged();
                this.todosLosCatalogos();
              }

  ngOnInit(): void {    
    //this.datos.getFiles().then(resp => console.log(resp))
    this.cols = [
      { field: 'descripcion', header: 'Descripción'},
      { field: 'cuenta_no', header: 'Cuenta'},
      { field: 'origen', header: 'Origen'},
      { field: 'aplica_a', header: 'Cuenta Aplica'},
      { field: 'tipo_cuenta', header: 'Tipo Cuenta'},
      { field: 'codigo_isr', header: 'Código ISR'},
      { field: 'catalogo', header: 'Catálogo'},
      { field: 'referencia', header: 'Referencia'},
      { field: 'depto', header: 'Departamento'},
      { field: 'selectivo_consumo', header: 'Selectivo Consumo'},
      { field: 'retencion', header: 'Retención'},
      { field: 'acciones', header: 'Acciones'},
    ] 

    this.cgcatalogoServ.catalogoGuardado.subscribe((resp: any)=>{
      this.todosLosCatalogos();
    })

    this.cgcatalogoServ.catalogoActualizado.subscribe((resp: any)=>{      
      this.todosLosCatalogos();   
    })

    this.cgcatalogoServ.catalogoBorrado.subscribe((resp: any) => {
      this.todosLosCatalogos();
    })
  }

  todosLosCatalogos() {
    this.cgcatalogoServ.getDatos().then((resp: any) => {
      this.cuentas = resp;
      resp.forEach(element => {
        if (element.nivel === 1) {
          this.data.push( {"data":{  
            "descripcion": element.descripcion,
            "cuenta_no": element.cuenta_no,
            "origen": element.origen,
            "aplica_a": element.aplica_a,
            "tipo_cuenta": element.tipo_cuenta,
            "codigo_isr": element.codigo_isr,
            "catalogo": element.catalogo,
            "referencia": element.referencia,
            "depto": element.depto,
            "selectivo_consumo": element.selectivo_consumo,
            "retencion": element.retencion,
            "acciones": element.acciones
            }})
        }

        if (element.nivel === 2) {
          let temp = this.data.find(index => {return index.data.cuenta_no === element.aplica})
          console.log(temp);
          
        }
      });
      console.log(this.data);
      
    })
  }

  actualizarTransportista(transportista) {
    
  }

  borrarTransportista(transportista) { 
    this.confirmationService.confirm({
      message:"Esta seguro de borrar este registro?",
      accept:() =>{ 
        this.cgcatalogoServ.borrarCatalogo(transportista).then((resp: any)=>{
          this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente',resp.msj);   
        })       
      }
    })
  }

}
