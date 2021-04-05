import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PaisesCiudadesService } from 'src/app/services/paises-ciudades.service';
import { ProveedoresService } from 'src/app/services/proveedores.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable'

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
  proveedores: any[];

  constructor(private proveedoresServ:ProveedoresService,
              private usuariosServ: UsuarioService,
              private fb: FormBuilder, 
              private paisesCiudadesServ: PaisesCiudadesService) { 
                this.usuario = this.usuariosServ.getUserLogged();
                this.crearFormulario()
              }

  ngOnInit(): void {
    this.todaLaData();

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
    this.proveedoresServ.reporteCatalogoProveedores(this.forma.value).then((resp:any) =>{
      console.log(resp);     
      this.proveedores = resp; 
    })
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

    const columns = [['First Column', 'Second Column', 'Third Column']];
    const data = [
    ['Data 1', 'Data 2', 'Data 3'],
    ['Data 1', 'Data 2', 'Data 3']
    ];
    
     autoTable(doc, {
          head: columns,
          body: data,
          didDrawPage: (dataArg) => { 
           doc.text('PAGE', dataArg.settings.margin.left, 10);
          }
     }); 
    
    doc.save('table.pdf');
  }
}
