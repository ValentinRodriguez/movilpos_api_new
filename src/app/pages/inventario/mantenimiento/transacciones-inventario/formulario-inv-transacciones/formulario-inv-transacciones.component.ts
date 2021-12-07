import { DOCUMENT } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { ListaProductosComponent } from 'src/app/components/lista-productos/lista-productos.component';
import { CodMovService } from 'src/app/services/inventario/cod-mov.service';
import { OrdenescomprasService } from 'src/app/services/compras/ordenescompras.service';
import { DgiiService } from 'src/app/services/globales/dgii.service';
import { FacturasService } from 'src/app/services/ventas/facturas.service';
import { InventarioService } from 'src/app/services/inventario/inventario.service';
import { TransaccionesService } from 'src/app/services/inventario/transacciones.service';
import { TransportistasService } from 'src/app/services/inventario/transportistas.service';
import { ProveedoresService } from 'src/app/services/compras/proveedores.service';
import { UiMessagesService } from 'src/app/services/globales/ui-messages.service';
import { environment } from 'src/environments/environment';
import { UsuarioService } from '../../../../../services/panel-control/usuario.service';

const URL = environment.url;

@Component({
  selector: 'app-formulario-inv-transacciones',
  templateUrl: './formulario-inv-transacciones.component.html',
  styleUrls: ['./formulario-inv-transacciones.component.scss']
})
export class FormularioInvTransaccionesComponent implements OnInit {

  forma: FormGroup;
  usuario: any;
  movimientos:any[] = [];
  facturaExiste = 3;
  transaccionExiste = 3;
  productos = [];
  ocExiste = 3;
  cfactura = false;
  cOrdenCompra = false;
  cProveedor = false;
  guardando = false;
  cantidadExcede = false;
  productosTransacciones:any[] = [];
  codMov = [];
  vendedores = [];
  proveedores: any[] = [];
  departamentos: any[] = [];
  transportistas: any;
  ProveedoresFiltrados: any[];
  minDate: Date;
  cols2: any[] = [];
  vendedorFiltrado: any[];  
  listSubscribers: any = [];
  noPermisos = false;
  rncExiste= 3;
  items: MenuItem[] = [];
  
  constructor(private fb: FormBuilder,              
              private uiMessage: UiMessagesService,  
              private transportistasServ: TransportistasService,
              private proveedoresServ: ProveedoresService,           
              private invProductosServ: InventarioService,
              private usuariosServ: UsuarioService,
              private ordenCompraServ: OrdenescomprasService,
              private transaccionesServ: TransaccionesService,
              private codMovServ: CodMovService,      
              public dialogService: DialogService,
              @Inject(DOCUMENT) private document: Document,
              private cd: ChangeDetectorRef) { }

  listObserver = () => {  

    const observer8$ = this.invProductosServ.productoEscogido.subscribe((resp: any) => {
      this.productos = resp;
      this.productos.forEach(element => {
        this.agregarFormulario(element);
      });
    })
    this.listSubscribers = [observer8$];
  };

  ngOnDestroy(): void {
    this.listSubscribers.forEach(a => a.unsubscribe());
  }

  ngOnInit(): void {
    this.crearFormulario();
    this.todosLosMov();
    this.todosLosProveedores();
    this.todosLosVendedores();
    this.todosLosTransportistas();
    this.setMinDate();
    this.listObserver();

    this.cols2 = [
      { field: 'imagen', header: 'Imagen' },
      { field: 'codigo', header: 'Código' },
      { field: 'marca', header: 'Marca' },
      { field: 'almacen', header: 'Almacen' },
      { field: 'precio', header: 'Precio' },
      { field: 'cantidad1', header: 'Cantidad'},
    ]    
  }

  crearFormulario() {
    this.forma = this.fb.group({
      id_tipomov:        ['', Validators.required],    
      factura:           [''],
      id_num_oc:         [''],  
      vendedor:          [''],  
      proveedor:         [''],     
      fecha:             ['', Validators.required],
      direccion:         ['aasdfadsfasdf'],
      tipo_documento:    [''],
      cod_transportista: [''],      
      tarifa:            [''],
      placa:             [''],
      comentario:        [''],
      estado:            ['activo'],  
      cuenta_no:         [''],
      productos:         this.fb.array([])
    })
  }

  get _productos() {   
    return this.forma.get('productos') as FormArray;
  }

  todosLosMov() {
    this.codMovServ.getDatos().subscribe((resp: any) => {  
      if (resp.ok) {
        this.movimientos = resp.data;        
      }
    })
  }

  todosLosTransportistas() {
    this.transportistasServ.getDatos().subscribe((resp: any) => {  
      if (resp.ok) {
        this.transportistas = resp.data;        
      }
    })
  }

  todosLosProveedores() {
    this.proveedoresServ.getDatos().subscribe((resp: any) => {  
      if (resp.ok) {
        this.proveedores = resp.data;        
      }
    })
  }

  todosLosVendedores() {
    this.usuariosServ.getUsers().subscribe((resp: any) => {  
      console.log(resp);
      
      if (resp.ok) {
        this.vendedores = resp.data;        
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
  
        if (this.rncExiste === 1) {
          this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','El RNC especificado no es valido.');          
          return; 
        }
  
        if (this.productos.length === 0) {
          this.uiMessage.getMiniInfortiveMsg('tst','error','Atención','No hay productos agregados en esta transaccion');
          return;
        } 
          
        if (this.movimientos[0].control_devoluciones === "si") {       
          this.controlDevoluciones();
        } 
      
        if (this.movimientos[0].control_orden_compra === "si") {       
          this.controlOrdenCompra();
        }         
        
        this.transaccionesServ.crearTransaccion(this.forma.value).subscribe((resp: any) => {
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
    let i = 0;
    while (0 !== this._productos.length) {
      this._productos.removeAt(0);
      i++
    }
    this.productos = [];
    this.cd.detectChanges();
  }

  agregarFormulario(producto) {
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
    this.cOrdenCompra = false;
    this.cProveedor = false;
    this.facturaExiste = 3;
    this.ocExiste = 3;

    let control = [
      { control: 'control_devoluciones', value: mov.value.control_devoluciones },
      { control: 'control_orden_compra', value: mov.value.control_orden_compra },
    ]
    
    control.forEach(element => {

    if (element.value === 'si') {
      switch (element.control) {
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
          this.forma.controls['id_num_oc'].enable();
          this.forma.controls['factura'].disable();
          this.forma.controls['factura'].reset();
          this.forma.controls['orden_pedido'].disable();
          this.forma.controls['orden_pedido'].reset();
        break;

        default:
          this.forma.controls['id_num_oc'].enable();
          this.forma.controls['factura'].disable();
        break;
      }          
    }
    });   
  }

  controlOrdenCompra() {
    this.cfactura = false;
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
          this.forma.controls['fecha'].setValue(new Date(resp[0].created_at));
          this.forma.controls['proveedor'].setValue(resp[0].proveedor); 
          this.forma.controls['tipo_documento'].setValue(resp[0].proveedor.tipo_doc); 
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
      
      if (size.nombre.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(size);
      }
    }
    this.vendedorFiltrado = filtered;
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

  // FUNCIONES PARA EL MANEJO DE LOS ERRORES EN LOS CAMPOS DEL FORMULARIO
  getNoValido(input: string) {
    return this.forma.get(input).invalid && this.forma.get(input).touched;
  }

}
