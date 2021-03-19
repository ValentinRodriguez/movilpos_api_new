import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { FileUpload } from 'primeng/fileupload';
import { ListaProductosComponent } from 'src/app/components/lista-productos/lista-productos.component';
import { ListadoDireccionesComponent } from 'src/app/components/listado-direcciones/listado-direcciones.component';
import { DatosEstaticosService } from 'src/app/services/datos-estaticos.service';
import { DireccionesService } from 'src/app/services/direcciones.service';
import { DOCUMENT } from '@angular/common';
import { InventarioService } from 'src/app/services/inventario.service';
import { OrdenescomprasService } from 'src/app/services/ordenescompras.service';
import { UiMessagesService } from 'src/app/services/ui-messages.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { StepOrdenesComprasComponent } from './step-ordenes-compras/step-ordenes-compras.component';
import { environment } from 'src/environments/environment';
const URL = environment.url;
@Component({
  selector: 'app-ordenes-compras',
  templateUrl: './ordenes-compras.component.html',
  styleUrls: ['./ordenes-compras.component.scss']
})

export class OrdenesComprasComponent implements OnInit {

  forma: FormGroup;
  ordenes:any[]=[];
  productos = [];
  i=0;
  isDisabled=true;
  detalles = [];

  totalCantidad = 0;
  totalItbis = 0;
  totalBruto = 0;
  totalNeto = 0;
  totalDescuento = 0;

  precio=0;
  itbis=0;
  cantidad= 0;
  valor_desc=0;
  valor_neto=0;
  porc_desc=0;
  valor_bruto=0;

  formBusqueda: FormGroup;
  formBusquedaDetalle: FormGroup;
  usuario: any;
  guardando = false;
  panelOpenState = false;
  proveedores=[];
  cols: any[];
  metodosEnv: any[];
  categoriaExiste = 3;
  cols2: any[];
  @ViewChild(FileUpload)
  fileUpload: FileUpload
  ProveedoresFiltrados: any[];
  condpago: any[];
  monedas: any;
  selectedCountry: any;
  puertos: any;
  direccion: any;
  direcciones: any[] = [];
  monto_desc: number;
  simbolo: any = '$';
  uploadedFiles: any[] = [];
  minDate: Date;
  selectedMulti: any[] = [];
  loading: boolean;
  
  constructor(private fb: FormBuilder, 
              private uiMessage: UiMessagesService,
              private usuariosServ: UsuarioService,
              private ordenServ :OrdenescomprasService,
              private invProductosServ: InventarioService,
              private confirmationService: ConfirmationService,
              private datosEstaticosServ: DatosEstaticosService,
              public dialogService: DialogService,
              private direccionServ: DireccionesService,
              private router: Router,
              @Inject(DOCUMENT) private document: Document) { 
                this.usuario = this.usuariosServ.getUserLogged();
                this.crearFormulario()
              }

  ngOnInit(): void {
    this.todosLasOrdenes();
    this.setMinDate();
    this.productosEscogidos();
    this.direccionEscogida();

    this.ordenServ.autoLlenado().then((resp: any)  => {      
      resp.forEach(element => {
        switch (element.label) {
          case 'condiciones':
            this.condpago = element.data;
            break;

          case 'proveedores':
            this.proveedores = element.data;
            break;

          case 'puertos':
            this.puertos = element.data;
            break; 
  
          default:
            break;
        }
      });  
      this.autollenado(resp);  
    })

    this.direccion = {
      "nombre": "",
      "direccion_a": "",
      "direccion_b": "",
      "telefono": "",
      "pais": "",
      "ciudad": ""
    }
    
    this.cols = [
      { field: 'num_oc', header: 'Orden' },
      { field: 'nom_sp', header: 'Proveedor' },
      //{ field: 'numero_proforma', header: 'Proforma' },
      { field: 'descripcion_pago', header: 'Condición' },
      { field: 'pagada', header: 'Pagada' },
      { field: 'orden_cerrada', header: 'Cerrada' },
      { field: 'total_itbis', header: 'Itbis' },
      { field: 'total_desc', header: 'Descuento' },
      { field: 'total_bruto', header: 'Bruto' },
      { field: 'total_neto', header: 'Neto' },
      { field: 'fecha_enviada', header: 'Fecha' },
      { field: 'acciones', header: 'Acciones' }
    ] 

    this.cols2 = [
      { field: 'imagen', header: 'Producto' },
      { field: 'num_req', header: 'Numero Requisicion' },
      { field: 'porc_desc', header: '% Descuento' },
      { field: 'monto_desc', header: 'Descuento' },
      { field: 'itbis', header: 'ITBIS' },
      { field: 'cantidad1', header: 'Cantidad' },
      { field: 'precio', header: 'Precio' },
      { field: 'valor_bruto', header: 'Valor Bruto'},
      { field: 'valor_neto', header: 'Valor Neto'},
      { field: 'acciones', header: 'Acciones' }
    ]

    this.datosEstaticosServ.getMetEnvios().then((resp: any) => {
      this.metodosEnv = resp;      
    })
    
    this.ordenServ.ordenGuardada.subscribe(resp =>{
      this.todosLasOrdenes();
    })

    this.ordenServ.ordenBorrada.subscribe(resp =>{
      this.todosLasOrdenes();
    })

    this.ordenServ.ordenact.subscribe(resp =>{
      this.todosLasOrdenes();
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
      const ref = this.dialogService.open(StepOrdenesComprasComponent, {
        data,
        closeOnEscape: false,
        header: 'Datos necesarios creación ordenes de compras',
        width: '70%'
      });  
      // ref.onClose.subscribe(() => {
      //   location.reload();        
      // });
    }
  }

  todosLasOrdenes() {
    this.loading = true;
    this.ordenServ.getDatos().then((resp: any) => {
      this.loading = false;
      this.ordenes = resp;
    })
  }

  direccionEscogida() {
    this.direccionServ.direccionEscogida.subscribe((resp: any) => {
      this.direccion = resp;
      
      this.forma.get('nombre').setValue(resp.nombre);
      this.forma.get('id_pais').setValue(resp.id_pais);
      this.forma.get('id_ciudad').setValue(resp.id_ciudad);
      this.forma.get('direccion_a').setValue(resp.direccion_a);
      this.forma.get('direccion_b').setValue(resp.direccion_b);
      this.forma.get('telefono').setValue(resp.telefono);
    }) 
  }
  
  borrarProducto(id) {
    this.productos.splice(id,1)  
  }
  
  productosEscogidos() {
    this.invProductosServ.productoEscogido.subscribe((resp: any) => {
      this.productos = [];
      this.producto.reset();
      resp.forEach(element => {

        //CALCULO VALOR NETO
        element.descuento = 0;
        let itbis = element.itbis || 30       
        this.agregarFormulario(element);
        this.productos.push(element)
      });
      
      let totalCantidad = 0;

      for(let sale of this.productos) {
        totalCantidad += 1;
      }
      this.totalCantidad = totalCantidad;
    })
  }

  crearFormulario() {                
    this.forma = this.fb.group({
      fecha_enviada:     ['', Validators.required],
      numero_proforma:   ['654564ffgh', Validators.required],
      archivos:          [''],
      cond_pago:         ['', Validators.required],
      via_envio:         [''],
      cod_sp:            ['', Validators.required],
      cod_sp_sec:        ['', Validators.required],
      id_moneda:         ['', Validators.required],
      id_puerto:         [''],
      total_bruto:       ['', Validators.required],
      total_desc:        ['', Validators.required],
      total_itbis:       ['', Validators.required],
      total_neto:        ['', Validators.required],
      observaciones:     ['dfadsfadfadsf'],
      nombre:            [''],
      id_pais:           [''],
      id_ciudad:         [''],
      direccion_a:       ['', Validators.required],
      direccion_b:       ['', Validators.required],
      telefono:          [''],
      estado:            ['ACTIVO'],
      usuario_creador:   [this.usuario.username],
      proveedor:         [''],
      productos: this.fb.array([])     
    })
  }

  get producto() {   
    return this.forma.get('productos') as FormArray;
  }

  agregarFormulario(producto) {

    let porc_desc = 0;
    let monto_desc = 0;
    let cantidad1 = 1;
    let margen = 0;

    (<FormArray>this.forma.get('productos')).push(this.agregarFormularioTransacciones(producto,porc_desc,monto_desc,cantidad1,margen));    
  }
  
  agregarFormularioTransacciones(producto,porc_desc,monto_desc,cantidad1,margen): FormGroup {
    return this.fb.group({
      codigo:       [producto.codigo, Validators.required],
      num_req:      ['3434', Validators.required],
      porc_desc:    [porc_desc, Validators.required],
      monto_desc:   [monto_desc, Validators.required],
      itbis:        [producto.itbis],
      cantidad1:    [cantidad1, Validators.required],
      precio:       ['', Validators.required],
      valor_bruto:  [producto.valor_bruto, Validators.required],
      valor_neto:   [producto.neto, Validators.required],
      margen:       [margen, Validators.required],
      costo:        [producto.costo, Validators.required],
    });
  }

  guardarOrdenes(){
    //this.guardando = true;
    console.log(this.forma.value)
    this.forma.get("total_bruto").setValue(this.totalBruto)
    this.forma.get("total_desc").setValue(this.totalDescuento)
    this.forma.get("total_itbis").setValue(this.totalItbis)
    this.forma.get("total_neto").setValue(this.totalNeto)
    
    if (this.forma.invalid) {      
      this.uiMessage.getMiniInfortiveMsg('tst','error','Error!!','Debe completar los campos que son obligatorios');       
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
      })
      this.guardando = false;
    }else{      
      this.guardando = false;
      this.ordenServ.crearOrdenes(this.forma.value).then((resp: any)=>{
      
        this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente!',resp.msj); 
        console.log(resp.data.num_oc)  
        this.imprimirOrden(resp.data.num_oc)    
     
      })
    }  
  } 

  imprimirOrden(num_oc) {
    const link = this.document.createElement('a');
    link.target = '_blank';
    link.href = `${URL}/reporte/orden-compras/${num_oc}`;
    link.click();
    link.remove();
  }

  getNoValido(input: string) {
    return this.forma.get(input).invalid && this.forma.get(input).touched;
  }

 calcula(i, event){
  if (event.target.value === '') {
    return;
  }
  let precio = this.producto.controls[i].value.precio;
  let porc_desc = this.producto.controls[i].value.porc_desc/100;
  let cantidad = this.producto.controls[i].value.cantidad1; 
  
  let bruto = precio * cantidad;
  let descuento = porc_desc * bruto;
  let itbis =  bruto * 0.18;
  let itbisRounded = this.datosEstaticosServ.decimalAdjust('round', itbis, -1)
  
  let neto = bruto - descuento + itbisRounded;
  this.totalItbis +=  itbisRounded;

  ((this.producto).at(i) as FormGroup).get("monto_desc").patchValue(descuento);
  ((this.producto).at(i) as FormGroup).get("itbis").patchValue(itbisRounded);
  ((this.producto).at(i) as FormGroup).get("valor_bruto").patchValue(bruto);
  ((this.producto).at(i) as FormGroup).get("valor_neto").patchValue(neto);

  this.totalDescuento = 0;
  this.totalCantidad = 0;
  this.totalBruto = 0;
  this.totalNeto = 0;

  for (let i = 0; i < this.productos.length; i++) {     
    this.totalDescuento += Number(this.producto.controls[i].value.monto_desc) ; 
    this.totalCantidad += Number(this.producto.controls[i].value.cantidad1);  
    this.totalBruto += Number(this.producto.controls[i].value.valor_bruto); 
    this.totalNeto += Number(this.producto.controls[i].value.valor_neto);    
  }
 } 

  actualizarOrdenes(producto) { 
    this.router.navigate(['actualizar-orden-compra',producto.id]);
  }

  borrarOrden(orden) {
    this.confirmationService.confirm({
      message:"Esta seguro de borrar este registro?",
      accept:() =>{ 
        this.ordenServ.borrar(orden).then((resp: any)=>{
          this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente',resp.msj);   
        })       
      }
    })   
  }

  buscaProductos() {
    const ref = this.dialogService.open(ListaProductosComponent, {
      header: 'Catálogo de productos',
      width: '70%'
    });
  }

  borrarProdEscogido(id) {
    console.log(id);
  }

  onFileSelect(event) {
    this.forma.get("archivos").setValue(this.fileUpload.files);
  }

  filtrarProveedor(event) {
    const filtered: any[] = [];
    const query = event.query;
    
    for (let i = 0; i < this.proveedores.length; i++) {
      const size = this.proveedores[i];
      
      if (size.nom_sp.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(size);
      }
    }
    this.ProveedoresFiltrados = filtered;
  }

  listadoDirecciones() {
    const ref = this.dialogService.open(ListadoDireccionesComponent, {
      header: `Listado de direcciones`,
      width: '70%'
    });
  }

  datosProv(event) {
    this.monedas = JSON.parse(event.moneda) 
    this.forma.get("cod_sp").setValue(event.cod_sp);
    this.forma.get("cod_sp_sec").setValue(event.cod_sp);
  }

  simboloMoneda(event) {
    this.simbolo = event.value.simbolo;
  }

  onSelectDate(event) {
    let d = new Date(Date.parse(event));
    this.forma.get("fecha_enviada").setValue(`${d.getFullYear()}/${d.getMonth()+1}/${d.getDate()}`);
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
