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
  atributos: any[] = [];
  materiales: any[] = [];
  actividades: any[] = [];
  actividadesFiltradas: any[] = [];
  edades: any[] = [];
  tallas: any[];
  color: any[];
  estados: any;
  materialesFiltrados: any[];
  guardar: boolean;
  actualizar: boolean;
  id: number;

  constructor(private fb: FormBuilder,
              private uiMessage: UiMessagesService,
              private gf: GlobalFunctionsService,
              private categoriasStoreSrv: CategoriasStoreService,
              private tiendaServ: TiendaService) { 
                this.crearFormulario()
              }
    
  ngOnInit() { 
    this.listObserver();    
    // this.setValues();
    this.getCategorias();    
  }
  
  campo(data, campo) {
    return this.forma.get(campo).setValue(data); 
  }

  get categoria() {
    return this.forma.get('categoria').value
  }

  get composicion() {
    return this.forma.get('composicion').value
  }

  get galeria() {
    return this.forma.get('galeriaImagenes').value
  }

  crearFormulario() {
    this.forma = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      categoria: ['', Validators.required],
      codigo: ['', Validators.required],
      tipo: ['basico', Validators.required],
      precio: ['', Validators.required],
      precio_rebajado: [''],
      stock: ['', Validators.required],
      cantidadLim: [''],
      fecha_rebaja: [''],
      limDescargas: [''],
      fechaLimDescarga: [''],
      galeriaImagenes: [''],
      documentosDigitales: [''],
      composicion: [''],
      atributos: this.fb.group({
        talla: [''],
        actividad: [''],
        estado: ['n'],
        material: [''],
        edad: ['']
      })
    })
  }
  ngOnDestroy(): void {
    this.listSubscribers.forEach(a => a.unsubscribe());   
  }

  listObserver = () => {
    const observer1$ = this.tiendaServ.tipoProducto.subscribe((resp: any) =>{
      this.tipo = resp.value;
      this.campo(this.tipo, 'tipo');
      this.tipoProducto(resp.value);    
    });
    
    const observer2$ = this.tiendaServ.productosEscogidos.subscribe((resp: any) =>{
      this.campo(resp,'composicion');    
    });

    const observer3$ = this.tiendaServ.actualizar.subscribe((resp: any) =>{
      this.guardar = false;
      this.actualizar = true;   
      this.id = Number(resp.id);
      this.forma.patchValue(resp);
      this.gf.enviarurlClean(JSON.parse(resp.galeriaImagenes));
      console.log(resp);      
    });

    this.listSubscribers = [observer1$,observer2$,observer3$];
  };

  tipoProducto(tipo) {
    const precio = this.forma.get('precio');
    const stock = this.forma.get('stock');
    const cantidadLim = this.forma.get('cantidadLim');
    const precio_rebajado = this.forma.get('precio_rebajado');
    if (tipo === 'compuesto') {
      precio.clearValidators();
      stock.clearValidators();
      precio.disable();
      stock.disable();
      cantidadLim.disable();
      precio_rebajado.disable();
    }else{
      precio.enable();
      stock.enable();
      cantidadLim.enable();
      precio_rebajado.enable();
      precio.setValidators(Validators.required);
      stock.setValidators(Validators.required);
      this.campo('','composicion');
    }
    precio.updateValueAndValidity();
    stock.updateValueAndValidity();
  }

  crearProducto() {
    console.log(this.forma.value);    
    if (this.forma.invalid) {
      this.uiMessage.getMiniInfortiveMsg('tst', 'error', 'ERROR', 'Debe completar los campos que son obligatorios.');
      Object.values(this.forma.controls).forEach(control => {
        control.markAllAsTouched();
      })
    } else {
      if (this.tipo === 'compuesto' && this.composicion ==='') {
        this.uiMessage.getMiniInfortiveMsg('tst', 'error', 'ERROR', 'Debe escoger productos para la composición.');
        return;
      }
      if (this.galeria == '') {
        this.uiMessage.getMiniInfortiveMsg('tst', 'error', 'ERROR', 'Debe escoger al menos 1 imagen para el producto.');
        return;
      }
      this.tiendaServ.crearProducto(this.forma.value).then((resp: any) => {
        this.uiMessage.getMiniInfortiveMsg('tst', 'success', 'Excelente', 'Registro actualizado de manera correcta.');
        // this.resetFormulario();
      });
    }
  }

  actualizarProducto() {
    console.log(this.forma.value);    
    if (this.forma.invalid) {
      this.uiMessage.getMiniInfortiveMsg('tst', 'error', 'ERROR', 'Debe completar los campos que son obligatorios.');
      Object.values(this.forma.controls).forEach(control => {
        control.markAllAsTouched();
      })
    } else {
      if (this.tipo === 'compuesto' && this.composicion ==='') {
        this.uiMessage.getMiniInfortiveMsg('tst', 'error', 'ERROR', 'Debe escoger productos para la composición.');
        return;
      }
      if (this.galeria == '') {
        this.uiMessage.getMiniInfortiveMsg('tst', 'error', 'ERROR', 'Debe escoger al menos 1 imagen para el producto.');
        return;
      }
      this.tiendaServ.actProductosTienda(this.forma.value, this.id).then((resp: any) => {
        this.uiMessage.getMiniInfortiveMsg('tst', 'success', 'Excelente', 'Registro actualizado de manera correcta.');
        // this.resetFormulario();
      });
    }
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
      // INICIAMOS LA CREACION DEL CODIGO DEL PRODUCTO
      const codigo = resp.codigo +""+resp.id_categoria +""+ resp.id_subcategoria
      
      // SETEAMOS ANTERIOR VALOR AL CAMPO CODIGO DEL FORMULAIRO
      this.campo(codigo, 'codigo');

      // DESHABILITAMOS EL CAMPO STOCK Y CANTIDA VENTA YA QUE NOP ES NECESARIO EN
      // PRODUCTOS DE TIPO SERVICIOS O DIGITALES
      const stock = this.forma.get('stock');
      const cantidadLim = this.forma.get('cantidadLim');
      if (resp.id_categoria === 1) {
        cantidadLim.disable();
        stock.disable();
        stock.clearValidators();
      }else{
        cantidadLim.enable();
        stock.enable();
        stock.setValidators(Validators.required);
      }
      stock.updateValueAndValidity();

      //ITERAMOS EN LA PROPIEDAD ATRIBUTO
      this.atributos = [];
      this.forma.get('atributos').reset();
      this.forma.get('atributos').get('estado').setValue('n');
      resp.atributo.forEach(element => {                        
        this.setValuesC(element)            
        this.atributos.push(element);                     
        element.atributo = JSON.parse(element.atributo);
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
         
      case 'material':
        this.materiales = JSON.parse(element.atributo);
        break;
                     
      default:
        break;
    }
  }
  
  cancelar() {
    this.actualizar = false;
    this.guardar = true;
    // this.resetFormulario();
    // this.inventarioServ.guardando();
  }

  filtrarActividades(event) {
    const filtered: any[] = [];
    const query = event.query;
    for (let i = 0; i < this.actividades.length; i++) {
      const size = this.actividades[i];
      if (size.label.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(size);
      }
    }
    this.actividadesFiltradas = filtered;
  }

  filtrarMateriales(event) {
    const filtered: any[] = [];
    const query = event.query;
    for (let i = 0; i < this.materiales.length; i++) {
      const size = this.materiales[i];
      if (size.label.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(size);
      }
    }
    this.materialesFiltrados = filtered;
  }

  // addColor(){this.color.push('#1976D2')}

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
    this.campo(data, 'galeriaImagenes');
  }
 
  programar() {
    this.rebaja = !this.rebaja    
  }

  getNoValido(input: string) {
    return this.forma.get(input).invalid && this.forma.get(input).touched;
  }
}
