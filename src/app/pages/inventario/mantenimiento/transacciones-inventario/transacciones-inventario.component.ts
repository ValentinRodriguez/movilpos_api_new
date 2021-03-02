import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { ListaProductosComponent } from 'src/app/components/lista-productos/lista-productos.component';
import { PendientesEntradaComponent } from 'src/app/components/pendientes-entrada/pendientes-entrada.component';
import { BodegasService } from 'src/app/services/bodegas.service';
import { CodMovService } from 'src/app/services/cod-mov.service';
import { FacturasService } from 'src/app/services/facturas.service';
import { InventarioService } from 'src/app/services/inventario.service';
import { OrdenPedidosService } from 'src/app/services/orden-pedidos.service';
import { OrdenescomprasService } from 'src/app/services/ordenescompras.service';
import { TransaccionesService } from 'src/app/services/transacciones.service';
import { UiMessagesService } from 'src/app/services/ui-messages.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { environment } from 'src/environments/environment';
import { StepTransaccionesComponent } from './step-transacciones/step-transacciones.component';

const URL = environment.url;

@Component({
  selector: 'app-transacciones-inventario',
  templateUrl: './transacciones-inventario.component.html',
  styleUrls: ['./transacciones-inventario.component.scss']
})
export class TransaccionesInventarioComponent implements OnInit {

  forma: FormGroup;
  formBusqueda: FormGroup;
  usuario: any;
  movimientos:any[] = [];
  productos = [];
  transacciones:any[] = [];
  productosTransacciones:any[] = [];
  bodegas = [];
  bodegasPermisos:any[] = [];
  codMov = [];
  clientes = [];
  vendedores = [];
  facturas
  guardando = false;
  ordenPedidoExiste = 3;
  facturaExiste = 3;
  transaccionExiste = 3;
  ocExiste = 3;
  cfactura = false;
  cCliente = false;
  cPedido = false;
  cDestino = false;
  cDepartamento = false;
  cOrdenCompra = false;
  cProveedor = false;
  cantidadExcede = false;
  proveedores: any[] = [];
  departamentos: any[] = [];
  transportistas: any;
  deptosSeleccionados: any[] =[];
  DeptosFiltrados: any[];
  clientesFiltrados: any[];
  ProveedoresFiltrados: any[];
  minDate: Date;
  
  cols: any[] = [];
  cols2: any[] = [];
  vendedorFiltrado: any[];
  loading: boolean;
  
  constructor(private fb: FormBuilder,
              private uiMessage: UiMessagesService,
              private codMovServ: CodMovService,
              private usuariosServ: UsuarioService,
              private bodegasServ: BodegasService,
              private facturasServ: FacturasService,
              private ordenCompraServ: OrdenescomprasService,
              private ordenPedido: OrdenPedidosService,
              private transaccionesServ: TransaccionesService,
              private confirmationService: ConfirmationService,
              private invProductosServ: InventarioService,
              public dialogService: DialogService,
              @Inject(DOCUMENT) private document: Document) { 
                this.usuario = this.usuariosServ.getUserLogged()                
  }
  
  ngOnInit(): void {
    this.todasLastransacciones();
    this.todasLasBodegasConPermisos();

    this.transaccionesServ.autoLlenado().then((resp: any)  => {
      resp.forEach(element => {
        switch (element.label) {
          case 'clientes':
            this.clientes = element.data;
            break;

          case 'transportistas':
            this.transportistas = element.data;
            break;

          case 'departamentos':
            this.departamentos = element.data;
            break;

          case 'proveedores':
            this.proveedores = element.data;
            break;

          case 'vendedor':
            this.vendedores = element.data;
            console.log(this.vendedores)
            break;

          case 'bodegas':
            this.bodegas = element.data;
            break;

          case 'movimientos':
            this.movimientos = element.data;
            break;  

          default:
            break;
        }
      });  
      this.autollenado(resp);  
    })

    this.todosLosMov();
    this.setMinDate();
    this.pendientesEntrada();
    this.crearFormulario();

    this.cols = [
      { field: 'num_doc', header: 'Documento' },
      { field: 'titulo_mov', header: 'Movimiento' },
      { field: 'comentario', header: 'Comentario' },
      { field: 'condicion_recibo', header: 'Recibido' },
      { field: 'fecha', header: 'Fecha' },
      { field: 'acciones', header: 'Acciones' },
    ] 

    this.cols2 = [
      { field: 'imagen', header: 'Imagen' },
      { field: 'codigo', header: 'Código' },
      { field: 'marca', header: 'Marca' },
      { field: 'almacen', header: 'Almacen' },
      { field: 'precio_venta', header: 'Precio' },
      { field: 'solicitado', header: 'Cantidad'},
      { field: 'solicitado_esp', header: 'Cantidad_ESP'},
    ]    
   
    this.transaccionesServ.transaccionGuardado.subscribe((resp: any) => {
      this.todasLastransacciones();
    })   

    this.transaccionesServ.transaccionBorrada.subscribe((resp: any) => {
      this.todasLastransacciones();
    }) 

    this.invProductosServ.productoEscogido.subscribe((resp: any) => {
      this.productos = resp;
      this.productos.forEach(element => {
        this.agregarFormulario(element);
      });
    }) 
  }

  todasLastransacciones() {
    this.loading = true;
    this.transaccionesServ.getDatos().then((resp: any)=>{      
      this.transacciones = resp;
      this.loading = false;
    })
  }

  todosLosMov() {
    this.codMovServ.getDatos().then((resp: any) => {  
      this.movimientos = resp.codigosmov;
    })
  }

  todasLasBodegasConPermisos() {
    this.bodegasServ.bodegasConpermisos(this.usuariosServ.getUserLogged().email).then((resp: any)=>{
      this.bodegasPermisos = resp;   
      console.log(this.usuariosServ.getUserLogged().email);
      console.log(resp);
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
      const ref = this.dialogService.open(StepTransaccionesComponent, {
        data,
        closeOnEscape: false,
        header: 'Datos Necesarios Transacciones de Inventarios',
        width: '70%'
      });
    }
  }

  crearFormulario() {
    this.forma = this.fb.group({
      id_tipomov:        [''],
      conduce_no:        ['234234'],
      id_bodega:         ['', Validators.required],
      id_bodega_d:       [''],
      orden_pedido:      [''],
      factura:           [''],
      id_num_oc:         [''],
      cliente:           [''],
      sec_cliente:       [''],
      tipo_cliente:      [''],      
      email:             [''],      
      departamento:      ['', Validators.required],
      proveedor:         [''],
      cod_sp:            [''],
      cod_sp_sec:        [''],      
      fecha:             ['', Validators.required],
      direccion:         ['aasdfadsfasdf'],
      num_rnc:           [''],
      id_numemp:         [''],
      cod_transportista: ['', Validators.required],      
      cod_tarifa:        ['', Validators.required],
      placa:             ['', Validators.required],
      num_doc_entrada:   [''],
      comentario:        ['kjkljlkjlkj'],
      estado:            ['activo'],      
      condicion_recibo:  ['si'],
      cuenta_no:         [''],
      productos:         this.fb.array([]),
      usuario_creador:   [this.usuario.username]
    })
  }

  agregarFormulario(producto) {
    let cantidad1 = 1;
    let cantidad =1;
    let margen = 1;
    (<FormArray>this.forma.get('productos')).push(this.agregarFormularioTransacciones(producto,cantidad1,cantidad,margen));    
  }
  
  agregarFormularioTransacciones(producto,cantidad1,cantidad,margen): FormGroup {
    return this.fb.group({
      codigo:       [producto.codigo, Validators.required],
      cantidad1:    [cantidad1, Validators.required],
      cantidad:     [cantidad, Validators.required],
      margen:       [margen, Validators.required],
      precio_venta: [producto.precio_venta, Validators.required],
      costo:        [producto.costo, Validators.required],
    });
  }

  guardarTransaccion() {  
    console.log(this.forma.value)
    if (this.movimientos !== null) {
      if (this.ordenPedidoExiste === 2 || this.facturaExiste === 2) {
        this.uiMessage.getMiniInfortiveMsg('tst','error','Atención','La orden de pedido ó factura no existe'); 
        return;
      }

      if (this.productos.length === 0) {
        this.uiMessage.getMiniInfortiveMsg('tst','error','Atención','No hay productos agregados en esta transaccion');
        return;
      } 

      if (this.movimientos[0].control_clientes === "si") {
        this.controlClientes();     
      } 
  
      if (this.movimientos[0].control_despachos === "si") {       
        this.controlDespacho();
        if (this.cantidadExcede) {
          this.uiMessage.getMiniInfortiveMsg('tst','error','Atención','La cantidad especificada es mayor a la de la orden/factura');
        }
      } 
      
      if (this.movimientos[0].control_devoluciones === "si") {       
        this.controlDevoluciones();
      } 
  
      if (this.movimientos[0].control_transferencia === "si") {       
        this.controlTransferencia();
      } 
  
      if (this.movimientos[0].control_departamento === "si") {       
        this.controlDepartamento();
      }    

      if (this.movimientos[0].control_orden_compra === "si") {       
        this.controlOrdenCompra();
      }         
      
      this.transaccionesServ.crearTransaccion(this.forma.value).then((resp: any) => {
        this.uiMessage.getMiniInfortiveMsg('tst','success','Atención','Datos guardados correctamente');
        console.log(resp)     
        this.imprimirTransaccion(resp.num_doc);
      })
    } else {
      this.uiMessage.getMiniInfortiveMsg('tst','error','Atención','Debe escoger un tipo de movimiento');
    }
  }

  imprimirTransaccion(num_doc) { 
    const link = this.document.createElement('a');
    link.target = '_blank';
    link.href = `${URL}/reporte/invtransacciones-visualizar/${num_doc}/${this.usuario.id}`;
    link.click();
    link.remove();
  }  
  
  actualizarTransaccion() {

  }

  imprimirTransaccionExcel(id) {

  }
  
  verTransaccion(transaccion) {

  }

  borrarTransaccion(id) {
    this.confirmationService.confirm({
      message:"Esta seguro de borrar este registro?",
      accept:() =>{
        this.transaccionesServ.borrarTransaccion(id).then((resp: any)=>{
          this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente',resp.msj);  
        })      
      }
    })  
  }
  

  verificaOrdenCompra(data) {        
    if (this.forma.get('id_tipomov').value !== "") {
      if (data === "") {
        this.ocExiste = 3;
        return;
      }
      this.ocExiste = 0;
      this.ordenCompraServ.buscaOrdenCompra(data).then((resp: any)=>{
        if(resp.length !== 0){          
          this.productos = resp[0].productos;     
          this.productos.forEach(element => {
            this.agregarFormulario(element);
          });
          this.ocExiste = 1;          
          this.forma.controls['proveedor'].setValue(resp[0].nom_sp);
          this.forma.controls['email'].setValue(resp[0].email);
          this.forma.controls['num_rnc'].setValue(resp[0].rnc);
          this.forma.controls['cod_sp'].setValue(resp[0].cod_sp);
          this.forma.controls['cod_sp_sec'].setValue(resp[0].cod_sp_sec);  

          // this.forma.controls['proveedor'].disable();
          // this.forma.controls['email'].disable();
          // this.forma.controls['num_rnc'].disable();
        }else{
          this.ocExiste = 2;
          return;
        }
      })
    }else{
      this.forma.controls['id_num_oc'].reset();
      this.uiMessage.getMiniInfortiveMsg('tst','error','Atención','Debe especificar un tipo de movimiento');
      return;
    }
  }

  verificaOrdenPedido(data) {
    if (this.forma.get('id_tipomov').value !== "") {
      if (data === "") {
        this.ordenPedidoExiste = 3;
        return;
      }
      this.ordenPedidoExiste = 0;
      this.ordenPedido.buscaOrdenPedido(data).then((resp: any)=>{
        if(resp.length !== 0){
          this.productos = resp[0].productos;        
          this.productos.forEach(element => {
            this.agregarFormulario(element);
          });
          this.ordenPedidoExiste = 1;
          this.forma.get('cliente').setValue(this.clientes.find(tipo => tipo.tipo_cliente === resp[0].tipo_cliente && tipo.sec_cliente === resp[0].sec_cliente));
          this.forma.get('id_numemp').setValue(this.vendedores.find(vendedor => vendedor.id_numemp === resp[0].sec_vend));
          this.forma.get('tipo_cliente').setValue(resp[0].tipo_cliente);
          this.forma.get('fecha').setValue(new Date(resp[0].created_at));
          this.forma.get('sec_cliente').setValue(resp[0].sec_cliente);
          this.forma.get('email').setValue(resp[0].email);
          this.forma.get('num_rnc').setValue(resp[0].num_rnc);
          console.log(this.forma.value)
          // this.forma.controls['cliente'].disable();
          // this.forma.controls['email'].disable();
          // this.forma.controls['num_rnc'].disable();
        }else{
          //this.uiMessage.getMiniInfortiveMsg('tst','Esta orden no existe','error');
          this.ordenPedidoExiste = 2;
          this.forma.get('cliente').reset();
          this.forma.get('tipo_cliente').reset();
          this.forma.get('sec_cliente').reset();
          this.forma.get('email').reset();
          this.forma.get('num_rnc').reset();
          this.productos = [];
          // this.forma.get('productos').reset()
          console.log(this.forma.value)
          return;
        }
      })
    }else{
      this.forma.controls['orden_pedido'].reset();
      this.uiMessage.getMiniInfortiveMsg('tst','error','Atención','Debe especificar un tipo de movimiento');
      return;
    }
  }

  verificaFactura(data) {
    if (this.forma.get('id_tipomov').value !== "") {
      if (data === "") {
        this.facturaExiste = 3;
        return;
      }
      this.facturaExiste = 0;
      this.facturasServ.buscaFactura(data).then((resp: any)=>{           
        if(resp.length !== 0){
          this.productos = resp[0].productos;  
          this.productos.forEach(element => {
            this.agregarFormulario(element);
          });
          this.facturaExiste = 1;
          this.forma.controls['cliente'].setValue(resp[0].nombre_cli);
          this.forma.controls['tipo_cliente'].setValue(resp[0].tipo_cliente);
          this.forma.controls['sec_cliente'].setValue(resp[0].sec_cliente);
          this.forma.controls['email'].setValue(resp[0].email);
          this.forma.controls['num_rnc'].setValue(resp[0].num_rnc);
          
          // this.forma.controls['cliente'].disable();
          // this.forma.controls['email'].disable();
          // this.forma.controls['num_rnc'].disable();

        }else{
          this.facturaExiste = 2;
          this.forma.controls['cliente'].reset();
          this.forma.controls['tipo_cliente'].reset();
          this.forma.controls['sec_cliente'].reset();
          this.forma.controls['email'].reset();
          this.forma.controls['num_rnc'].reset();
          this.productos = [];
          this.forma.get('productos').reset()
          console.log(this.forma.value)
          return;
        }
      })
    }else{
      this.forma.controls['factura'].reset();
      this.uiMessage.getMiniInfortiveMsg('tst','error','Atención','Debe especificar un tipo de movimiento');
      return;
    }
  }

  verificaFechaOrden(fecha) {
  }

  verMovimiento(mov) {    
    console.log(mov)
    this.productos = [];
    this.cfactura = false;
    this.cCliente = false;
    this.cPedido = false;
    this.cDestino = false;
    this.cDepartamento = false;
    this.cOrdenCompra = false;
    this.cProveedor = false;
    this.ordenPedidoExiste = 3;
    this.facturaExiste = 3;
    this.ocExiste = 3;
    // this.forma.get('cuenta_no').setValue(mov.cuenta_no)
    this.forma.controls['cliente'].reset();
    this.forma.controls['email'].reset();
    this.forma.controls['num_rnc'].reset();
    this.forma.controls['tipo_cliente'].reset();
    this.forma.controls['sec_cliente'].reset();

    this.forma.controls['cliente'].enable();
    this.forma.controls['email'].enable();
    this.forma.controls['num_rnc'].enable();
    this.forma.controls['cod_sp'].enable();
    this.forma.controls['cod_sp_sec'].enable();
    this.forma.controls['condicion_recibo'].setValue('si');
    
    let control = [
      { control: 'control_clientes', value: mov.value.control_clientes },
      { control: 'control_departamento', value: mov.value.control_departamento },
      { control: 'control_despachos', value: mov.value.control_despachos },
      { control: 'control_devoluciones', value: mov.value.control_devoluciones },
      { control: 'control_orden_compra', value: mov.value.control_orden_compra },
      { control: 'control_transferencia', value: mov.value.control_transferencia },
    ]
    
    control.forEach(element => {
    if (element.value === 'si') {
      switch (element.control) {
        case 'control_despachos':
          this.forma.controls['orden_pedido'].enable();
          this.forma.controls['factura'].disable();
          this.forma.controls['factura'].reset();
          this.forma.controls['id_num_oc'].disable();
          this.forma.controls['id_num_oc'].reset(); 
        break;

        case 'control_devoluciones':
          this.forma.controls['factura'].enable();
          this.forma.controls['orden_pedido'].disable();
          this.forma.controls['orden_pedido'].reset();
          this.forma.controls['id_num_oc'].disable();
          this.forma.controls['id_num_oc'].reset();
        break;

        case 'control_orden_compra':
          this.forma.controls['id_num_oc'].enable();
          this.forma.controls['factura'].disable();
          this.forma.controls['factura'].reset();
          this.forma.controls['orden_pedido'].disable();
          this.forma.controls['orden_pedido'].reset();
        break;

        case 'control_transferencia':
          if (mov.value.origen === 'credito') {
            this.forma.controls['condicion_recibo'].setValue('no')
          }
          this.forma.controls['orden_pedido'].enable();
          this.forma.controls['id_bodega_d'].enable();
          this.forma.controls['factura'].disable();
          this.forma.controls['factura'].reset();
          this.forma.controls['id_num_oc'].disable();
          this.forma.controls['id_num_oc'].reset();
        break;

        default:
          this.forma.controls['id_bodega_d'].disable();
          this.forma.controls['id_bodega_d'].reset();
          this.forma.controls['orden_pedido'].enable();
          this.forma.controls['id_num_oc'].enable();
          this.forma.controls['factura'].disable();
        break;
      }          
    }
    });   
  }

  controlClientes() {
    this.cfactura = false;
    this.cPedido = false;
    this.cCliente = false;
    this.cOrdenCompra = false;
    this.cProveedor = false;

    if (this.forma.get('factura').value  === '' && this.forma.get('orden_pedido').value === '') {
      this.uiMessage.getMiniInfortiveMsg('tst','error','Atención','Debe indicar una factura ó una orden de pedido');
      this.cfactura = true;
      this.cPedido = true;
      return;
    }

    if (this.forma.get('cliente').value === '') {
      this.uiMessage.getMiniInfortiveMsg('tst','error','Atención','La factura debe especificar el cliente');
      this.cCliente = true;
      return;
    }
  }

  controlDespacho() {
    this.cfactura = false;
    this.cPedido = false;
    this.cCliente = false;
    this.cOrdenCompra = false;
    this.cProveedor = false;

    if (this.forma.get('factura').value  === '' && this.forma.get('orden_pedido').value === '') {
      this.uiMessage.getMiniInfortiveMsg('tst','error','Atención','Debes completar los campos indicados');
      this.cfactura = true;
      return;
    }

    if (this.forma.get('cliente').value === '') {
      this.uiMessage.getMiniInfortiveMsg('tst','error','Atención','Debes completar los campos indicados');
      this.cCliente = true;
      return;
    }
  }

  controlOrdenCompra() {
    this.cfactura = false;
    this.cPedido = false;
    this.cCliente = false;
    this.cProveedor = false;

    if (this.forma.get('id_num_oc').value  === '') {
      this.uiMessage.getMiniInfortiveMsg('tst','error','Atención','Debe especificar un tipo de movimiento');
      this.cOrdenCompra = true;
      return;
    }

    if (this.forma.get('proveedor').value === '') {
      this.uiMessage.getMiniInfortiveMsg('tst','error','Atención','Debes completar los campos indicados');
      this.cProveedor = true;
      return;
    }    
  }

  controlDevoluciones() {
    this.cfactura = false;
    if (this.forma.get('factura').value  === '' && this.forma.get('orden_pedido').value === '') {
      this.cfactura = true;
      this.uiMessage.getMiniInfortiveMsg('tst','error','Atención','Debe especificar un tipo de movimiento');
      return;
    }
  }

  controlTransferencia() {
    this.cDestino = false;
    if (this.forma.get('id_bodega_d').value === '') {
      this.cDestino = true;
      this.uiMessage.getMiniInfortiveMsg('tst','error','Atención','Debes completar los campos indicados');
      return;
    }
  }

  controlDepartamento() {
    this.cDepartamento = false;
    if (this.forma.get('departamento').value === '') {
      this.cDepartamento = true;
      this.uiMessage.getMiniInfortiveMsg('tst','error','Atención','Debes completar los campos indicados');
      return;
    }
  }

  pendientesEntrada() : void {    
    this.transaccionesServ.transaccionesPendientes(this.usuario.email).then((resp: any) => {    
      if (resp.length !== 0) {
        const ref = this.dialogService.open(PendientesEntradaComponent, {
          data: { lista: resp },
          header: `Listado de direcciones`,
          width: '80%'
        });        
      }
    })
  }
  
  setDataCliente(cliente) {    
    this.forma.get('tipo_cliente').setValue(cliente.tipo_cliente);
    this.forma.get('sec_cliente').setValue(cliente.sec_cliente);
  }

  // FUNCIONES PARA EL MANEJO DE LOS ERRORES EN LOS CAMPOS DEL FORMULARIO
  getNoValido(input: string) {
    return this.forma.get(input).invalid && this.forma.get(input).touched;
  }

  busqueda() {
    let param = {};
    let valor = this.formBusqueda.value
    for (const prop in valor) {      
      if (valor[prop].length !== 0) {
        param[prop] = valor[prop]
      }
    }
  }

  filtrarDepto(event) {
    const filtered: any[] = [];
    const query = event.query;
    for (let i = 0; i < this.departamentos.length; i++) {
      const size = this.departamentos[i];
      
      if (size.titulo.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(size);
      }
    }
    this.DeptosFiltrados = filtered;
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

  datosVendedor(event) {        
    console.log(event)
  }

  filtrarCliente(event) {
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

  buscaProductos() {
    const ref = this.dialogService.open(ListaProductosComponent, {
      header: 'Catalogo de Productos',
      width: '50%'
    });
  }

  onSelectDate(event) {
    let d = new Date(Date.parse(event));
    this.forma.get("fecha").setValue(`${d.getFullYear()}/${d.getMonth()+1}/${d.getDate()}`);
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

  SetDatosProveedor(event) {
    this.forma.get('cod_sp').setValue(event.cod_sp)
    this.forma.get('cod_sp_sec').setValue(event.cod_sp_sec)
  }

  datosTrasportista(event) {
    
  }
}
