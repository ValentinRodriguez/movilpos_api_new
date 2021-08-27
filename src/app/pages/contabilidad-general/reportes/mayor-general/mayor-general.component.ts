import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DatosEstaticosService } from 'src/app/services/globales/datos-estaticos.service';
import { TransacionPagosService } from 'src/app/services/contabilidad/transacion-pagos.service';
import { UiMessagesService } from 'src/app/services/globales/ui-messages.service';

import { groupBy } from 'lodash-es';
@Component({
  selector: 'app-mayor-general',
  templateUrl: './mayor-general.component.html',
  styleUrls: ['./mayor-general.component.scss']
})
export class MayorGeneralComponent implements OnInit {

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
      { field: 'fecha', header: 'Fecha' },
      { field: 'documento', header: 'Documento'},
      { field: 'detalle', header: 'Detalle'},
      { field: 'debito', header: 'Débito'},
      { field: 'credito', header: 'Crédito'},
      { field: 'balance', header: 'Balance'},
    ];    
    // this.exportColumns = this.cols.map(col => ({title: col.header, dataKey: col.field}));
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
      this.cgtransaccionesSev.mayorGeneral(this.forma.value).then((resp:any) =>{      
        if (resp.length === 0) {
          this.uiMessage.getMiniInfortiveMsg('tst','warn','Nada que mostrar','No hemos encontrado coincidencias con los datos suministrados');3
          this.mayor = [];
          return;
        }
        this.mayor = resp;               
      })
    }
  }

  limpiarForm(){
    this.crearFormulario();
    this.mayor = [];
  }
  
  onSelectDate(event, campo) {
    let d = new Date(Date.parse(event));
    this.forma.get(campo).setValue(`${d.getFullYear()}/${d.getMonth()+1}/${d.getDate()}`);
  }

  agrupaData(value: any, column: string) {   
    return groupBy(value, column)    
  }

  exportPdf() {
    const doc = new jsPDF('p', 'mm', 'a4');
    let pageWidth = doc.internal.pageSize.getWidth();
    const totalPagesExp = '{total_pages_count_string}'
    const anio = this.datosEstaticos.getDate();
    const hora = this.datosEstaticos.getHourAmp();
    const empresa = this.usuario.empresa.nombre || 'No Identificada'
    const nombre = this.datosEstaticos.capitalizeFirstLetter(this.usuario.empleado.primernombre);
    const apellido = this.datosEstaticos.capitalizeFirstLetter(this.usuario.empleado.primerapellido);

    var raw = this.bodyRows(this.mayor);    
    autoTable(doc, {
        head: this.headRows(),
        body: this.bodyRows(this.mayor),
        headStyles: { fillColor: [0, 128, 255] },
        didDrawPage: (dataArg) => { 
          // doc.text(anio+' '+hora, dataArg.settings.margin.right, 22, { align: "right" });
          // var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
          // var pageSize = doc.internal.pageSize
          
          //NOMBRE DE LA EMPRESA
          doc.text(empresa, pageWidth / 2, 10, { align: "center" });
          
          //NOMBRE DEL REPORTE 
          doc.setFontSize(10);                   
          doc.text('Mayor General', pageWidth / 2, 15, { align: "center" });

          // NUMERO DE PAGINA 
          var str = 'Página ' + doc.getNumberOfPages()
          
          if (typeof doc.putTotalPages === 'function') {
            str = str + ' / ' + totalPagesExp;
          }
          doc.text(str, 235, 15, {align: 'right',});
          
          //USUARIO CREADOR REPORTE
          doc.text(nombre+' '+apellido, dataArg.settings.margin.left, 20);
          
          //HORA CREACION REPORTE          
          doc.text(anio+' '+hora, 195, 20, {align: 'right',});
        },
        margin: { top: 30 },
        theme: 'grid',
    });
    if (typeof doc.putTotalPages === 'function') {
      doc.putTotalPages(totalPagesExp)      
    }
    doc.save('Mayor General.pdf');
  }

  headRows() {
    return [ {fecha:'Fecha' ,documento:'Documento', detalle:'Detalle', debito:'Debito', credito: 'Credito', balance: 'Balance'}]
  }  

  bodyRows(data) {
    var body = []
    data.forEach(element => {
      body.push({
        fecha: element.fecha,
        documento:element.documento,
        detalle: element.detalle,
        debito: element.debito || 0,
        credito: element.credito || 0,
        balance: element.balance || 0,
        Tbalance: element.Tbalance || 0,
        Tcredito: element.Tcredito || 0,
        Tdebito: element.Tdebito || 0
      })      
    });
    return body
  }
  
  onSort() {
    this.updateRowGroupMetaData();
  }

  updateRowGroupMetaData() {
    this.rowGroupMetadata = {};
    let totalDebito = 0;
    let totalCredito = 0;
    let totalBalance = 0;
    if (this.mayor) {
        for (let i = 0; i < this.mayor.length; i++) {
            let rowData = this.mayor[i];
            let representativeName = rowData.cuenta_no;

            totalDebito  += this.mayor[i].debito;
            this.mayor[i].Tdebito = totalDebito;

            totalCredito  += this.mayor[i].credito;
            this.mayor[i].Tcredito = totalCredito;

            totalBalance  += this.mayor[i].balance;
            this.mayor[i].Tbalance = totalBalance;

            if (i == 0) {
              this.rowGroupMetadata[representativeName] = { index: 0, size: 1 };
              totalDebito = 0;
              totalCredito = 0;
              totalBalance = 0;
            }
            else {
              let previousRowData = this.mayor[i - 1];
              let previousRowGroup = previousRowData.cuenta_no;
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
}
