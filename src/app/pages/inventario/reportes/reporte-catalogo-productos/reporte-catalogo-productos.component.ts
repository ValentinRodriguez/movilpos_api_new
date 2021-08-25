import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatosEstaticosService } from 'src/app/services/globales/datos-estaticos.service';
import { UiMessagesService } from 'src/app/services/globales/ui-messages.service';
import { InventarioService } from 'src/app/services/inventario/inventario.service';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable'

@Component({
  selector: 'app-reporte-catalogo-productos',
  templateUrl: './reporte-catalogo-productos.component.html',
  styleUrls: ['./reporte-catalogo-productos.component.scss']
})
export class ReporteCatalogoProductosComponent implements OnInit {

  forma: FormGroup;
  tipos: any[] = []
  brands: any[] = []
  categorias: any[] = []
  propiedades: any[] = []
  bodegas: any[] = []
  productos: any[] = []
  cols: { field: string; header: string; }[];
  exportColumns: { title: string; dataKey: string; }[];

  constructor(private fb: FormBuilder,
    private invProductoSrv: InventarioService,
    private uiMessage: UiMessagesService,
    private datosEstaticos: DatosEstaticosService) {
    this.crearFormulario()
  }

  ngOnInit(): void {
    this.cols = [
      { field: 'producto', header: 'producto' },
      { field: 'marca', header: 'marca' },
      { field: 'categoria', header: 'categoria' },
      { field: 'codigo', header: 'codigo' },
      { field: 'precio', header: 'precio'},
      { field: 'tipo', header: 'tipo'}
    ];

    this.exportColumns = this.cols.map(col => ({title: col.header, dataKey: col.field}));
  }

  crearFormulario() {
    this.forma = this.fb.group({
      titulo: ['testfgfgfgfg', Validators.required],
      tipo_producto: [''],
      id_brand: [''],
      id_categoria: [''],
      id_propiedad: [''],
      id_bodega: [''],
      codigo_referencia: [''],
    })
  }

  verReporte() {
    console.log('aqui');
    
    this.invProductoSrv.repCatalogoProductos(this.forma.value).then((resp:any) =>{
      if (resp.length === 0) {
        this.uiMessage.getMiniInfortiveMsg('tst','warn','Nada que mostrar','No hemos encontrado coincidencias con los datos suministrados');
        this.productos = [];
        return;
      }   
      this.productos = resp; 
    })
  }

  limpiarForm(){
    this.crearFormulario();
    this.productos = []; 
  }
  exportPdf() {
    const doc = new jsPDF('p', 'mm', 'a4');
    let pageWidth = doc.internal.pageSize.getWidth();
    const totalPagesExp = '{total_pages_count_string}'
    const anio = this.datosEstaticos.getDate();
    const hora = this.datosEstaticos.getHourAmp();
    const empresa = 'No Identificada'
    const nombre = this.datosEstaticos.capitalizeFirstLetter('valentin');
    const apellido = this.datosEstaticos.capitalizeFirstLetter('rodriguez');

    autoTable(doc, {
        head: this.headRows(),
        body: this.bodyRows(this.productos),
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
    return [{ producto: 'Nombre', marca: 'marca', categoria: 'categoria', codigo: 'codigo', precio: 'precio', tipo: 'tipo' }]
  }

  bodyRows(data) {
    var body = []
    data.forEach(element => {
      body.push({
        producto: element.producto,
        marca: element.marca,
        categoria: element.categoria,
        codigo: element.codigo,
        precio: element.precio,
        tipo: element.tipo
      })      
    });
    return body
  }
}
