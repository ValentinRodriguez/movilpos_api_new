import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatosEstaticosService } from 'src/app/services/globales/datos-estaticos.service';
import { UiMessagesService } from 'src/app/services/globales/ui-messages.service';
import { InventarioService } from 'src/app/services/inventario/inventario.service';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable'
import { groupBy,mapValues,mapKeys,flatMap } from 'lodash-es';

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
    this.invProductoSrv.repCatalogoProductos(this.forma.value).then((resp:any) =>{
      if (resp.length === 0) {
        this.uiMessage.getMiniInfortiveMsg('tst','warn','Nada que mostrar','No hemos encontrado coincidencias con los datos suministrados');
        this.productos = [];
        return;
      }   
      this.productos = resp;
      
      this.ordenaData(this.productos, ['marca','categoria','propiedad'])
      
    })
  }

  ordenaData(data, params) {
    var nest = (seq: any, keys: string | any[]) => {
      if (!keys.length) return seq;
      var first = keys[0];
      var rest = keys.slice(1);
      return mapValues(groupBy(seq, first), function (value: any) {           
        return nest(value, rest)
      });
    };

    var nested = nest(data, params);
    var productosOrdenados:any[] = []
       
    Object.keys(nested).forEach((key) =>{
        productosOrdenados.push({producto:key.toUpperCase(), encabezado: true})
      Object.keys(nested[key]).forEach(key2 =>{
          productosOrdenados.push({producto:key2.toUpperCase(), encabezado: true})
        Object.keys(nested[key][key2]).forEach(key3 =>{
            productosOrdenados.push({producto:key3.toUpperCase(), encabezado: true})
          Object.keys(nested[key][key2][key3]).forEach(key4 =>{
              productosOrdenados.push({
              producto: nested[key][key2][key3][key4].producto,
              codigo: nested[key][key2][key3][key4].codigo,
              precio: nested[key][key2][key3][key4].precio,
              tipo: nested[key][key2][key3][key4].tipo,
            })
          })
        })
      })        
    })
    console.log( productosOrdenados);

    this.exportPdf(productosOrdenados, params)
  }

  limpiarForm(){
    this.crearFormulario();
    this.productos = []; 
  }
  
  exportPdf(data, params) {
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
        body: this.bodyRows(data),
        headStyles: { fillColor: [0, 128, 255] },
        didParseCell: (dataArg) => {
          console.log(dataArg);          
          if (dataArg.row.raw['encabezado'] === true) {
            dataArg.cell.styles.fillColor = [40, 170, 100]
          }
        },
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
    return [{ producto: 'Nombre', codigo: 'Código', precio: 'Precio', tipo: 'Tipo' }]
  }

  bodyRows(data: any[]) {
    var body = []
    data.forEach((element: any) => {
      body.push({
        producto: element.producto,
        codigo: element.codigo,
        precio: element.precio,
        encabezado: element.encabezado || '',
        tipo: element.tipo
      })
    });
    console.log(body);    
    return body
  }
}