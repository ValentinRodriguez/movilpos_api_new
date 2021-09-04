import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api/menuitem';
import { FileUpload } from 'primeng/fileupload';
import { DatosEstaticosService } from 'src/app/services/globales/datos-estaticos.service';
import { GlobalFunctionsService } from 'src/app/services/globales/global-functions.service';
import { UiMessagesService } from 'src/app/services/globales/ui-messages.service';
import { CategoriasStoreService } from 'src/app/services/tienda/categorias-store.service';
import { TiendaService } from 'src/app/services/tienda/tienda.service';

@Component({
  selector: 'app-formulario-creacion-productos-tienda',
  templateUrl: './formulario-creacion-productos-tienda.component.html',
  styleUrls: ['./formulario-creacion-productos-tienda.component.scss']
})
export class FormularioCreacionProductosTiendaComponent implements OnInit {

  forma: FormGroup;
  tipo = 'basico';
  rebaja: boolean = false;
  uploadedFiles: any[] = [];
  @ViewChild(FileUpload)
  fileUpload: FileUpload
  listSubscribers: any = [];
  groupedCities: any = [];
  selectedCity3: string;
  checked: any = [];
  atributos: any[] = [];
  materiales: any[] = [];
  actividades: any[] = [];
  edades: any[] = [];
  tallas: any[];
  color: any[];
  estados: any;

  constructor(private fb: FormBuilder, 
              private categoriasStoreSrv: CategoriasStoreService,
              private tiendaServ: TiendaService) { 
                this.crearFormulario()
              }
    
  ngOnInit() { 
    this.listObserver();    
    this.setValues()
    this.getCategorias();    
  }
  
  campo(data, campo) {
    return this.forma.get(campo).setValue(data); 
  }

  get categoria() {
    return this.forma.get('categoria').value
  }

  crearFormulario() {
    this.forma = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      categoria: ['', Validators.required],
      tipo: ['', Validators.required],
      precio: ['', Validators.required],
      precio_rebajado: [''],
      stock: ['', Validators.required],
      cantidadLim: [''],
      fecha_rebaja: [''],
      limDescargas: [''],
      fechaLimDescarga: [''],
      galeriaImagenes: [''],
      documentosDigitales: ['']
    })
  }
  ngOnDestroy(): void {
    this.listSubscribers.forEach(a => a.unsubscribe());   
  }

  listObserver = () => {
    const observer1$ = this.tiendaServ.tipoProducto.subscribe((resp: any) =>{
      this.tipo = resp.value;         
    });
    
    this.listSubscribers = [observer1$];
  };

  crearProducto() {

  }

  getCategorias() {
    this.categoriasStoreSrv.getDatos().then((resp: any) =>{    
      let temp2: any[] = [];
      
      resp.forEach((element: any) => {                        
         let dato = {
              label: element.descripcion.toUpperCase(), 
              value: 'de',
              items: this.crearhijos(element.items)
          }                
          temp2.push(dato)
      });

      this.groupedCities = temp2;
    }) 
  }

  getAtributosProducto(categoria) {
    console.log(categoria);    
    this.tiendaServ.getDataCategoria(categoria, 'subcategoria-plaza').then((resp: any) => {
      console.log(resp);        
      resp.atributo.forEach(element => {                        
        this.setValuesC(element)            
        this.atributos.push(element);                     
        element.atributo = JSON.parse(element.atributo);
        this.checked.push(element.atributo);
      }); 
    })
  }

  setValuesC(element) {    
    switch (element.descripcion) {
      case 'estado':
        this.estados = JSON.parse(element.atributo);
        break;

      case 'actividad':
        this.actividades = JSON.parse(element.atributo);    
        break;

      case 'edad':
        this.edades = JSON.parse(element.atributo);               
        break;

      case 'talla':
        this.tallas = JSON.parse(element.atributo);    
        console.log(this.tallas);
                   
        break;
                     
      default:
        break;
    }
  }
  
  addColor(){this.color.push('#1976D2')}

  crearhijos(element: any) {
    const temp: any = [];        
    element.forEach((subelement: any) => {                        
        let obj = {
          label: subelement.descripcion, 
          value: subelement.id,
        }
        temp.push(obj)
    });        
    return temp
  } 

  recibeFiles(data){
    this.campo(data, 'galeriaImagenes')
    console.log(this.forma.value);    
  }

  setValues() {  
    const params = this.tiendaServ.getProduct('general'); 
  }

  programar() {
    this.rebaja = !this.rebaja    
  }

  getNoValido(input: string) {
    return this.forma.get(input).invalid && this.forma.get(input).touched;
  }
}
