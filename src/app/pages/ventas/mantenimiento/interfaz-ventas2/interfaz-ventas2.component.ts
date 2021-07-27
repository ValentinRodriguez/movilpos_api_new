import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PrimeNGConfig } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { OverlayPanel } from 'primeng/overlaypanel';
import { VirtualScroller } from 'primeng/virtualscroller';
import { Subscription } from 'rxjs';
import { BreadcrumbService } from 'src/app/app.breadcrumb.service';
import { AppMainComponent } from 'src/app/app.main.component';
import { DatosEstaticosService } from 'src/app/services/globales/datos-estaticos.service';
import { UiMessagesService } from 'src/app/services/globales/ui-messages.service';
import { CategoriasService } from 'src/app/services/inventario/categorias.service';
import { InventarioService } from 'src/app/services/inventario/inventario.service';
import { UsuarioService } from 'src/app/services/panel-control/usuario.service';
import { ClientesService } from 'src/app/services/ventas/clientes.service';
import { FacturasService } from 'src/app/services/ventas/facturas.service';
import { FormularioTablaAmortizacionesComponent } from '../tabla-amortizaciones/formulario-tabla-amortizaciones/formulario-tabla-amortizaciones.component';

@Component({
  selector: 'app-interfaz-ventas2',
  templateUrl: './interfaz-ventas2.component.html',
  styleUrls: ['./interfaz-ventas2.component.scss']
})
    
    
export class InterfazVentas2Component implements OnInit {

    forma: FormGroup;
    subscription: Subscription;    
    @ViewChild('op') overlay: OverlayPanel;
    @ViewChild('dv') dv: DataView;
    @ViewChild('input') input: ElementRef;
    @ViewChild('general') elementView: ElementRef;
    @ViewChild('vs') vs: VirtualScroller;
  
    
    usuario: any;
    
    productos: any[] = [];
    productosSeleccionados: any[] = [];
    clientes: any[] = [];
    clientesSeleccionados: any[] = [];
    total_bruto = 0
    sub_total = 0
    descuento = 0
    monto_itbis = 0
    neto = 0
    display = false;
    devueltaMenor = false;
    cols: { field: string; header: string; }[];
    categorias: any[] = [];
    fecha: string;
    modo = 'pos';
    cols3: { field: string; header: string; }[];
    financiando = false;
    objetos = 12;
    contentHeight: number;
    detailHeigth: string;
    innerWidth: number;
    innerHeight: number;
    metodo: any;
    selectedProducts2: any[] = [];
    productoFIltrado: any;
    
    guardando: boolean;

    constructor(private fb: FormBuilder,
                public breadcrumbService: BreadcrumbService, 
                public app: AppMainComponent,
                public usuarioServ: UsuarioService,
                private datosEstaticosServ: DatosEstaticosService,
                private inventarioServ: InventarioService,
                public facturaServ: FacturasService,             
                private categoriasServ: CategoriasService,
                private uiMessage: UiMessagesService,
                private clienteServ: ClientesService,
                private dialogService: DialogService,
                private primengConfig: PrimeNGConfig,
                private cd: ChangeDetectorRef) {

                this.usuario = this.usuarioServ.getUserLogged();                 
                this.fecha = this.datosEstaticosServ.getDate();
                this.crearFormulario();
    }
    ngAfterViewInit() {
        this.contentHeight = this.elementView.nativeElement.offsetHeight ;
        this.innerHeight = window.innerHeight;        
        this.onResize();
        this.cd.detectChanges(); 
    }

    ngOnInit(): void {        
        this.primengConfig.ripple = true;
        
        this.metodo = {
            efectivo: true,
            tarjeta: false,
            cheque: false,
            ambos: false    
        }
        this.todosLosProductos();
        this.todosLasCategorias();
        this.todosLosClientes();  
            
        this.cols = [
            { field: 'titulo', header: 'Producto' },
            { field: 'precio_venta', header: 'Precio' },
            { field: 'codigo', header: 'Código' },
            { field: 'cantidad', header: 'Cantidad' }
        ] 

        this.cols3 = [
            { field: 'titulo', header: 'Producto' },
            { field: 'precio_venta', header: 'Precio' },
            { field: 'codigo', header: 'Código' },
            { field: 'cantidad', header: 'Cantidad' },
            { field: 'acciones', header: 'Acciones' }
        ] 
        
        this.facturaServ.metodo.subscribe((resp: any) => {        
            this.forma.get('efectivo').reset();
            this.forma.get('tarjeta').reset();
            this.forma.get('devuelta').reset();
            this.forma.get('tarjeta_no').reset();
            this.forma.get('cheque').reset();
            this.forma.get('cheque_no').reset();
            this.metodo = resp;         
        });
        
        this.facturaServ.modoVenta.subscribe((resp: any) => {
            this.modo = resp;
        });

        this.facturaServ.guardando.subscribe((resp: any) => {
            this.guardando = resp;
        });

        this.facturaServ.display.subscribe((resp: any) => {
            this.display = resp;
        });

        this.facturaServ.enviaData.subscribe((resp: any) => {
            this.forma.get('financiado').reset;
            this.forma.get('financiado').setValue(resp);
            this.financiando = true;   
        })
    }

    ngOnDestroy() {
      if (this.subscription) {
          this.subscription.unsubscribe();
      }
    }
    
    @HostListener("window:resize", [])
    private onResize() {
      this.innerWidth = window.innerWidth;
      if (this.innerWidth < 1710) {
          this.objetos = 12;    
          this.detailHeigth = (this.innerHeight * 0.45) +'px'
      } else {
          this.objetos = 18
          this.detailHeigth = (this.innerHeight * 0.64 ) +'px'
      }    
    }
    
    tipo(valor) {            
        const efectivo = Number(this.forma.get('efectivo').value)
        const tarjeta = this.forma.get('tarjeta').value
        const cheque = this.forma.get('cheque').value
        console.log(efectivo);
        
        if (valor.efectivo === true && efectivo === 0) {            
            this.uiMessage.getMiniInfortiveMsg('tc', 'warn', '', 'Debe especificar el valor en EFECTIVO.');
            return false;
        }

        if (valor.tarjeta === true && tarjeta === '') {
            this.uiMessage.getMiniInfortiveMsg('tc', 'warn', '', 'Debe especificar el valor en TARJETA.');
            return false; 
        }

        if (valor.cheque === true &&cheque === '') {
            this.uiMessage.getMiniInfortiveMsg('tc', 'warn', '', 'Debe especificar el valor en CHEQUE.');
            return false; 
        }

        if (valor.ambos === true && efectivo === 0 && tarjeta === '') {
            this.uiMessage.getMiniInfortiveMsg('tc', 'warn', '', 'Debe especificar el valor en EFECTIVO y TARJETA.');
            return false; 
        }

        return true;        
    }
    
    todosLosProductos() {
        
        this.inventarioServ.getDatos().then((resp: any) =>{
            this.productos = resp;
        })
    }

    todosLosClientes() {
        this.clienteServ.getDatos().then((resp: any) =>{
            this.clientes = resp;  
        })
    }

    todosLasCategorias() {
        this.categoriasServ.getDatos().then((resp: any) =>{
            this.categorias = resp;    
        })
    }

    crearFormulario() {
        this.forma = this.fb.group({
            fecha_factura:   [this.fecha, Validators.required],
            num_oc:          [1],
            cod_cia:         [1],
            suc_id:          [1],
            efectivo:        [''],
            cheque:          [''],
            cheque_no:       [''],
            tarjeta:         [''],
            tarjeta_no:      [''],
            conduce:         [1],
            nombre_cli:      ['CLIENTE CONTADO'],
            direccion:       [''],
            id_pais:         [''],
            id_ciudad:       [''],
            id_zonalocal:    [''],
            tipo_cliente:    [''],
            sec_cliente:     [''],
            num_emp:         [this.usuario.empleado.id, Validators.required],
            total_bruto:     ['', Validators.required],
            sub_total:       ['', Validators.required],
            descuento:       ['', Validators.required],
            monto_itbis:     ['', Validators.required],
            devuelta:        [''],
            neto:            ['', Validators.required],
            financiado:      [''],
            productos:       this.fb.array([]),
            estado:          ['activo'],
            usuario_creador: [this.usuario.username]
        })
    }
  
    get producto() {   
        return this.forma.get('productos') as FormArray;
    }

    get cliente() {   
        return this.forma.get('nombre_cli').value as FormControl;
    }

    cobrarFactura() {
        
        this.guardando = true;
        if (this.forma.valid) {          
            if (this.tipo(this.metodo)) {
                let devuelta = Math.abs(Number(this.forma.get('devuelta').value));
                this.forma.get('devuelta').setValue(devuelta);  

                // if (devuelta < 0 && !this.metodo.ambos) {
                //     this.devueltaMenor = true;
                //     this.uiMessage.getMiniInfortiveMsg('tc','warn','Error','LA CANTIDAD RECIBIDA ES MENOR AL MONTO TOTAL');
                //     return;
                // } 
                // if (this.metodo.tarjeta || this.metodo.ambos) {
                //     this.forma.get('tarjeta').setValue(devuelta) 
                // }
                // if (this.metodo.cheque) {
                //     this.forma.get('cheque').setValue(devuelta) 
                // }
                this.facturaServ.crearFactura(this.forma.value).then((resp: any) => {              
                    this.uiMessage.getMiniInfortiveMsg('tc','success','Excelente','PRODUCTO FACTURADO');  
                    this.resetFormulario();
                    this.todosLosProductos();

                })
            }
        }else{            
            if (this.forma.value.productos.length === 0) {
                this.uiMessage.getMiniInfortiveMsg('tc','warn','Error','DEBE AGREGAR ARTICULOS A LA FACTURA');
                return;
            }
        }
    }

    financiarFactura() {
        if (this.financiando) {
            this.facturaServ.crearFacturaPrestamo(this.forma.get('financiar').value).then((resp: any) => {
                                
            })
        } else {
            
        }
    }

    cambio(data) {
        if (this.modo === 'codigo' && this.productoFIltrado.length === 1) {
            this.agregarProducto(this.productoFIltrado[0]);
            this.input.nativeElement.value = '';
            return;
        }

        if (data.key === 'Enter') {
            this.agregarProducto(this.productoFIltrado[0]);
            this.input.nativeElement.value = '';
            return;
        }        
    }

    onFilter(event) {
        if (event.filteredValue.length === 1) {
            this.productoFIltrado = event.filteredValue;    
        }
    }

    agregarFormulario(producto) {
        (<FormArray>this.forma.get('productos')).push(this.agregarFormularioTransacciones(producto));    
    }
  
    agregarFormularioTransacciones(producto): FormGroup {
        return this.fb.group({
            area:         [''],
            precio_venta: [producto.precio_venta],
            codigo:       [producto.codigo],
            titulo:       [producto.titulo],
            costo:        [producto.costo],
            valor:        [producto.valor],
            cantidad1:    [1],
            cantidad:     [''], 
            porc_desc:    [producto.porcientodescuento],
            monto_desc:   [''],
            porc_itbis:   [''],
            monto_itbis:  [''],
            estado:       ['estado']
        });
    }

    recalcula(data) {
        if (data === '') {
            return;
        }
        this.calcularTotal(this.producto.value);        
    }

    agregarProducto(producto) {        
        const nuevoArray = this.productosSeleccionados.filter( (data: any) => {   
            return data.id === producto.id;
        });      
      
        if (nuevoArray.length === 0) {
            // this.display = true;
            // this.facturaServ.displayDetalle();
            this.agregarFormulario(producto);

            this.productosSeleccionados.push(producto);
            
            this.calcularTotal(this.producto.value)
            let efectivo = Number(this.forma.get('efectivo').value)
            if (efectivo !== 0) {
                this.calculaDevueltaE(efectivo)               
            }
            // document.getElementById(producto.id).classList.add("agregado")
        }else{
            this.uiMessage.getMiniInfortiveMsg('tc','info','Atención','Este producto ya esta en la factura');             
        }
    }

    eliminarProducto(producto) {
        const nuevoArray = this.productosSeleccionados.filter( (data: any) => {   
            return data.id !== producto.id;
        });             
        this.productosSeleccionados = nuevoArray;
        this.calcularTotal(this.productosSeleccionados);
    }
  
    calcularTotal(data) {
        this.resetear()
        let total = 0;
        data.forEach(element => {
            total += element.precio_venta * element.cantidad1;          
        });
                
        this.total_bruto = Number(total);
        this.sub_total = total - Number(this.descuento);
        this.neto = this.sub_total - Number(this.monto_itbis);

        this.forma.get('total_bruto').setValue(total)
        this.forma.get('sub_total').setValue(this.sub_total)
        this.forma.get('monto_itbis').setValue(this.monto_itbis)
        this.forma.get('descuento').setValue(this.descuento)
        this.forma.get('neto').setValue(this.neto)

    }
  
    clienteSeleccionado(cliente) {        
        this.forma.get('id_pais').setValue(cliente.id_pais)
        this.forma.get('id_ciudad').setValue(cliente.id_ciudad)
        this.forma.get('id_zonalocal').setValue(cliente.id_zonalocal)
        this.forma.get('nombre_cli').setValue(cliente.nombre)
        this.forma.get('tipo_cliente').setValue(cliente.tipo_cliente)
        this.forma.get('sec_cliente').setValue(cliente.sec_cliente)
        this.forma.get('direccion').setValue(cliente.sec_cliente)
        this.overlay.hide()
    }

    calculaDevueltaE(data) {
        this.devueltaMenor = false;
        if (data === '') {
            this.forma.get('devuelta').setValue(0)
            return
        }
        
        let devuelta = data - Number(this.neto)        
        this.forma.get('devuelta').setValue(devuelta)        
    }

    resetear() {
        this.forma.get('total_bruto').reset()    
        this.forma.get('sub_total').reset()    
        this.forma.get('descuento').reset()    
        this.forma.get('monto_itbis').reset()    
        this.forma.get('devuelta').reset()    
        this.forma.get('neto').reset()
        this.forma.get('efectivo').reset()
        this.forma.get('tarjeta').reset()
        this.forma.get('cheque').reset()
        this.forma.get('cheque_no').reset()
    }

    resetFormulario() {
        this.neto = 0;
        this.productosSeleccionados = [];
        this.forma.reset();
        this.forma.get('fecha_factura').setValue(this.fecha);
        this.forma.get('nombre_cli').setValue('CLIENTE CONTADO');
        this.forma.get('num_emp').setValue(this.usuario.empleado.id);
        this.forma.get('estado').setValue('activo');
        this.forma.get('usuario_creador').setValue(this.usuario.username);
        let i = 0;
        while (0 !== this.producto.length) {
          this.producto.removeAt(0);
          i++
        }
        this.cd.detectChanges();
    }
    
    financiar() {
        if (this.financiando) {
            this.financiando = false;
            return;
        }
        
        if (this.neto !== 0) {
            let obj = {
                nombre_cli: this.forma.get('nombre_cli').value,
                tipo_cliente: this.forma.get('tipo_cliente').value || 1,
                sec_cliente: this.forma.get('sec_cliente').value || 1,
                neto: this.neto
            }

            this.dialogService.open(FormularioTablaAmortizacionesComponent, {
                data: obj,
                closeOnEscape: false,
                header: 'Datos Necesarios Creación de Productos',
                width: '70%'
                });            
        } else {
            this.uiMessage.getMiniInfortiveMsg('tc','info','','Debe agregar articulos para financiar.');           
        }
    }

    getNoValido(input: string) {
        return this.forma.get(input).invalid && this.forma.get(input).touched;
    }

    logout() {
        this.usuarioServ.logout(this.usuario.email);
    }
}
