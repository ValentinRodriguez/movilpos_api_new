import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormArray, Validators, FormBuilder } from '@angular/forms';
import { DialogService } from 'primeng/dynamicdialog';
import { FileUpload } from 'primeng/fileupload';
import { BodegasService } from 'src/app/services/bodegas.service';
import { BrandsService } from 'src/app/services/brands.service';
import { CategoriasService } from 'src/app/services/categorias.service';
import { DatosEstaticosService } from 'src/app/services/datos-estaticos.service';
import { InventarioService } from 'src/app/services/inventario.service';
import { PropiedadesService } from 'src/app/services/propiedades.service';
import { TipoInventarioService } from 'src/app/services/tipo-inventario.service';
import { UiMessagesService } from 'src/app/services/ui-messages.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { StepComponent } from '../step/step.component';
import { environment } from 'src/environments/environment';

const URL = environment.urlImagenes;

@Component({
  selector: 'app-formulario-maestra-productos',
  templateUrl: './formulario-maestra-productos.component.html',
  styleUrls: ['./formulario-maestra-productos.component.scss']
})
export class FormularioMaestraProductosComponent implements OnInit {

  forma: FormGroup;
  guardando = false;
  guardar = true;
  actualizando = false;
  actualizar = false;
  tipos: any[] = [];
  noFisico = true;
  productoExiste = 3;
  listSubscribers: any = [];
  tipoInventario: any[] = [];
  fechafabricacion: any[] = [];
  propiedades: any[] = [];
  categorias: any[] = [];
  brands: any[] = [];
  bodegas: any[] = [];
  medidas: any[] = [];
  // uploadedFiles: any[] = [];
  // @ViewChild(FileUpload)
  // fileUpload: FileUpload  
  @ViewChild('file')
  file: ElementRef;
  imgEmpresa = null;
  imgURL = null;
  imagePath;

  message: string;
  origenes = [
    {label: 'Importado', value: 'importado'},
    {label: 'Local', value: 'local'},
  ];

  sino = [
    {label: 'Sí', value: 'si'},
    {label: 'No', value: 'no'},
  ];

  dataColeccion: any;
  usuario: any;
  getChasis = false;
  id: number;

  constructor(private fb: FormBuilder,
              private usuariosServ: UsuarioService,
              private DatosEstaticos: DatosEstaticosService,
              private uiMessage: UiMessagesService,              
              private dialogService: DialogService,
              private inventarioServ: InventarioService,
              private marcaService: BrandsService,
              private tipoInv: TipoInventarioService,
              private propServ: PropiedadesService,
              private bodegasServ: BodegasService,
              private categoriasServ: CategoriasService) { 
                this.usuario = this.usuariosServ.getUserLogged()
                this.crearFormulario();
              }

  ngOnDestroy(): void {
    this.listSubscribers.forEach(a => a.unsubscribe());
  }

  ngOnInit(): void {
    this.tipo(1);
    this.fechaFabricacion();
    this.todaLaData();
    this.listObserver();
  }

  listObserver = () => {
    const observer1$ = this.marcaService.marcaGuardada.subscribe((resp: any) =>{
      this.brands.push(resp)
    })

    const observer2$ = this.tipoInv.TipoInventarioGuardado.subscribe((resp: any) =>{
      this.tipoInventario.push(resp)
    })

    const observer3$ = this.categoriasServ.categoriaGuardada.subscribe((resp: any) =>{
      this.categorias.push(resp)
    })

    const observer4$ = this.propServ.propiedadGuardada.subscribe((resp: any) =>{
      this.propiedades.push(resp)
    })
    
    const observer5$ = this.bodegasServ.bodegaGuardada.subscribe((resp: any) =>{
      this.bodegas.push(resp)
    })    
    
    const observer6$ = this.inventarioServ.actualizar.subscribe((resp: any) =>{
      this.guardar = false;
      this.actualizar = true;   
      this.id = Number(resp);
      this.inventarioServ.getDato(resp).then((res: any) => {   
         
        
        this.forma.patchValue(res);
        this.imgURL = `${URL}/storage/${res.galeriaImagenes}`;
        this.forma.get('tipo_producto').setValue(this.tipos.find(tipo => tipo.id === res.tipo_producto));
        this.forma.get('fabricacion').setValue({value: Number(res.fabricacion)});
        this.forma.get('id_brand').setValue(this.brands.find(brand => brand.id_brand === res.id_brand));
        this.forma.get('id_categoria').setValue(this.categorias.find(categoria => categoria.id_categoria === res.id_categoria));
        this.forma.get('id_propiedad').setValue(this.propiedades.find(propiedad => propiedad.id_propiedad === res.id_propiedad));        
        this.forma.get('id_tipoinventario').setValue(this.tipoInventario.find(tipo => tipo.id_tipoinventario === res.id_tipoinventario));
        //this.forma.get('origen').setValue(this.origenes.find(origen => origen.value === res.origen));
        this.forma.get('id_bodega').setValue(this.bodegas.find(bodega => bodega.id_bodega === res.id_bodega));
        this.tipo(res.tipo_producto)
      })
    })

    this.listSubscribers = [observer1$,observer2$,observer3$,observer4$,observer5$,observer6$];
  };

  crearFormulario() {
    this.forma = this.fb.group({
      titulo:               ['testfgfgfgfg', Validators.required],
      chasis:               ['5TDZK3EH9AS004144', Validators.required],
      motor:                ['234234', Validators.required],
      fabricacion:          ['', Validators.required],
      asientos:             ['1', Validators.required],
      asientosAd:           [''],
      id_propiedad:         [''],
      tipo_producto:        ['', Validators.required],
      id_tipoinventario:    ['', Validators.required],
      id_categoria:         ['', Validators.required],
      id_brand:             [''],
      descripcion:          ['fghjfghjfghj', Validators.required],
      codigo_referencia:    [''],
      origen:               [''],
      existenciaMinima:     [1],
      existenciaMaxima:     [''],
      controlDeExistencias: ['', Validators.required],
      id_bodega:            [''],
      controlItbis:         ['', Validators.required],
      precio_compra:        ['80', Validators.required],
      precio_venta:         ['500', Validators.required],
      costo:                ['100', Validators.required],  
      galeriaImagenes:      [''],
      estado:               ['activo'],
      descuento:            ['', Validators.required],
      usuario_creador:      [this.usuario.username, Validators.required],
      usuario_modificador:  ['']
    })
  }

  guardarProducto() {   
    this.guardando = false;
    console.log(this.forma);    
    if (this.forma.invalid) {      
      this.uiMessage.getMiniInfortiveMsg('tst','error','Atención','Debe completar los campos que son obligatorios'); 
      Object.values(this.forma.controls).forEach(control =>{
        control.markAllAsTouched();
      })
    }else{
      this.inventarioServ.crearInvProducto(this.forma.value).then((resp: any)=>{
        this.guardando = false; 
        this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente',resp.msj); 
        this.resetFormulario();
      })
    }  
  }
  
  actualizarProducto() {
    //this.actualizando = true;
    this.forma.get('usuario_modificador').setValue(this.usuario.username);    
    if (this.forma.invalid) {      
      this.uiMessage.getMiniInfortiveMsg('tst','error','Atención','Debe completar los campos que son obligatorios'); 
      Object.values(this.forma.controls).forEach(control =>{
        control.markAllAsTouched();
      })
    }else{
      this.inventarioServ.actualizarInvProducto(this.id, this.forma.value).then((resp: any)=>{
        this.actualizando = false;
        this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente',resp.msj); 
        this.resetFormulario();
      })
    }
  }

  todaLaData() {   
    this.inventarioServ.autoLlenado().then((resp: any) =>{
      this.dataColeccion = resp;      
      resp.forEach(element => {
        switch (element.label) {
          case 'tipo inventario':
            this.tipoInventario = element.data;
            break;

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

          case 'medidas':
            this.medidas = element.data;
            break;

          case 'tipo producto':
            this.tipos = element.data;
            this.forma.get('tipo_producto').setValue(this.tipos.find(tipo => tipo.id === 1))
            break;  

          default:
            break;
        }
      });
      this.autollenado(resp);   
    })
  }

  autollenado(data) {
    let existe = null;
    data.forEach(element => {            
      if (element.data.length === 0) {
        existe = true;
      }
    });
    if (existe === true) {
      const ref = this.dialogService.open(StepComponent, {
        data,
        closeOnEscape: false,
        header: 'Datos Necesarios Creación de Productos',
        width: '70%'
      });
    }
  }
  
  fechaFabricacion() {
    let rango = this.DatosEstaticos.getYear() - 1950 + 1;
    let temp = [];
    for (let index = 0; index < rango; index++) {
       temp.push({value: 1950 + (index)})
    }  
    this.fechafabricacion = temp.reverse();      
   }

  verificaProducto(data){    
    if (data === "") {
      this.productoExiste = 3;
      return;
    }
    let param = {'producto': data};
    this.productoExiste = 0;
    this.inventarioServ.busquedaProducto(param).then((resp: any)=>{
      if(resp.length === 0) {
        this.productoExiste = 1;
      }else{
        this.productoExiste = 2;
      }
    })
  }

  tipo(valor) {
    const id_brand = this.forma.get('id_brand')   
    const existenciaMinima = this.forma.get('existenciaMinima');  
    const id_bodega = this.forma.get('id_bodega');
    // const galeriaImagenes = this.forma.get('galeriaImagenes');
    const chasis = this.forma.get('chasis');
    const motor = this.forma.get('motor');
    const fabricacion = this.forma.get('fabricacion');
    const asientos = this.forma.get('asientos');
    const id_propiedad = this.forma.get('id_propiedad');
    const controlDeExistencias = this.forma.get('controlDeExistencias');
        
    if (valor === 1) {
      id_brand.setValidators(Validators.required)
      existenciaMinima.setValidators(Validators.required)
      id_bodega.setValidators(Validators.required)     
      id_propiedad.setValidators(Validators.required) 
      // galeriaImagenes.setValidators(Validators.required) 
      this.tipoProducto(valor)
    }else{
      id_brand.clearValidators();
      existenciaMinima.clearValidators();
      id_bodega.clearValidators();   
      // galeriaImagenes.clearValidators();   
      chasis.clearValidators();  
      motor.clearValidators();  
      fabricacion.clearValidators();  
      asientos.clearValidators();  
      id_propiedad.clearValidators();  
      controlDeExistencias.clearValidators();  
      this.tipoProducto(3)
    }
    id_brand.updateValueAndValidity
    existenciaMinima.updateValueAndValidity
    id_bodega.updateValueAndValidity     
    id_propiedad.updateValueAndValidity
  }
  
  tipoProducto(tipo) {    
    if (tipo === 3 || tipo === 2) {
      this.noFisico = false;
      this.forma.controls['id_brand'].disable();
      this.forma.controls['id_bodega'].disable();
      this.forma.controls['existenciaMinima'].disable();
      this.forma.controls['existenciaMaxima'].disable();
      this.forma.controls['controlDeExistencias'].disable();
      this.forma.controls['chasis'].disable();
      this.forma.controls['motor'].disable();
      this.forma.controls['fabricacion'].disable();
      this.forma.controls['asientos'].disable();
      this.forma.controls['id_categoria'].disable();
      this.forma.controls['id_propiedad'].disable();   
      this.forma.controls['asientosAd'].disable();    
    }else{
      this.noFisico = true;
      this.forma.controls['id_brand'].enable();
      this.forma.controls['id_bodega'].enable();
      this.forma.controls['origen'].enable();
      this.forma.controls['existenciaMinima'].enable();
      this.forma.controls['existenciaMaxima'].enable();
      this.forma.controls['controlDeExistencias'].enable();
      this.forma.controls['chasis'].enable();
      this.forma.controls['motor'].enable();
      this.forma.controls['fabricacion'].enable();
      this.forma.controls['asientos'].enable();
      this.forma.controls['id_categoria'].enable();
      this.forma.controls['id_propiedad'].enable();   
      this.forma.controls['asientosAd'].enable(); 
    }
  }

  preview(files) {
    if (files.length === 0)
      return;
 
    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Solo puede escoger imagenes";
      return;
    }

    this.forma.get("galeriaImagenes").setValue(files[0]);
    
    var reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]); 
    reader.onload = (_event) => { 
      this.imgURL = reader.result; 
    }
  }

  // onFileSelect(event) {
  //   this.forma.get("galeriaImagenes").setValue(this.fileUpload.files);
  // }
  
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
                 
              this.forma.get('id_categoria').setValue(this.categorias.find(categoria => categoria.id_categoria === res.id_categoria))  
            })
          }          
        })
      })
    }
  }

  cancelar() {
    this.actualizar = false;
    this.guardar = true;
    this.resetFormulario();
    this.inventarioServ.guardando();
  }

  resetFormulario() {
    this.forma.reset();
    // this.fileUpload.clear();
    this.file.nativeElement.value = "";
    this.imgEmpresa = null;
    this.imgURL = null;
    this.forma.get('usuario_creador').setValue(this.usuario.username);    
    this.forma.get('estado').setValue('activo');
  }

  getNoValido(input: string) {
    return this.forma.get(input).invalid && this.forma.get(input).touched;
  }

}