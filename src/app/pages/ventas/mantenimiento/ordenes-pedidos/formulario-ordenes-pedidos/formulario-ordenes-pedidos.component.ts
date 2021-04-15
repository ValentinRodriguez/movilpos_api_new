import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogService } from 'primeng/dynamicdialog';
import { FileUpload } from 'primeng/fileupload';
import { OverlayPanel } from 'primeng/overlaypanel';
import { ListaProductosComponent } from 'src/app/components/lista-productos/lista-productos.component';
import { ClientesService } from 'src/app/services/clientes.service';
import { CondicionesPagoService } from 'src/app/services/condiciones-pago.service';
import { DatosEstaticosService } from 'src/app/services/datos-estaticos.service';
import { InventarioService } from 'src/app/services/inventario.service';
import { OrdenPedidosService } from 'src/app/services/orden-pedidos.service';
import { PaisesCiudadesService } from 'src/app/services/paises-ciudades.service';
import { RrhhService } from 'src/app/services/rrhh.service';
import { UiMessagesService } from 'src/app/services/ui-messages.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ZonasService } from 'src/app/services/zonas.service';

@Component({
  selector: 'app-formulario-ordenes-pedidos',
  templateUrl: './formulario-ordenes-pedidos.component.html',
  styleUrls: ['./formulario-ordenes-pedidos.component.scss']
})
export class FormularioOrdenesPedidosComponent implements OnInit {

  forma: FormGroup;
  @ViewChild(FileUpload)   
  fileUpload: FileUpload;
  @ViewChild('op') overlay: OverlayPanel;
  totalBruto = 0;
  totalNeto = 0;
  totalItbis = 0;
  totalDescuento = 0;
  usuario: any;
  cotizaciones: any[] = [];
  cotizacionesFiltradas: any[] = [];
  minDate: Date;
  year: any;
  totalCantidad = 0;
  vendedorFiltrado: any[] = [];
  clientes: any[] = [];
  clientesSeleccionados: any[] = [];
  vendedores: any[] = [];
  clientesFiltrados: any[];
  productos: any[] = [];
  condpago:any[] = [];
  direccion: any;
  totalCosto = 0;
  paises: any[] = [];
  ciudades: any[] = [];
  tipo_orden: any
  ordenesFiltradas: any[];
  ordenes: any[] = [];
  cols2: any[];
  uploadedFiles: any[] = [];
  zonalocal: any[] = [];
  guardando = false;
  guardar = true;
  actualizando = false;
  actualizar = false;
  id: number;
  simbolo = '$RD'
  formSubmitted = false;
  
  constructor(private uiMessage: UiMessagesService,
              private fb: FormBuilder,              
              private ordenServ :OrdenPedidosService,
              private invProductosServ: InventarioService,
              private datosEstaticosServ: DatosEstaticosService,
              private noempleadosServ: RrhhService,
              private clientesServ: ClientesService,
              private condicionesServ: CondicionesPagoService,              
              private usuariosServ: UsuarioService,
              private paisesCiudadesServ: PaisesCiudadesService,
              private zonasLocal: ZonasService,
              public dialogService: DialogService,) {
                this.year = this.datosEstaticosServ.getDate();
                this.usuario = this.usuariosServ.getUserLogged(), 
                this.crearFormulario()
               }

  ngOnInit(): void {
    this.todosLosEmpleados();
    this.todosLosClientes();
    this.todasLasCondiciones();
    this.productosEscogidos();
    this.todasLasZonas();

    this.ordenServ.actualizar.subscribe((resp: any) =>{
      this.guardar = false;
      this.actualizar = true;   
      this.id = Number(resp);      
      this.ordenServ.getDato(resp).then((res: any) => {
         
        // this.forma.get('divisa').setValue(res.divisa);
        // this.forma.get('simbolo').setValue(res.simbolo);
        this.forma.patchValue(res);
      })
    })

    this.direccion = {
      "nombre": "",
      "direccion_a": "",
      "direccion_b": "",
      "telefono": "",
      "pais": "",
      "ciudad": ""
    }

    this.tipo_orden = [ 
        {"label": "General", "value": "general"},
        {"label": "Digital", "value": "digital"}
    ]   

    this.cols2 = [
      { field: 'imagen', header: 'Producto' },
      { field: 'codigo', header: 'Código' },
      { field: 'porc_desc', header: '% Descuento' },
      { field: 'descuento', header: 'Descuento' },
      { field: 'costo', header: 'Costo'},
      { field: 'cantidad1', header: 'Cantidad' },
      { field: 'precio', header: 'Precio' },
      { field: 'fecha_compromiso', header: 'Fecha' },
      { field: 'observacion', header: 'Observacion'},
      { field: 'id_kit', header: 'Kit'},
      // { field: 'departamento', header: 'Departamento'},
    ]

    this.paisesCiudadesServ.getPaises().then((resp: any) => {
      this.paises = resp;          
    })
  }

  

  get producto() {   
    return this.forma.get('productos') as FormArray;
   }

  guardarOrdenes() {
    this.formSubmitted = true;
    let subtotal = Number(this.totalBruto) - Number(this.totalDescuento)
    this.forma.get("total_bruto").setValue(this.totalBruto)
    this.forma.get("monto_desc").setValue(this.totalDescuento)
    this.forma.get("itbis").setValue(this.totalItbis)
    this.forma.get("sub_total").setValue(subtotal)
    this.forma.get("neto").setValue(this.totalNeto)
    
    if (this.forma.invalid) {      
      this.formSubmitted = false;
     this.uiMessage.getMiniInfortiveMsg('tst','error','Error!!','Debe completar los campos que son obligatorios');       
     Object.values(this.forma.controls).forEach(control =>{          
       control.markAllAsTouched();
     })
   }else{      
     this.forma.value.usuario_creador = this.usuario.username;
     this.ordenServ.crearOrdenes(this.forma.value).then((resp: any)=>{
       this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente!','Registro creado de manera correcta');       
     })
   }
    
 }

 actualizarPedido(){
    this.formSubmitted = true; 
    this.forma.get('usuario_modificador').setValue(this.usuario.username);    
      if (this.forma.invalid) {    
        this.formSubmitted = false;   
        this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios');      
        Object.values(this.forma.controls).forEach(control =>{          
          control.markAllAsTouched();
        })
      }else{ 
        this.ordenServ.actualizarPedido(this.id, this.forma.value).then((resp: any) => {
          this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro actualizado de manera correcta');         
        })
      }
  }

  cancelar() {
    this.actualizar = false;
    this.guardar = true;
    this.forma.reset();
    this.forma.get('estado').setValue('activo');
    this.forma.get('usuario_creador').setValue(this.usuario.username);
    this.ordenServ.guardando();    
  }

  todasLasZonas() {
    this.zonasLocal.getDatos().then((resp: any) => {
      this.zonalocal = resp;
       
    })
  }

  todosLasOrdenes() {
    this.ordenServ.getDatos().then((resp: any) => { 
      this.ordenes = resp;   
    })
  }

  todosLosClientes() {
    this.clientesServ.getDatos().then((resp: any) =>{
      this.clientes = resp;  
    })
  }

  todosLosEmpleados() {
    this.noempleadosServ.buscaVendedores().then((resp: any)=>{
      this.vendedores = resp;
    })
  }

  todasLasCondiciones(){
    this.condicionesServ.getDatos().then((resp: any) => {
      this.condpago = resp;
    }) 
  }

  crearFormulario() {                
    this.forma = this.fb.group({
      ventas:            [''],
      cotizacion_no:     [''],
      fecha_orden:       [this.year],
      sec_vend:          [''],
      cliente:           [''],
      nombre_cliente:    [''],      
      // direccion_cliente: [''],
      pais_cliente:      [''],
      urbanizacion_cliente: [''],
      ciudad_cliente:    [''],
      tipo_cliente:      [''],
      sec_cliente:       [''],
      direccion:         ['ertertert'],
      telefono:          ['5856258526'],
      fecha_entrega:     [''],
      cond_pago:         [''], 
      total_bruto:       [''],
      itbis:             [''],
      monto_desc:        [''],
      sub_total:         [''],
      neto:              [''],
      ubicacion:         ['sdfsdfsdf'],
      cerrada:           ['no'],
      fecha_cierre:      [''],
      id_pais:           [''],
      id_ciudad:         [''],
      id_zonalocal:      [''],
      observacion:       ['sdfsdfdfsdf'],
      tipo_orden:        [''],      
      estado_despacho:   ['no'],
      id_ultima_bodega:  [''],
      estado_devolucion: ['no'],
      orden_sustituta:   [''],
      estado:            ['activo'],
      productos:         this.fb.array([]),  
      archivos:          [''],   
      usuario_creador:   [this.usuario.username]
    })
  }

  agregarFormularioTransacciones(producto,area,cantidad): FormGroup {
    return this.fb.group({
      num_oc:            [''],
      area:              [area],
      codigo:            [producto.codigo, Validators.required],
      precio:            [producto.precio_venta, Validators.required],
      cantidad1:         [cantidad],
      porc_desc:         [''],
      descuento:         [''],
      total_bruto:       [''],
      itbis:             [''],
      sub_total:         [''],
      neto:              [''],
      costo:             [producto.costo, Validators.required],      
      fecha_compromiso:  [''],
      estado_produccion: [''],
      observacion:       ['fghfghfgh'],
      id_kit:            ['1'],
      departamento:      ['']
    });
  }

  agregarFormulario(producto) {
    let area = 1;
    let cantidad = 1;
    (<FormArray>this.forma.get('productos')).push(this.agregarFormularioTransacciones(producto,area,cantidad));    
  }

  onFileSelect(event) {
    this.forma.get("archivos").setValue(this.fileUpload.files);
  }

  productosEscogidos() {
    this.invProductosServ.productoEscogido.subscribe((resp: any) => {
      this.productos = [];
      this.producto.reset();
      resp.forEach(element => {

        //CALCULO VALOR BRUTO
        let cantidad = element.cantidad1 || 1;
        element.valor_bruto = element.precio_venta * cantidad;
        
        //CALCULO VALOR NETO
        element.descuento = 0;
        let itbis = element.itbis || 30
        element.neto = element.valor_bruto - element.descuento + itbis;        
        this.agregarFormulario(element);

        this.productos.push(element)
      });      
      let totalCantidad = 0;
      let totalValorBruto = 0;
      let totalValorNeto = 0;
      let totalCosto = 0;
      for(let sale of this.productos) {
        totalCantidad += sale.cantidad1 || 1;
        totalValorBruto += sale.valor_bruto;
        totalValorNeto += sale.neto;
        totalCosto += sale.costo;
      }
      this.totalCantidad = totalCantidad;
      this.totalBruto = totalValorBruto;
      this.totalNeto = totalValorNeto;
      this.totalCosto = totalCosto;
    })
  }

  buscaProductos() {
     this.dialogService.open(ListaProductosComponent, {
      header: 'Catálogo de productos',
      width: '70%'
    });
  }

  calcula(i, event){
    if (event.value === '') {
      return;
    }
    let precio = this.producto.controls[i].value.precio;
    let porc_desc = this.producto.controls[i].value.porc_desc/100;    
    let cantidad = this.producto.controls[i].value.cantidad1;  
      
    let bruto = precio * cantidad;    
    let descuento = porc_desc * bruto;    

    let itbis =  bruto * 0.18;
    let itbisRounded = this.datosEstaticosServ.decimalAdjust('round', itbis, -1)
    let subTotal = Number(bruto) - Number(descuento);
    let neto = subTotal + itbisRounded;

    ((this.producto).at(i) as FormGroup).get("descuento").patchValue(descuento);
    ((this.producto).at(i) as FormGroup).get("total_bruto").patchValue(bruto);
    ((this.producto).at(i) as FormGroup).get("itbis").patchValue(itbisRounded);
    ((this.producto).at(i) as FormGroup).get("sub_total").patchValue(subTotal);
    ((this.producto).at(i) as FormGroup).get("neto").patchValue(neto);

    this.totalDescuento = 0;
    this.totalCantidad = 0;
    this.totalBruto = 0;
    this.totalNeto = 0;
    this.totalCosto = 0
    this.totalItbis = 0;

    for (let i = 0; i < this.productos.length; i++) {     
      this.totalBruto += bruto
      this.totalDescuento += this.producto.controls[i].value.descuento; 
      this.totalItbis +=  itbisRounded;
      this.totalNeto += neto
      this.totalCosto += this.producto.controls[i].value.costo;     
      this.totalCantidad += this.producto.controls[i].value.cantidad1;  
    }
  } 

  buscaPaises(data) {  
    //this.forma.get('id_pais').setValue(data.id)  
    this.paisesCiudadesServ.getCiudadesXpaises(data.id).then((resp:any) => {      
      this.ciudades = resp;      
    })  
  }

  filtrarOrdenes(event) {
    const filtered: any[] = [];
    const query = event.query;
    for (let i = 0; i < this.ordenes.length; i++) {
      const size = this.ordenes[i];
      
      if (size.num_oc.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(size);
      }
    }
    this.ordenesFiltradas = filtered;
  }

  filtrarVendedor(event) {
    const filtered: any[] = [];
    const query = event.query;
    
    for (let i = 0; i < this.vendedores.length; i++) {
      const size = this.vendedores[i];
      
      if (size.primernombre.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(size);
      }
    }
    this.vendedorFiltrado = filtered;
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

  datosCliente(cliente) {    
    this.forma.get('tipo_cliente').setValue(cliente.tipo_cliente);
    this.forma.get('sec_cliente').setValue(cliente.sec_cliente);
    this.forma.get('nombre_cliente').setValue(cliente.nombre);
    // this.forma.get('direccion_cliente').setValue(cliente.direccion);
    this.forma.get('pais_cliente').setValue(cliente.id_pais);
    this.forma.get('ciudad_cliente').setValue(cliente.id_ciudad);
    this.forma.get('urbanizacion_cliente').setValue(cliente.urbanizacion);
  }

  clienteSeleccionado(cliente) {  
    this.forma.get('cliente').setValue(cliente) 
    this.forma.get('tipo_cliente').setValue(cliente.tipo_cliente)
    this.forma.get('sec_cliente').setValue(cliente.sec_cliente)
    this.overlay.hide()
  }

  datosPais(cliente) {    
    this.forma.get('tipo_cliente').setValue(cliente.tipo_cliente);
    this.forma.get('sec_cliente').setValue(cliente.sec_cliente);
  }

  datosOrdenes(cliente) {    
    this.forma.get('tipo_cliente').setValue(cliente.tipo_cliente);
    this.forma.get('sec_cliente').setValue(cliente.sec_cliente);
  }
  
  ordenesSeleccionadas(cliente) {
    this.forma.get('tipo_cliente').setValue(cliente.tipo_cliente)
    this.forma.get('sec_cliente').setValue(cliente.sec_cliente)
    this.overlay.hide()
  }

  datosVendedor(event) {        
    this.forma.get("sec_vend").setValue(event.id_numemp);
  }

  filtrarCotizacion(event) {
    const filtered: any[] = [];
    const query = event.query;
    
    for (let i = 0; i < this.cotizaciones.length; i++) {
      const size = this.cotizaciones[i];
      
      if (size.nom_sp.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(size);
      }
    }
    this.cotizacionesFiltradas = filtered;
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

  onSelectDate(event, campo, index) {
    let d = new Date(Date.parse(event));
    if (campo === 'fecha_compromiso') {    
      ((this.producto).at(index) as FormGroup).get("fecha_compromiso").patchValue(`${d.getFullYear()}/${d.getMonth()+1}/${d.getDate()}`);
    }else{
      this.forma.get(campo).setValue(`${d.getFullYear()}/${d.getMonth()+1}/${d.getDate()}`);
    }
  }

  datosCotizacion(event) {    
    this.forma.get("cotizacion_no").setValue(event);
  }

  getNoValido(input: string) {
    return this.forma.get(input).invalid && this.forma.get(input).touched;
  }
}
