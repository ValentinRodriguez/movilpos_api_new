import { DOCUMENT } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { ListaProductosComponent } from 'src/app/components/lista-productos/lista-productos.component';
import { CodMovService } from 'src/app/services/inventario/cod-mov.service';
import { OrdenescomprasService } from 'src/app/services/compras/ordenescompras.service';
import { DatosEstaticosService } from 'src/app/services/globales/datos-estaticos.service';
import { DgiiService } from 'src/app/services/globales/dgii.service';
import { FacturasService } from 'src/app/services/ventas/facturas.service';
import { BodegasService } from 'src/app/services/inventario/bodegas.service';
import { InventarioService } from 'src/app/services/inventario/inventario.service';
import { TransaccionesService } from 'src/app/services/inventario/transacciones.service';
import { TransportistasService } from 'src/app/services/inventario/transportistas.service';
import { UsuarioService } from 'src/app/services/panel-control/usuario.service';
import { ProveedoresService } from 'src/app/services/compras/proveedores.service';
import { UiMessagesService } from 'src/app/services/globales/ui-messages.service';
import { ClientesService } from 'src/app/services/ventas/clientes.service';
import { OrdenPedidosService } from 'src/app/services/ventas/orden-pedidos.service';
import { environment } from 'src/environments/environment';

const URL = environment.url;

@Component({
  selector: 'app-formulario-inv-transacciones',
  templateUrl: './formulario-inv-transacciones.component.html',
  styleUrls: ['./formulario-inv-transacciones.component.scss'],
  providers:[UsuarioService,ClientesService,TransportistasService,ProveedoresService,
            CodMovService,InventarioService,OrdenPedidosService,FacturasService,OrdenescomprasService,
            TransaccionesService,CodMovService,BodegasService]
})
export class FormularioInvTransaccionesComponent implements OnInit {

  forma: FormGroup;
  usuario: any;
  movimientos:any[] = [];
  ordenPedidoExiste = 3;
  facturaExiste = 3;
  transaccionExiste = 3;
  productos = [];
  ocExiste = 3;
  cfactura = false;
  cCliente = false;
  cPedido = false;
  cDestino = false;
  cDepartamento = false;
  cOrdenCompra = false;
  cProveedor = false;
  guardando = false;
  cantidadExcede = false;
  bodegasPermisos:any[] = [];
  productosTransacciones:any[] = [];
  bodegas = [];  
  codMov = [];
  clientes = [];
  vendedores = [];
  proveedores: any[] = [];
  departamentos: any[] = [];
  transportistas: any;
  deptosSeleccionados: any[] =[];
  DeptosFiltrados: any[];
  clientesFiltrados: any[];
  ProveedoresFiltrados: any[];
  minDate: Date;
  cols2: any[] = [];
  vendedorFiltrado: any[];
  
  listSubscribers: any = [];
  noPermisos = false;
  rncExiste= 3;
  items: MenuItem[] = [];
  tipoNegocios: any[] = [];
  
  constructor(private fb: FormBuilder,
              private usuariosServ: UsuarioService,
              private uiMessage: UiMessagesService,   
              private clienteServ: ClientesService,
              private transportistasServ: TransportistasService,
              private proveedoresServ: ProveedoresService,
              private movimientosServ: CodMovService,              
              private invProductosServ: InventarioService,
              private ordenPedido: OrdenPedidosService,
              private facturasServ: FacturasService,
              private ordenCompraServ: OrdenescomprasService,
              private transaccionesServ: TransaccionesService,
              private codMovServ: CodMovService,              
              private bodegasServ: BodegasService,
              public dialogService: DialogService,
              private dgiiServ: DgiiService,
              private datosEstaticosServ: DatosEstaticosService,
              @Inject(DOCUMENT) private document: Document,
              private cd: ChangeDetectorRef) { 
    this.usuario = this.usuariosServ.getUserLogged();
  }

  listObserver = () => {
    const observer1$ = this.clienteServ.ClienteCreado.subscribe((resp: any) =>{
      this.clientes.push(resp)
    })

    const observer2$ = this.transportistasServ.trasnportistaGuardado.subscribe((resp: any) =>{      
      this.transportistas.push(resp)
    })

    const observer3$ = this.proveedoresServ.proveedoresCreados.subscribe((resp: any) =>{
      this.proveedores.push(resp)
    })

    const observer4$ = this.movimientosServ.tipoMovGuardado.subscribe((resp: any) =>{
      this.movimientos.push(resp)
    })
    
    const observer5$ = this.bodegasServ.bodegaGuardada.subscribe((resp: any) =>{
      this.bodegas.push(resp)
    })    
    
    const observer6$ = this.invProductosServ.productoGuardado.subscribe((resp: any) =>{
      this.productos.push(resp)
    })   

    const observer8$ = this.invProductosServ.productoEscogido.subscribe((resp: any) => {
      this.productos = resp;
      this.productos.forEach(element => {
        this.agregarFormulario(element);
      });
    })

    this.listSubscribers = [observer1$,observer2$,observer3$,observer4$,observer5$,observer6$,observer8$];
  };

  ngOnDestroy(): void {
    this.listSubscribers.forEach(a => a.unsubscribe());
  }

  ngOnInit(): void {
    this.crearFormulario();
    this.autoLlenado();
    this.todasLasBodegasConPermisos();
    this.todosLosMov();
    this.setMinDate();
    this.listObserver();

    this.cols2 = [
      { field: 'imagen', header: 'Imagen' },
      { field: 'codigo', header: 'Código' },
      { field: 'marca', header: 'Marca' },
      { field: 'almacen', header: 'Almacen' },
      { field: 'precio', header: 'Precio' },
      { field: 'cantidad1', header: 'Cantidad'},
      // { field: 'solicitado_esp', header: 'Cantidad_ESP'},
    ]    
  }

  crearFormulario() {
    this.forma = this.fb.group({
      id_tipomov:        ['', Validators.required],
      conduce_no:        [''],
      id_bodega:         [''],
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
      documento:         [''],
      tipo_documento:    [''],
      id:         [''],
      cod_transportista: [''],      
      cod_tarifa:        [''],
      placa:             [''],
      num_doc_entrada:   [''],
      comentario:        [''],
      estado:            ['activo'],      
      condicion_recibo:  ['si'],
      cuenta_no:         [''],
      productos:         this.fb.array([])
    })
  }

  get _productos() {   
    return this.forma.get('productos') as FormArray;
  }

  autoLlenado() {
    this.transaccionesServ.autoLlenado().then((resp: any)  => {
      resp.forEach(element => {
        switch (element.label) {
          case 'clientes':
            this.clientes = element.data;
            break;

          case 'transportista':
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
            break;

          case 'bodegas':
            this.bodegas = element.data;
            break;

          case 'movimientos':
            this.movimientos = element.data;
            break;  

          // case 'tipo_Negocio':
          //   this.tipoNegocios = element.data;
          //   break;  
            
          default:
            break;
        }
      });  
      this.autollenado(resp);  
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
    })
  }

  autollenado(data) {
    data.forEach(element => {            
      if (element.data.length === 0) {
        this.items.push({label: this.datosEstaticosServ.capitalizeFirstLetter(element.label), routerLink: element.label})
      }
    })
  }

  guardarTransaccion() {  
    if (this.forma.invalid) {  
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios');
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
      })      
    }else{ 
      if (this.movimientos !== null) {  
        if (this.ordenPedidoExiste === 2 || this.facturaExiste === 2) {
          this.uiMessage.getMiniInfortiveMsg('tst','error','Atención','La orden de pedido ó factura no existe'); 
          return;
        }
  
        if (this.rncExiste === 1) {
          this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','El RNC especificado no es valido.');          
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
          this.uiMessage.getMiniInfortiveMsg('tst','success','Atención','Registro creado de manera correcta');  
          this.resetFormulario();        
          this.imprimirTransaccion(resp.num_doc);
        })
      } else {
        this.uiMessage.getMiniInfortiveMsg('tst','error','Atención','Debe escoger un tipo de movimiento');
      }
    } 
  }

  resetFormulario() {
    this.forma.reset();
    this.forma.get('estado').setValue('activo');
    this.forma.get('condicion_recibo').setValue('si');

    let i = 0;
    while (0 !== this._productos.length) {
      this._productos.removeAt(0);
      i++
    }
    this.productos = [];
    this.cd.detectChanges();
  }

  agregarFormulario(producto) {
    // let cantidad1 = 1;
    // let cantidad =1;
    let margen = 1;  
    this._productos.push(this.agregarFormularioTransacciones(producto,margen));    
  }
  
  agregarFormularioTransacciones(producto,margen): FormGroup {
    return this.fb.group({
      codigo:       [producto.codigo, Validators.required],
      cantidad1:    [producto.cantidad, Validators.required],
      cantidad:     [0, Validators.required],
      margen:       [margen, Validators.required],
      precio:       [producto.precio, Validators.required],
      costo:        [producto.costo, Validators.required],
    });
  }

  verMovimiento(mov) {     
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
    this.forma.controls['documento'].reset();
    this.forma.controls['tipo_cliente'].reset();
    this.forma.controls['sec_cliente'].reset();

    this.forma.controls['cliente'].enable();
    this.forma.controls['email'].enable();
    this.forma.controls['documento'].enable();
    this.forma.controls['cod_sp'].enable();
    this.forma.controls['cod_sp_sec'].enable();
    this.forma.controls['condicion_recibo'].setValue('si');

    
    // id_bodega.clearValidators();
    

    
    // id_bodega_d.clearValidators();

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
          const id_bodega_d = this.forma.get('id_bodega_d')        
          id_bodega_d.setValidators(Validators.required);
          // id_bodega_d.updateValueAndValidity

          this.forma.controls['id_num_oc'].enable();
          this.forma.controls['factura'].disable();
          this.forma.controls['factura'].reset();
          this.forma.controls['orden_pedido'].disable();
          this.forma.controls['orden_pedido'].reset();
        break;

        case 'control_transferencia':
          // const id_bodega = this.forma.get('id_bodega') 
          // const id_bodega_d = this.forma.get('id_bodega_d') 
          // id_bodega.setValidators(Validators.required);
          // id_bodega.updateValueAndValidity

          // id_bodega_d.setValidators(Validators.required);
          // id_bodega_d.updateValueAndValidity

          if (mov.value.origen === 'credito') {
            this.forma.controls['condicion_recibo'].setValue('no')
          }
          if (this.bodegasPermisos.length === 0) {
            this.noPermisos = true;
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
          this.forma.get('id').setValue(this.vendedores.find(vendedor => vendedor.id === resp[0].sec_vend));
          this.forma.get('tipo_cliente').setValue(resp[0].tipo_cliente);
          this.forma.get('fecha').setValue(new Date(resp[0].created_at));
          this.forma.get('sec_cliente').setValue(resp[0].sec_cliente);
          this.forma.get('email').setValue(resp[0].email);
          this.forma.get('documento').setValue(resp[0].documento);
           
          // this.forma.controls['cliente'].disable();
          // this.forma.controls['email'].disable();
          // this.forma.controls['documento'].disable();
        }else{
          //this.uiMessage.getMiniInfortiveMsg('tst','Esta orden no existe','error');
          this.ordenPedidoExiste = 2;
          this.forma.get('cliente').reset();
          this.forma.get('tipo_cliente').reset();
          this.forma.get('sec_cliente').reset();
          this.forma.get('email').reset();
          this.forma.get('documento').reset();
          this.productos = [];
          // this.forma.get('productos').reset()
           
          return;
        }
      })
    }else{
      this.forma.controls['orden_pedido'].reset();
      this.uiMessage.getMiniInfortiveMsg('tst','error','Atención','Debe especificar un tipo de movimiento');
      return;
    }
  }
  
  verificaOrdenCompra(data) {        
    if (this.forma.get('id_tipomov').value !== "") {
      if (data === "") {
        this.ocExiste = 3;
        return;
      }
      this.ocExiste = 0;
      this.ordenCompraServ.buscaOrdenCompra(data).then((resp: any)=>{
        
        
        const proveedor = resp[0].proveedor;
        if(resp.length !== 0){          
          this.productos = resp[0].productos;     
          this.productos.forEach(element => {
            this.agregarFormulario(element);
          });
          this.ocExiste = 1;          
          this.forma.controls['proveedor'].setValue(this.proveedores.find(proveedor => proveedor.cod_sp === resp[0].cod_sp && 
                                                                                       proveedor.cod_sp_sec === resp[0].cod_sp_sec))
          this.forma.controls['email'].setValue(resp[0].email);
          this.forma.controls['documento'].setValue(resp[0].documento);
          this.forma.controls['fecha'].setValue(new Date(resp[0].created_at));
          this.forma.controls['cod_sp'].setValue(resp[0].cod_sp);
          this.forma.controls['cod_sp_sec'].setValue(resp[0].cod_sp_sec);  
          this.forma.controls['tipo_documento'].setValue(resp[0].proveedor.tipo_doc); 
          
          // this.forma.controls['proveedor'].disable();
          // this.forma.controls['email'].disable();
          // this.forma.controls['documento'].disable();
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
          this.forma.controls['documento'].setValue(resp[0].documento);
          
          // this.forma.controls['cliente'].disable();
          // this.forma.controls['email'].disable();
          // this.forma.controls['documento'].disable();

        }else{
          this.facturaExiste = 2;
          this.forma.controls['cliente'].reset();
          this.forma.controls['tipo_cliente'].reset();
          this.forma.controls['sec_cliente'].reset();
          this.forma.controls['email'].reset();
          this.forma.controls['documento'].reset();
          this.productos = [];
          this.forma.get('productos').reset()
           
          return;
        }
      })
    }else{
      this.forma.controls['factura'].reset();
      this.uiMessage.getMiniInfortiveMsg('tst','error','Atención','Debe especificar un tipo de movimiento');
      return;
    }
  }

  verificaRNC(data){  
    if (data === "") {
      this.rncExiste = 3;
      return;
    }
    this.rncExiste = 0;
    this.dgiiServ.busquedaRNC(data).then((resp: any)=>{
      if(resp.length === 0) {
        this.rncExiste = 1;
      }else{
        this.rncExiste = 2;
        // this.forma.get('nombre').setValue(resp[0].nombre_empresa);
        // this.forma.get('telefono_empresa').setValue(resp[0].telefono);
      }
    })
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
     
  }

  concederPermisos() {
    this.noPermisos = false;
    // this.dialogService.open(BodegasPermisosComponent, {
    //   data: {
    //     bodega: id
    //   },
    //   header: 'Gestión de permisos a bodegas',
    //   width: '50%'
    // });
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
     this.dialogService.open(ListaProductosComponent, {
      header: 'Catalogo de Productos',
      width: '50%'
    });
  }

  imprimirTransaccion(num_doc) { 
    const link = this.document.createElement('a');
    link.target = '_blank';
    link.href = `${URL}/reporte/invtransacciones-visualizar/${num_doc}/${this.usuario.id}`;
    link.click();
    link.remove();
  }  

  setDataCliente(cliente) {    
    this.forma.get('tipo_cliente').setValue(cliente.tipo_cliente);
    this.forma.get('sec_cliente').setValue(cliente.sec_cliente);
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

  // FUNCIONES PARA EL MANEJO DE LOS ERRORES EN LOS CAMPOS DEL FORMULARIO
  getNoValido(input: string) {
    return this.forma.get(input).invalid && this.forma.get(input).touched;
  }

}
