import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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
      { field: 'documento', header: 'Documento'},
      { field: 'detalle', header: 'Detalle'},
      { field: 'debito', header: 'Débito'},
      { field: 'credito', header: 'Crédito'},
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
      fecha_inicial: ['', Validators.required],           
      fecha_final:   ['', Validators.required]           
    })
  }
  
  verReporte() {
    this.formSubmitted = true;
    if (this.forma.invalid) {  
      this.formSubmitted = false;     
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios');      
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
      })
    }else{ 
      this.cgtransaccionesSev.mayorGeneral(this.forma.value).then((resp:any) =>{      
        if (resp.length === 0) {
           (resp);
          this.uiMessage.getMiniInfortiveMsg('tst','warn','Nada que mostrar','No hemos encontrado coincidencias con los datos suministrados');3
          this.mayor = [];
          return;
        }
        this.mayor = resp; 
         (this.mayor);      
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
    return [ {fecha:'Fecha' ,documento:'Documento', detalle:'Detalle', debito:'Debito', credito: 'Credito'}]
  }  

  bodyRows(data) {
    var body = []
    data.forEach(element => {
      body.push({
        fecha: element.fecha,
        documento:element.debito,
        detalle: element.detalle,
        debito: element.debito,
        credito: element.credito,
      })      
    });
    return body
  }

  getNoValido(input: string) {
    return this.forma.get(input).invalid && this.forma.get(input).touched;
  }
}
