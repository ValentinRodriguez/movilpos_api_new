import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PaisesCiudadesService } from 'src/app/services/paises-ciudades.service';
import { ProveedoresService } from 'src/app/services/proveedores.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable'
import { DatosEstaticosService } from 'src/app/services/datos-estaticos.service';
import { UiMessagesService } from 'src/app/services/ui-messages.service';

@Component({
  selector: 'app-catalogo-proveedores',
  templateUrl: './catalogo-proveedores.component.html',
  styleUrls: ['./catalogo-proveedores.component.scss']
})
export class CatalogoProveedoresComponent implements OnInit {
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
  proveedores: any[] = [];
  formSubmitted = false;
  listSubscribers: any = [];

  constructor(private proveedoresServ:ProveedoresService,
              private usuariosServ: UsuarioService,
              private fb: FormBuilder, 
              private paisesCiudadesServ: PaisesCiudadesService,
              private uiMessage: UiMessagesService,
              private datosEstaticos: DatosEstaticosService) { 
                this.usuario = this.usuariosServ.getUserLogged();
                this.crearFormulario()
              }
              
  ngOnDestroy(): void {
    this.listSubscribers.forEach(a => a.unsubscribe());
  }

  ngOnInit(): void {
    this.todaLaData();
    this.listObserver();

    this.cols = [
      { field: 'nom_sp', header: 'Nombre' },
      { field: 'dir_sp', header: 'Dirección' },
      { field: 'tel_sp', header: 'Teléfono' },
      { field: 'email', header: 'Email' },
      { field: 'cont_sp', header: 'Contacto'},
      { field: 'condicion_pago', header: 'Condición Pago'}
  ];

  this.exportColumns = this.cols.map(col => ({title: col.header, dataKey: col.field}));
  }
  
  listObserver = () => {
    const observer1$ = this.proveedoresServ.formSubmitted.subscribe((resp:any) =>{
      this.formSubmitted = resp; 
    })

    this.listSubscribers = [observer1$];
  };
 
  crearFormulario() {
    this.forma = this.fb.group({
      cod_sp:              [''],  
      email:               [''],  
      cod_sp_sec:          [''], 
      nom_sp:              [''], 
      tel_sp:              [''],         
      cont_sp:             [''],
      tipo_doc:            [''],
      cond_pago:           [''],          
      documento:           [''],        
      id_moneda:           [''],        
      cuenta_no:           [''],
      id_pais:             [''],            
      id_ciudad:           ['']          
    })
  }
  
  verReporte() {
    this.formSubmitted = true;
    this.proveedoresServ.reporteCatalogoProveedores(this.forma.value).then((resp:any) =>{
      if (resp.length === 0) {
        this.uiMessage.getMiniInfortiveMsg('tst','warn','Nada que mostrar','No hemos encontrado coincidencias con los datos suministrados');
        this.proveedores = [];
        return;
      }   
      this.proveedores = resp; 
    })
  }

  limpiarForm(){
    this.crearFormulario();
    this.proveedores = []; 
  }

  todaLaData() {
    this.proveedoresServ.autoLlenado().then((resp: any)  => {
      resp.forEach(element => {
        switch (element.label) {
          case 'condiciones':
            this.condpago = element.data;
            break;

          case 'monedas':
            this.monedas = element.data;
            break;

          case 'catalogo':
            this.cuenta_no = element.data;
            break;  

          case 'tipo proveedor':
            this.tipo_proveedor = element.data;
            break; 

          case 'paises':
            this.paises = element.data;
            break; 

          case 'tipo documento':
            this.documento = element.data;
            break; 

          default:
            break;
        }
      });    
    })
  }

  tipoDoc(doc) {
    if (doc.descripcion === 'cedula') {
      this.cedula = true;
      this.rnc = false;
    } 
    if (doc.descripcion === 'RNC') {
      this.cedula = false;
      this.rnc = true;
    } 
    this.forma.get('documento').reset()
  }
  
  setCuenta(data) {
    this.forma.get('cuenta_no').setValue(data);
  }

  buscaPaises(id) {    
    this.paisesCiudadesServ.getCiudadesXpaises(id).then((resp:any) => {
      this.ciudades = resp;     
    })  
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
        body: this.bodyRows(this.proveedores),
        headStyles: { fillColor: [0, 128, 255] },
        didDrawPage: (dataArg) => { 
          // doc.text(anio+' '+hora, dataArg.settings.margin.right, 22, { align: "right" });
          // var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
          // var pageSize = doc.internal.pageSize
          
          //NOMBRE DE LA EMPRESA
          doc.text(empresa, pageWidth / 2, 10, { align: "center" });
          
          //NOMBRE DEL REPORTE      
          doc.setFontSize(10);              
          doc.text('Catálogo de Proveedores', pageWidth / 2, 15, { align: "center" });

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
    doc.save('catalogo-proveedores.pdf');
  }

  headRows() {
    return [{ nom_sp: 'Nombre', dir_sp: 'Dirección', tel_sp: 'Teléfono', email: 'Email', cont_sp: 'Contacto', condicion_pago: 'Condición Pago' }]
  }

  bodyRows(data) {
    var body = []
    data.forEach(element => {
      body.push({
        nom_sp: this.datosEstaticos.capitalizeFirstLetter(element.nom_sp),
        dir_sp: element.dir_sp,
        tel_sp: element.tel_sp,
        email: element.email,
        cont_sp: this.datosEstaticos.capitalizeFirstLetter(element.cont_sp),
        condicion_pago: element.condicion_pago
      })      
    });
    return body
  }
}
