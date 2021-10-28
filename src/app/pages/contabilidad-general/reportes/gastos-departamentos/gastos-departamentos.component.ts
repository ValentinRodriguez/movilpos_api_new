import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatosEstaticosService } from 'src/app/services/globales/datos-estaticos.service';
import { TransacionPagosService } from 'src/app/services/contabilidad/transacion-pagos.service';
import { UiMessagesService } from 'src/app/services/globales/ui-messages.service';


@Component({
  selector: 'app-gastos-departamentos',
  templateUrl: './gastos-departamentos.component.html',
  styleUrls: ['./gastos-departamentos.component.scss'],
  providers:[TransacionPagosService]
})
export class GastosDepartamentosComponent implements OnInit {

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
  gastos: any[] = [];
  
  listSubscribers: any = [];

  constructor(private cgtransaccionesSev:TransacionPagosService,              
              private fb: FormBuilder, 
              private uiMessage: UiMessagesService,
              private datosEstaticos: DatosEstaticosService) {                 
                this.crearFormulario()
              }

  ngOnDestroy(): void {
    this.listSubscribers.forEach(a => a.unsubscribe());
  }
            
  ngOnInit(): void {
    this.listObserver();

    this.cols = [
      { field: 'descripcion', header: 'Descripción' },
      { field: 'fecha', header: 'Fecha' },
      { field: 'factura', header: 'Factura' },
      { field: 'nom_sp', header: 'Proveedor'},
      { field: 'gasto', header: 'Gasto'},
    ];    
    this.exportColumns = this.cols.map(col => ({title: col.header, dataKey: col.field}));
  }
  
  listObserver = () => {
    this.listSubscribers = [];
  };
 
  crearFormulario() {
    this.forma = this.fb.group({
      cuenta_no:     [''],           
      fecha_inicial: ['', Validators.required],           
      fecha_final:   ['', Validators.required]           
    })
  }
  
  verReporte() {
    if (this.forma.invalid) {             
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios');      
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
      })
    }else{ 
      this.cgtransaccionesSev.gastosXdepartamentos(this.forma.value).then((resp:any) =>{      
        if (resp.length === 0) {
           (resp);
          this.uiMessage.getMiniInfortiveMsg('tst','warn','Nada que mostrar','No hemos encontrado coincidencias con los datos suministrados');3
          this.gastos = [];
          return;
        }
        this.gastos = resp; 
         (this.gastos);      
      })
    }
  }

  limpiarForm(){
    this.crearFormulario();
    this.gastos = [];
  }
  
  onSelectDate(event, campo) {
    let d = new Date(Date.parse(event));
    this.forma.get(campo).setValue(`${d.getFullYear()}/${d.getMonth()+1}/${d.getDate()}`);
  }

  exportPdf() {
    
  }

  headRows() {
    return [{ descripcion: 'Descripción', fecha: 'Fecha', factura: 'Factura', nom_sp: 'Proveedor', gasto: 'Gasto' }]
  }
  
  bodyRows(data) {
    var body = []
    data.forEach(element => {
      body.push({
        descripcion: '('+element.departamento+')'+element.descripcion,
        fecha: element.fecha,
        factura: element.factura,
        nom_sp: element.nom_sp,
        gasto: element.gasto
      })      
    });
    return body
  }

  getNoValido(input: string) {
    return this.forma.get(input).invalid && this.forma.get(input).touched;
  }
}
