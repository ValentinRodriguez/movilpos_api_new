import { Component, OnInit } from '@angular/core';
import { ClientesService } from 'src/app/services/ventas/clientes.service';
import { DatosEstaticosService } from 'src/app/services/globales/datos-estaticos.service';
import { GlobalFunctionsService } from 'src/app/services/globales/global-functions.service';
import { InventarioService } from 'src/app/services/inventario/inventario.service';
import { PaisesCiudadesService } from 'src/app/services/globales/paises-ciudades.service';

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
  brands: any = [];
  tipoInventario: any = [];
  categorias: any = [];
  propiedades: any = [];
  bodegas: any = [];
  nacionalidades: any = [];
  nacFiltrados: any = [];
  display = false;
  nacionalidad = '';
  tipo = [
    {label: 'Importado', value: 'importado'},
    {label: 'Local', value: 'local'},
  ];

  form: any = {
    fecha: '',
    anio: '',
    mes: '',
    dias: '',
    cliente: '',
    cedula: '',
    direccion: '',
    tipo_vehiculo: '',
    marca: '',
    modelo: '',
    color: '',
    fabricacion: '',
    placa: '4564654654',
    chasis: '23423422',
    testigo1: 'ana',
    testigo2: 'jose',
    cedulatestigo1: '111-1111111-1',
    cedulatestigo2: '111-1111111-1',
    nacionalidad: '',
    fecha_formateada: '',
    id_pais: '',
    id_zona: '',
    id_region: '',
    id_provincia: '',
    id_municipio: '',
    id_ciudad: '',
    id_sector: '',
  };

  constructor(private paisesCiudadesServ: PaisesCiudadesService,
              private inventarioServ: InventarioService,
              private DatosEstaticos: DatosEstaticosService,
    private clientesServ: ClientesService) { }
  
  ngOnDestroy(): void {
    this.listSubscribers.forEach(a => a.unsubscribe());
  }

  ngOnInit(): void {
    this.todaLaData();
    this.todosLosPaises();
    this.paisesCiudadesServ.getNacionalidades().then((resp: any) => {
      this.nacionalidades = resp;
    });
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
            
    })
  }

  todosLosPaises() {
    this.paisesCiudadesServ.getPaises().then((resp: any)=>{
            
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
    this.form.dias = d.getDate();
    this.form.fecha_formateada = `${this.form.anio}/${this.form.mes}/${this.form.dia}`
  }

  filtrarNacionalidad(event) {
    const filtered: any[] = [];
    const query = event.query;    
    
    for (let i = 0; i < this.nacionalidades.length; i++) {
      const size = this.nacionalidades[i];
      if (size.nacionalidad.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(size);
      }
    }
    this.nacFiltrados = filtered;
  }
  
  print(): void {
    this.display = true;
    setTimeout(() => {
      let printContents, popupWin;
      printContents = document.getElementById('print-section').innerHTML;
      popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
      popupWin.document.open();
      popupWin.document.write(`
        <html>
          <head>
            <style>
            //........Customized style.......
            </style>
          </head>
            <body onload="window.print();window.close()">${printContents}</body>
        </html>`
      );      
    }, 500);
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
    ;  
    this.form.cedula = data.documento;
    this.form.nacionalidad = this.nacionalidades.find(doc => doc.id == data.nacionalidad);
    this.nacionalidad = this.form.nacionalidad.nacionalidad
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
