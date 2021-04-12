import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DatosEstaticosService } from 'src/app/services/datos-estaticos.service';
import { TransacionPagosService } from 'src/app/services/transacion-pagos.service';
import { UiMessagesService } from 'src/app/services/ui-messages.service';
import { UsuarioService } from 'src/app/services/usuario.service';

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
      { field: 'fecha', header: 'Fecha' },
      { field: 'descripcion', header: 'Descripción' },
      { field: 'cuenta_no', header: 'Cuenta' },
      { field: 'departamento', header: 'Departamento'},
      { field: 'detalle_1', header: 'Detalle 1'},
      { field: 'detalle_2', header: 'Detalle 2'},
      { field: 'debito', header: 'Débito'},
      { field: 'credito', header: 'Crédito'},
      { field: 'cod_aux', header: 'Cod Aux'},
      { field: 'cod_sec', header: 'Cod Sec'},
      { field: 'analitico', header: 'Analítico'},
      { field: 'catalogo', header: 'Catálogo'},
      { field: 'depto', header: 'Depto'},
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
    this.cgtransaccionesSev.mayorGeneral(this.forma.value).then((resp:any) =>{      
      if (resp.length === 0) {
        console.log(resp);
        this.uiMessage.getMiniInfortiveMsg('tst','warn','Nada que mostrar','No hemos encontrado coincidencias con los datos suministrados');3
        this.mayor = [];
        return;
      }
      this.mayor = resp; 
      console.log(this.mayor);      
    })
  }

  limpiarForm(){
    this.crearFormulario();
    this.mayor = [];
  }
  
  onSelectDate(event, campo) {
    let d = new Date(Date.parse(event));
    this.forma.get(campo).setValue(`${d.getFullYear()}/${d.getMonth()+1}/${d.getDate()}`);
  }

  exportPdf() {
    const doc = new jsPDF('l', 'mm', 'a4');
    let pageWidth = doc.internal.pageSize.getWidth();
    const totalPagesExp = '{total_pages_count_string}'
    const anio = this.datosEstaticos.getDate();
    const hora = this.datosEstaticos.getHourAmp();
    const empresa = this.usuario.empresa.nombre || 'No Identificada'
    const nombre = this.datosEstaticos.capitalizeFirstLetter(this.usuario.empleado.primernombre);
    const apellido = this.datosEstaticos.capitalizeFirstLetter(this.usuario.empleado.primerapellido);

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
          doc.text(str, 320, 15, {align: 'right',});
          
          //USUARIO CREADOR REPORTE
          doc.text(nombre+' '+apellido, dataArg.settings.margin.left, 20);
          
          //HORA CREACION REPORTE          
          doc.text(anio+' '+hora, 280, 20, {align: 'right',});
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
    return [ {fecha:'Fecha' ,descripcion:'Descripción',cuenta_no:'Cuenta',departamento:'Departamento',detalle_1:'Detalle',detalle_2:'Detalle',debito:'Débito',credito:'Crédito',cod_aux:'Cod Aux',
              cod_sec:'Cod Sec',analitico:'Analítico',catalogo:'Catálogo',depto:'Depto'}]
  }  

  bodyRows(data) {
    var body = []
    data.forEach(element => {
      body.push({
        fecha: element.fecha,
        descripcion: element.descripcion,
        cuenta_no: element.cuenta_no,
        departamento: element.departamento,
        detalle_1: element.detalle_1,
        detalle_2: element.detalle_2,
        debito: element.debito,
        credito: element.credito,
        cod_aux: element.cod_aux,
        cod_sec: element.cod_sec,
        analitico: element.analitico,
        catalogo: element.catalogo,
        depto: element.depto,
      })      
    });
    return body
  }
}
