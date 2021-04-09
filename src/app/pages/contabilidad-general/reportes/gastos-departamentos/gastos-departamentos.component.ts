import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DatosEstaticosService } from 'src/app/services/datos-estaticos.service';
import { PaisesCiudadesService } from 'src/app/services/paises-ciudades.service';
import { ProveedoresService } from 'src/app/services/proveedores.service';
import { TransacionPagosService } from 'src/app/services/transacion-pagos.service';
import { UiMessagesService } from 'src/app/services/ui-messages.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-gastos-departamentos',
  templateUrl: './gastos-departamentos.component.html',
  styleUrls: ['./gastos-departamentos.component.scss']
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
  formSubmitted = false;
  listSubscribers: any = [];

  constructor(private cgtransaccionesSev:TransacionPagosService,
              private usuariosServ: UsuarioService,
              private fb: FormBuilder, 
              private uiMessage: UiMessagesService,
              private datosEstaticos: DatosEstaticosService) { 
                this.usuario = this.usuariosServ.getUserLogged();
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
    const observer1$ = this.cgtransaccionesSev.formSubmitted.subscribe((resp:any) =>{
      this.formSubmitted = resp;
    })

    this.listSubscribers = [observer1$];
  };
 
  crearFormulario() {
    this.forma = this.fb.group({
      cuenta_no:     [''],           
      fecha_inicial: [''],           
      fecha_final:   ['']           
    })
  }
  
  verReporte() {
    this.formSubmitted = true;
    this.cgtransaccionesSev.gastosXdepartamentos(this.forma.value).then((resp:any) =>{      
      if (resp.length === 0) {
        console.log(resp);
        this.uiMessage.getMiniInfortiveMsg('tst','warn','Nada que mostrar','No hemos encontrado coincidencias con los datos suministrados');3
        this.gastos = [];
        return;
      }
      this.gastos = resp; 
      console.log(this.gastos);      
    })
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
    const doc = new jsPDF('p', 'mm', 'a4');
    let pageWidth = doc.internal.pageSize.getWidth();
    const totalPagesExp = '{total_pages_count_string}'
    const anio = this.datosEstaticos.getDate();
    const hora = this.datosEstaticos.getHourAmp();
    const empresa = this.usuario.empresa.nombre || 'No Identificada'
    const nombre = this.datosEstaticos.capitalizeFirstLetter(this.usuario.empleado.primernombre);
    const apellido = this.datosEstaticos.capitalizeFirstLetter(this.usuario.empleado.primerapellido);

    autoTable(doc, {
        head: this.headRows(),
        body: this.bodyRows(this.gastos),
        headStyles: { fillColor: [0, 128, 255] },
        didDrawPage: (dataArg) => { 
          // doc.text(anio+' '+hora, dataArg.settings.margin.right, 22, { align: "right" });
          // var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
          // var pageSize = doc.internal.pageSize
          
          //NOMBRE DE LA EMPRESA
          doc.text(empresa, pageWidth / 2, 10, { align: "center" });
          
          //NOMBRE DEL REPORTE 
          doc.setFontSize(10);                   
          doc.text('Gastos por Departamentos', pageWidth / 2, 15, { align: "center" });

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
    doc.save('Gastos por departamentos.pdf');
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
}
