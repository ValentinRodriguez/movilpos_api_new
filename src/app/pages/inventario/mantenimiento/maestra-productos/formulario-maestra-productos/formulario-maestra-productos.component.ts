import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CategoriasService } from 'src/app/services/inventario/categorias.service';
import { InventarioService } from 'src/app/services/inventario/inventario.service';
import { UiMessagesService } from 'src/app/services/globales/ui-messages.service';
import { FileUpload } from 'primeng/fileupload';

import { ProveedoresService } from 'src/app/services/compras/proveedores.service';

@Component({
  selector: 'app-formulario-maestra-productos',
  templateUrl: './formulario-maestra-productos.component.html',
  styleUrls: ['./formulario-maestra-productos.component.scss'],
  // providers:[InventarioService,BrandsService,TipoInventarioService,PropiedadesService,
  //            BodegasService,CategoriasService,GlobalFunctionsService]
})
export class FormularioMaestraProductosComponent implements OnInit {

  forma: FormGroup;
  guardando = false;
  guardar = true;
  actualizando = false;
  actualizar = false;
  productoExiste = 3;  
  listSubscribers: any = [];
  categorias: any[] = [];
  envios: any[] = [];
  uploadedFiles: any[] = [];
  @ViewChild(FileUpload)
  fileUpload: FileUpload  
  imagePath;
  message
  @ViewChild('file')
  file: ElementRef;
  id: number;
  fileArr: any[] = []
  proveedores: any;
  
  imgEmpresa = null;
  imgURL = null;
  constructor(private fb: FormBuilder,              
              private uiMessage: UiMessagesService,   
              private inventarioServ: InventarioService,
              private proveedoresServ: ProveedoresService,
              private categoriasServ: CategoriasService) {                 
                this.crearFormulario();
              }

  ngOnDestroy(): void {
    this.listSubscribers.forEach(a => a.unsubscribe());
  }

  ngOnInit(): void {
    this.todaLaData();
    this.listObserver();
  }

  listObserver = () => {

    const observer1$ = this.proveedoresServ.getDatos().subscribe((resp:any) =>{
      if (resp.ok) {
        this.proveedores = resp.data        
      }
    })
    const observer3$ = this.categoriasServ.categoriaGuardada.subscribe((resp: any) =>{
      this.categorias.push(resp)
    });
    
    const observer6$ = this.inventarioServ.actualizar.subscribe((resp: any) =>{
      this.id = resp.uid    
      this.guardar = false;
      this.actualizar = true;   
      this.forma.patchValue(resp);
      this.forma.get('categoria').setValue(this.categorias.find(categoria => categoria.uid == resp.categoria._id));
      this.forma.get('envios').setValue(this.envios.find(envio => envio.uid == resp.envios._id));
      // this.gf.enviarurlClean(JSON.parse(res.galeriaImagenes))
      // this.imgURL = res.galeriaImagenes;
      // this.forma.get('id_categoria').setValue(this.categorias.find(categoria => categoria.id_categoria === res.id_categoria));
      // this.forma.get('id_propiedad').setValue(this.propiedades.find(propiedad => propiedad.id_propiedad === res.id_propiedad));        
      // this.forma.get('id_tipoinventario').setValue(this.tipoInventario.find(tipo => tipo.id_tipoinventario === res.id_tipoinventario));
      // //this.forma.get('origen').setValue(this.origenes.find(origen => origen.value === res.origen));
      // this.forma.get('id_bodega').setValue(this.bodegas.find(bodega => bodega.id_bodega === res.id_bodega));
      // this.tipo(res.tipo_producto)
      // this.id = Number(resp);
      
    });

    this.listSubscribers = [observer3$,observer6$];
  };

  recibeFiles(event) {
    this.forma.get('archivos').setValue(event);
  }

  crearFormulario() {
    this.forma = this.fb.group({
      nombre:        ['', Validators.required],
      descripcion:   ['', Validators.required],
      categoria:     ['', Validators.required], 
      regular_price: [''],
      precio:        ['', Validators.required],
      descuento:     [''],
      proveedor:     [''],
      ganancia:      ['', Validators.required],
      envios:        ['', Validators.required],
      purchase_note: [''],
      // sku:        [''],
      width:         [''],
      height:        [''],
      weight:        [''],
      archivos:      ['', Validators.required],
    })
  }

  guardarProducto() {
    if (this.forma.invalid) {           
      this.uiMessage.getMiniInfortiveMsg('tst','error','Atención','Debe completar los campos que son obligatorios'); 
      Object.values(this.forma.controls).forEach(control =>{
        control.markAllAsTouched();
      })
    }else{
      console.log(this.forma.value);
      if (this.actualizar) {
        this.inventarioServ.actualizarInvProducto(this.id, this.forma.value).subscribe((resp: any)=>{ 
          if (resp.ok) {
            this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro actualizado de manera correcta'); 
            this.resetFormulario();
            this.inventarioServ.productoGuardado.emit(resp.data)            
          }        
        })
      }else{
        this.inventarioServ.crearInvProducto(this.forma.value).subscribe((resp: any)=>{  
          console.log(resp);
                  
          if (resp.ok) {
            this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro creado de manera correcta'); 
            this.resetFormulario();          
            this.inventarioServ.productoActualizado.emit(resp.data)            
          }
        })
      }
    }       
  }
  
  onFileSelect() {
    this.forma.get('archivos').setValue(this.fileUpload.files);    
  }


  todaLaData() {       
    this.inventarioServ.autoLlenado().subscribe((resp: any) =>{
      this.categorias = resp.data.categorias
      this.envios = resp.data.envios
    })
  }

  verificaProducto(data){    
    if (data === "") {
      this.productoExiste = 3;
      return;
    }
    this.productoExiste = 0;
    this.inventarioServ.busquedaProducto(data).subscribe((resp: any)=>{
      console.log(resp);
      
      if (resp.ok) {
        if(resp.data.length === 0) {
          this.productoExiste = 1;
        }else{
          this.productoExiste = 2;
        }        
      }
    })
  }
    
  preview(files) {
    if (files.length === 0)
      return;
 
    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Solo puede escoger imagenes";
      return;
    }

    this.forma.get('archivos').setValue(files[0])
    console.log(this.forma.value);
    
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
    this.inventarioServ.guardando();
  }

  resetFormulario() {
    this.forma.reset();  
  }

  getNoValido(input: string) {
    return this.forma.get(input).invalid && this.forma.get(input).touched;
  }

}