import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { BrandsService } from 'src/app/services/inventario/brands.service';
import { CategoriasService } from 'src/app/services/inventario/categorias.service';
import { DatosEstaticosService } from 'src/app/services/globales/datos-estaticos.service';
import { RecepcionVehiculosService } from 'src/app/services/ventas/recepcion-vehiculos.service';
import { UiMessagesService } from 'src/app/services/globales/ui-messages.service';

import { environment } from 'src/environments/environment';

const URL = environment.urlImagenes;

@Component({
  selector: 'app-formulario-recepcion-vehiculos',
  templateUrl: './formulario-recepcion-vehiculos.component.html',
  styleUrls: ['./formulario-recepcion-vehiculos.component.scss'],
  providers:[BrandsService,CategoriasService,RecepcionVehiculosService]
})
export class FormularioRecepcionVehiculosComponent implements OnInit {

  forma: FormGroup;
  usuario: any;  
  guardar = true;
  actualizando = false;
  actualizar = false;
  recepcionExiste = 3;
  
  id: number;
  listSubscribers: any = [];
  clientesFiltrados: any = [];
  clientes: any = [];
  minDate: Date;
  fechafabricacion: any[] = [];
  brands: any[] = [];
  modelos: any[] = [];
  propiedades: any[] = [];
  getChasis = false;
  imgURL = null;
  imagePath: any;
  message: string;
  imgEmpresa = null;
  inspecciones: any[] = [];
  stateOptions: any[];  
  value1: string = "no";
  @ViewChild(FileUpload)
  fileUpload: FileUpload
  uploadedFiles: any[] = [];
  items: MenuItem[] = [];
  @ViewChild('file')
  file: ElementRef;
  origenes = [
    {label: 'Importado', value: 'importado'},
    {label: 'Local', value: 'local'},
  ];
  constructor(private fb: FormBuilder,
              private uiMessage: UiMessagesService,
              
              private marcaService: BrandsService,
              private categoriasServ: CategoriasService,
              private DatosEstaticos: DatosEstaticosService,
              private recepcionsServ: RecepcionVehiculosService) {                 
                this.crearFormulario();
                this.stateOptions = [{label: 'Si', value: 'si'}, {label: 'No', value: 'no'}];
  }

  ngOnDestroy(): void {
    this.listSubscribers.forEach(a => a.unsubscribe());
    this.setMinDate();
  }

  ngOnInit(): void {
    this.todaLaData();
    this.listObserver();
    this.fechaFabricacion();
  }

  listObserver = () => {
    const observer1$ = this.recepcionsServ.actualizar.subscribe((resp: any) =>{
      this.guardar = false;
      this.actualizar = true;   
      this.id = Number(resp);      
      //    
      this.recepcionsServ.getDato(resp).then((res: any) => {         
        this.guardar = false;
        this.id = Number(resp);  
         
        this.forma.patchValue(resp);
        this.forma.get('cliente').setValue(this.clientes.find(doc => doc.id == res.cliente)); 
        this.imgURL = `${URL}/storage/${res.imagen}`;
        this.forma.get('fabricacion').setValue({value: Number(res.fabricacion)});
        this.forma.get('id_brand').setValue(this.brands.find(brand => brand.id_brand === res.id_brand));
        this.forma.get('id_categoria').setValue(this.modelos.find(modelo => modelo.id_categoria === res.id_categoria));
        this.forma.get('id_propiedad').setValue(this.propiedades.find(propiedad => propiedad.id_propiedad === res.id_propiedad));               
        this.forma.get('tipo_producto').setValue(this.origenes.find(tipo => tipo.value === res.tipo_producto)); 
        this.forma.get('imagen').setValue(res.imagen); 
        this.forma.get('archivos').setValue(res.archivos);       
        this.inspecciones = JSON.parse(res.inspecciones);
        this.forma.get('inspecciones').setValue(this.inspecciones);
      })
    })

      this.listSubscribers = [observer1$];
   };

  crearFormulario() {
    this.forma = this.fb.group({
      cliente:             ['', Validators.required],     
      recibido:            ['valentin', Validators.required],
      entregado:           ['valentin', Validators.required],
      fecha_entrega:       ['2021/04/23', Validators.required],
      fabricacion:         [''],
      id_brand:            ['', Validators.required],
      id_categoria:        ['', Validators.required],
      kilometraje:         ['300', Validators.required],
      placa:               ['654654-5', Validators.required],
      chasis:              ['56654654654', Validators.required],
      imagen:              [''],
      tipo_producto:       ['', Validators.required],
      id_propiedad:        ['', Validators.required],
      archivos:            [''],
      inspecciones:        ['', Validators.required],
      estado:              ['activo', Validators.required],
      usuario_modificador: ['']
    })
  }

  guardarRecepcion(){
    
        
    if (this.forma.invalid) {    
         
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios');      
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
      })
    }else{   
      switch (this.recepcionExiste) {
        case 0:
          this.uiMessage.getMiniInfortiveMsg('tst','info','Espere','Verificando disponibilidad de nombre');          
          break;

        case 2:
          this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Existe una categoria con este nombre');          
          break;

        default:
          this.recepcionsServ.crearRecepcion(this.forma.value).then(()=>{
            this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro creada de manera correcta'); 
            this.resetFormulario(); 
          })
          break;
      } 
    }
  }
  
  todaLaData() {   
    this.recepcionsServ.autoLlenado().then((resp: any) =>{    
      resp.forEach(element => {
        if (element.data.length === 0) {
          this.items.push({label: this.DatosEstaticos.capitalizeFirstLetter(element.label), routerLink: element.label});       
        }
        switch (element.label) {
          case 'clientes':
            this.clientes = element.data;
            break;

          case 'modelos':
            this.modelos = element.data;
            break;

          case 'propiedades':
            this.propiedades = element.data;
            break;

          case 'marcas':
            this.brands = element.data;
            break;

          case 'inspecciones':
            this.inspecciones = element.data;
            this.forma.get('inspecciones').setValue(this.inspecciones);
            break;              

          default:
            break;
        }
      }); 
    })
  }

  filtrarCliente(event) {
    const filtered: any[] = [];    
    const query = event;
    for (let i = 0; i < this.clientes.length; i++) {
      const size = this.clientes[i];      
      if (size.nombre.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(size);
      }
    }
    this.clientesFiltrados = filtered;
  }

  onFileSelect() {
    this.forma.get("archivos").setValue(this.fileUpload.files);
  }

  inspeccionRealizada() {
    this.forma.get("inspecciones").setValue(this.inspecciones);
  }

  checaChasis(data) {
    if (this.getChasis) { 
      this.DatosEstaticos.getChasis().then((response: any) => {
        
        this.forma.get('asientos').setValue(Number(response.standard_seating))
        this.forma.get('asientosAd').setValue(Number(response.optional_seating))
        this.forma.get('motor').setValue(response.engine)
        this.forma.get('fabricacion').setValue({value: Number(response.year)})

        this.marcaService.busquedaMarca(response.make.toLowerCase()).then((resp: any)=>{       
          if (resp.length === 0) {
            let marca = {
              "descripcion": response.make.toLowerCase(),
              "usuario_creador": this.usuario.username,
              "estado": "activo",
            }
            this.marcaService.crearMarca(marca).then((res: any) =>{ 
               
              
              this.forma.get('id_brand').setValue(this.brands.find(brand => brand.id_brand === res.id_brand))          
            })
          }          
        })

        this.categoriasServ.busquedaCategoria(response.model.toLowerCase()).then((resp: any)=>{         
          if (resp.length === 0) {
            let categoria = {
              "descripcion": response.model.toLowerCase(),
              "usuario_creador": this.usuario.username,
              "estado": "activo",
            }
            this.categoriasServ.crearCategoria(categoria).then((res: any) =>{     
                 
              this.forma.get('id_categoria').setValue(this.modelos.find(categoria => categoria.id_categoria === res.id_categoria))  
            })
          }          
        })
      })
    }
  }
  
  onSelectDate(event) {
    let d = new Date(Date.parse(event));
    this.forma.get('fecha_entrega').setValue(`${d.getFullYear()}/${d.getMonth()+1}/${d.getDate()}`);
  }

  datosCliente(cliente) {      
    // this.forma.get('tipo_cliente').setValue(cliente.tipo_cliente);
    // this.forma.get('sec_cliente').setValue(cliente.sec_cliente);
    // this.forma.get('nombre_cliente').setValue(cliente.nombre);
    // this.forma.get('pais_cliente').setValue(cliente.id_pais);
    // this.forma.get('ciudad_cliente').setValue(cliente.id_ciudad);
    // this.forma.get('urbanizacion_cliente').setValue(cliente.urbanizacion);
  }
  
  verificaRecepcion(data){  
    if (data === "") {
      this.recepcionExiste = 3;
      return;
    }
    let param = {'recepcions': data};
    this.recepcionExiste = 0;
    this.recepcionsServ.busquedaRecepcion(param).then((resp: any)=>{
      if(resp.length === 0) {
        this.recepcionExiste = 1;
      }else{
        this.recepcionExiste = 2;
      }
    })
  }

  actualizarRecepcion(){
    this.forma.get('usuario_modificador').setValue(this.usuario.username);    
    if (this.forma.invalid) {  
           
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios');      
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
      })
    }else{ 
      this.recepcionsServ.actualizarRecepcion(this.id, this.forma.value).then((resp: any) => {
        this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro actualizado de manera correcta');
        this.resetFormulario();
      })
    }
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

  fechaFabricacion() {
    let rango = this.DatosEstaticos.getYear() - 1950 + 1;
    let temp = [];
    for (let index = 0; index < rango; index++) {
       temp.push({value: 1950 + (index)})
    }  
    this.fechafabricacion = temp.reverse();      
  }

  preview(files) {
    if (files.length === 0)
      return;
 
    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Solo puede escoger imagenes";
      return;
    }

    this.forma.get("imagen").setValue(files[0]);
    
    var reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]); 
    reader.onload = (_event) => { 
      this.imgURL = reader.result; 
    }
  }

  cancelar() {
    this.actualizar = false;
    this.guardar = true;
    this.resetFormulario();
    this.recepcionsServ.guardando();    
  }

  resetFormulario() {
    this.forma.reset();
    this.file.nativeElement.value = "";
    
    this.inspecciones.forEach(element => {
      element.valor = 'no';
    })
    this.imgURL = null;
    this.fileUpload.clear();
    this.uploadedFiles = [];
    this.forma.get('estado').setValue('activo');
    this.forma.get('usuario_creador').setValue(this.usuario.username);
  }

  getNoValido(input: string) {
    return this.forma.get(input).invalid && this.forma.get(input).touched;
  }

}
