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
  productosOrdenados: any[];

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
      
      // FILTER
      // let temp = this.productos.filter(x => x.marca === 'marca generica1')

      // MAP
      // let temp = this.productos.map(x => x.costo * (Math.random() * 10))

      // REDUCE
      // let temp = this.productos.reduce((acc, el) =>({
      //   ...acc,
      //   [el.codigo]:el
      // }),{})    

      console.time('1')

      var nest = (seq: any, keys: string | any[]) => {
        if (!keys.length) return seq;
        var first = keys[0];
        var rest = keys.slice(1);
        return mapValues(groupBy(seq, first), function (value: any) {           
          return nest(value, rest)
        });
      };

      var nested = nest(this.productos, ['marca','categoria','propiedad']);
      console.log(nested);
      
      let temp = Object.entries(nested);
      this.productosOrdenados = temp;
      // console.log(temp);     

      Object.keys(nested).forEach(key =>{
        console.log(key);        

        Object.keys(nested[key]).forEach(key2 =>{
          console.log(key2);          

          Object.keys(nested[key][key2]).forEach(key3 =>{
            console.log(key3);            
            Object.keys(nested[key][key2][key3]).forEach(key4 =>{
              console.log(nested[key][key2][key3][key4]); 
            })
          })
        })
        
      })
       
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
        body: this.bodyRows(this.productosOrdenados),
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

  bodyRows(data: any[]) {
    var body = []
    data.forEach((element: { producto: any; marca: any; categoria: any; codigo: any; precio: any; tipo: any; }) => {
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