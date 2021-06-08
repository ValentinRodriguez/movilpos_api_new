import { Component, OnInit } from '@angular/core';
import { BodegasService } from 'src/app/services/bodegas.service';
import { BrandsService } from 'src/app/services/brands.service';
import { CategoriasService } from 'src/app/services/categorias.service';
import { ClientesService } from 'src/app/services/clientes.service';
import { DatosEstaticosService } from 'src/app/services/datos-estaticos.service';
import { InventarioService } from 'src/app/services/inventario.service';
import { PaisesCiudadesService } from 'src/app/services/paises-ciudades.service';
import { PropiedadesService } from 'src/app/services/propiedades.service';

@Component({
  selector: 'app-acto-descargo',
  templateUrl: './acto-descargo.component.html',
  styleUrls: ['./acto-descargo.component.scss']
})
export class ActoDescargoComponent implements OnInit {

  fechafabricacion: any[] = [];
  clientes: any[] = [];
  clientesFiltrados: any[] = [];
  minDate: Date;
  paises: any[] = [];
  regiones: any[] = [];
  provincias: any[] = [];
  municipios: any[] = [];
  ciudades: any[] = [];
  sectores: any[] = [];
  listSubscribers: any = [];

  tipo = [
    {label: 'Importado', value: 'importado'},
    {label: 'Local', value: 'local'},
  ];

  form: any = {
    fecha: '',
    anio: '',
    mes: '',
    dia: '',
    cliente: '',
    cedula: '',
    direccion: '',
    tipo_vehiculo: '',
    marca: '',
    modelo: '',
    color: '',
    fabricacion: '',
    placa: '',
    chasis: '',
    testigo1: 'ana',
    testigo2: 'jose',
    cedulatestigo1: '',
    cedulatestigo2: '',
    id_pais: '',
    id_zona: '',
    id_region: '',
    id_provincia: '',
    id_municipio: '',
    id_ciudad: '',
    id_sector: '',
  };

  brands: any;
  tipoInventario: any;
  categorias: any;
  propiedades: any;
  bodegas: any;
  
  constructor(private paisesCiudadesServ: PaisesCiudadesService,
              private inventarioServ: InventarioService,
              private DatosEstaticos: DatosEstaticosService,
    private clientesServ: ClientesService) { }
  
  ngOnDestroy(): void {
    this.listSubscribers.forEach(a => a.unsubscribe());
  }

  ngOnInit(): void {
    this.todaLaData();
    this.todosLosPaises()
    this.setMinDate();
    this.fechaFabricacion();
    this.todosLosClientes();
  }

  todaLaData() {   
    this.inventarioServ.autoLlenado().then((resp: any) =>{         
      resp.forEach(element => {
        switch (element.label) {
          case 'modelos':
            this.categorias = element.data;
            break;

          case 'color':
            this.propiedades = element.data;
            break;

          case 'marcas':
            this.brands = element.data;
            break;

          case 'bodegas':
            this.bodegas = element.data;
            break;

          default:
            break;
        }
      });  
    })
  }
    
  todosLosClientes() {
    this.clientesServ.getDatos().then((resp: any) => {
      this.clientes = resp;
      console.log(resp);      
    })
  }

  todosLosPaises() {
    this.paisesCiudadesServ.getPaises().then((resp: any)=>{
      console.log(resp);      
      this.paises = resp;   
    })
  }
  
  buscaRegion(event) {
      this.paisesCiudadesServ.buscaRegion(event).then((resp:any) => {  
      this.regiones = resp;
    })   
  }

  buscaProvincia(event) {
      this.paisesCiudadesServ.buscaProvincias(event).then((resp:any) => {  
      this.provincias = resp;
    })   
  }

  buscaMunicipio(event) {
    this.paisesCiudadesServ.buscaMunicipios(event).then((resp:any) => {  
      this.municipios = resp;
    })   
  }
 
  buscaCiudad(event) {
    this.paisesCiudadesServ.buscaCiudad(event).then((resp:any) => {  
      console.log(resp);      
      this.ciudades = resp;
    })   
  }

  buscaSector(event) {
    this.paisesCiudadesServ.buscaSector(event).then((resp:any) => {  
      this.sectores = resp;
    })   
  }

  onSelectDate(event) {
    let d = new Date(Date.parse(event));
    this.form.anio = d.getFullYear();
    this.form.mes = d.getMonth() + 1;
    this.form.dia = d.getDate();
  }

  print(): void {
    console.log(this.form);    
    // let printContents, popupWin;
    // printContents = document.getElementById('print-section').innerHTML;
    // popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    // popupWin.document.open();
    // popupWin.document.write(`
    //   <html>
    //     <head>
    //       <title>Print tab</title>
    //       <style>
    //       //........Customized style.......
    //       </style>
    //     </head>
    //       <body onload="window.print();window.close()">${printContents}</body>
    //   </html>`
    // );
    // popupWin.document.close();
  }

  fechaFabricacion() {
    let rango = this.DatosEstaticos.getYear() - 1950 + 1;
    let temp = [];
    for (let index = 0; index < rango; index++) {
       temp.push({value: 1950 + (index)})
    }  
    this.fechafabricacion = temp.reverse();      
  }

  datosClientes(data) {
    console.log(data);  
    this.form.cedula = data.documento;  
    this.form.direccion = data.pais +','+ data.provincia +','+ data.municipio +','+ data.urbanizacion +','+ data.ciudad +','+ data.sector +','+ data.direccion
  }

  filtrarClientes(event) {
    const filtered: any[] = [];
    const query = event.query;
    
    for (let i = 0; i < this.clientes.length; i++) {
      const size = this.clientes[i];
      
      if (size.nombre.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(size);
      }
    }
    this.clientesFiltrados = filtered;
  }

  setMinDate() {
    let today = new Date();
    let month = today.getMonth();
    let year = today.getFullYear();
    let day = today.getDate();
    this.minDate = new Date();
    this.minDate.setMonth(month);
    this.minDate.setFullYear(year);
    this.minDate.setDate(day);
  }

}
