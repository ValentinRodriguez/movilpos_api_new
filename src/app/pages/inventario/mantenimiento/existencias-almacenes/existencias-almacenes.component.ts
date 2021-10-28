import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatosEstaticosService } from 'src/app/services/globales/datos-estaticos.service';
import { UiMessagesService } from 'src/app/services/globales/ui-messages.service';
import { ExistenciaAlmacenesService } from 'src/app/services/inventario/existencia-almacenes.service';


@Component({
  selector: 'app-existencias-almacenes',
  templateUrl: './existencias-almacenes.component.html',
  styleUrls: ['./existencias-almacenes.component.scss'],
  providers:[ExistenciaAlmacenesService]
})
export class ExistenciasAlmacenesComponent implements OnInit {

  forma: FormGroup;
  documento=[];
  tipo_proveedor=[];
  ciudades=[];
  paises=[];
  cuenta_no=[];
  condpago:any[] = [];
  selectedMultiMoneda: any[] = [];
  monedas: any;
  cedula = true;
  rnc = false; 
  usuario:any;
  selectedProducts: [];
  cols: any[];
  exportColumns: any[];
  mayor: any[] = [];  
  listSubscribers: any = [];
  rowGroupMetadata: any;
  productosFiltrados: any[] = [];
  tipoInventario: any;
  bodegas: any;
  productos: any;

  constructor(private existenciasServ:ExistenciaAlmacenesService,              
              private fb: FormBuilder, 
              private uiMessage: UiMessagesService,
              private datosEstaticos: DatosEstaticosService) { 
                ;
                this.crearFormulario()
              }

  ngOnDestroy(): void {
    this.listSubscribers.forEach(a => a.unsubscribe());
  }
            
  ngOnInit(): void {
    this.forma.get('fecha').setValue(new Date(Date.now()));
    this.listObserver();
    this.todaLaData();

    this.cols = [
      { field: 'producto', header: 'Producto' },
      { field: 'descripcion', header: 'Descripcion'},
      { field: 'almacen', header: 'Bodega'},
      { field: 'cantidad1', header: 'Existencia'},
      { field: 'cantidad_orden', header: 'Cantidad Orden'},
      { field: 'disponible', header: 'Disponible'},
      { field: 'reservado', header: 'Reservado'},
      { field: 'transito', header: 'Tránsito'},
    ];    
    // this.exportColumns = this.cols.map(col => ({title: col.header, dataKey: col.field}));
  }
  
  todaLaData() {   
    this.existenciasServ.autoLlenado().then((resp: any) =>{       
               
      resp.forEach(element => {
        switch (element.label) {
          case 'tipoInv':
            this.tipoInventario = element.data;
            break;

          case 'productos':
            this.productos = element.data;
            break;

          case 'bodegas':
            this.bodegas = element.data;
            break;

          default:
            break;
        }
      });  
    })
  }

  listObserver = () => {

    this.listSubscribers = [];
  };
 
  crearFormulario() {
    this.forma = this.fb.group({
      fecha:             ['', Validators.required],
      id_tipoinventario: [''], 
      id_bodega:         [''], 
      id_producto:       ['']          
    })
  }
  
  filtrarProducto(event) {
    const filtered: any[] = [];
    const query = event.query;
    for (let i = 0; i < this.productos.length; i++) {
      const size = this.productos[i];
      if (size.titulo.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(size);
      }
    }
    this.productosFiltrados = filtered;
    
  }

  verReporte() {
    if (this.forma.invalid) {             
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios');      
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
      })
    }else{     
      this.existenciasServ.existenciasAlmacen(this.forma.value).then((resp:any) =>{      
        if (resp.length === 0) {
          this.uiMessage.getMiniInfortiveMsg('tst','warn','Nada que mostrar','No hemos encontrado coincidencias con los datos suministrados');3
          this.mayor = [];
          return;
        }
                
        this.mayor = resp;         
        // let test = this.agrupaData(resp, 'cuenta_no');              
      })
    }
  }

  limpiarForm(){
    this.crearFormulario();
    this.mayor = [];
    this.forma.get('fecha').setValue(new Date(Date.now()));
  }
  
  onSelectDate(event, campo) {
    let d = new Date(Date.parse(event));
    this.forma.get(campo).setValue(`${d.getFullYear()}/${d.getMonth()+1}/${d.getDate()}`);
  }

  exportPdf() {
   
  }

  headRows() {
    return [ {producto:'Producto' ,descripcion:'Descripción', bodega:'Bodega', cantidad1:'Existencia', cantidad_orden: 'Cantidad Orden', 
              disponible: 'Disponible', reservado: 'Reservado', transito: 'Tránsito'}]}  
 
  bodyRows(data) {
    var body = []
    data.forEach(element => {
      body.push({
        fecha: element.fecha,
      })      
    });
    return body
  }
  
  onSort() {
    this.updateRowGroupMetaData();
  }

  updateRowGroupMetaData() {
    this.rowGroupMetadata = {};
    // let totalDebito = 0;
    // let totalCredito = 0;
    // let totalBalance = 0;
    if (this.mayor) {
        for (let i = 0; i < this.mayor.length; i++) {
            let rowData = this.mayor[i];
            let representativeName = rowData.id_bodega;

            // totalDebito  += this.mayor[i].debito;
            // this.mayor[i].Tdebito = totalDebito;

            // totalCredito  += this.mayor[i].credito;
            // this.mayor[i].Tcredito = totalCredito;

            // totalBalance  += this.mayor[i].balance;
            // this.mayor[i].Tbalance = totalBalance;

            if (i == 0) {
              this.rowGroupMetadata[representativeName] = { index: 0, size: 1 };
              // totalDebito = 0;
              // totalCredito = 0;
              // totalBalance = 0;
            }
            else {
              let previousRowData = this.mayor[i - 1];
              let previousRowGroup = previousRowData.id_bodega;
              if (representativeName === previousRowGroup)
                  this.rowGroupMetadata[representativeName].size++;
              else
                  this.rowGroupMetadata[representativeName] = { index: i, size: 1 };
            }
        }
    }
  }

  getNoValido(input: string) {
    return this.forma.get(input).invalid && this.forma.get(input).touched;
  }
test(data) {
  
}

}
