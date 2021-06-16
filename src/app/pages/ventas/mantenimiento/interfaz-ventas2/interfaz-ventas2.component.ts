import { ChangeDetectorRef, HostListener } from '@angular/core';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { SelectItem, MenuItem, PrimeNGConfig } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { OverlayPanel } from 'primeng/overlaypanel';
import { Subscription } from 'rxjs';
import { BreadcrumbService } from 'src/app/app.breadcrumb.service';
import { AppMainComponent } from 'src/app/app.main.component';
import { CategoriasService } from 'src/app/services/categorias.service';
import { ClientesService } from 'src/app/services/clientes.service';
import { DatosEstaticosService } from 'src/app/services/datos-estaticos.service';
import { FacturasService } from 'src/app/services/facturas.service';
import { InventarioService } from 'src/app/services/inventario.service';
import { UiMessagesService } from 'src/app/services/ui-messages.service';
import { UsuarioService } from 'src/app/services/usuario.service';
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
    @ViewChild('general') elementView: ElementRef;
    sortOptions: SelectItem[];
    sortOrder: number;
    sortField: string;
    items: MenuItem[];
    usuario: any;
    nombre: any;
    tieredItems: MenuItem[] = [];
    modulos: any;
    menues: any;
    productos: any[] = [];
    productosSeleccionados: any[] = [];
    clientes: any[] = [];
    clientesSeleccionados: any[] = [];
    total_bruto = 0
    sub_total = 0
    descuento = 0
    monto_itbis = 0
    neto = 0
    efectivo = true;
    display = false;
    tarjeta = false;
    cheque = false;
    ambos = false;
    devueltaMenor = false;
    cols: { field: string; header: string; }[];
    categorias: any[] = [];
    cols2: { field: string; header: string; }[];
    fecha: string;
    modo = 'pos';
    cols3: { field: string; header: string; }[];
    financiando = false;
    loading = true;
    objetos = 12;
    contentHeight: number;
    detailHeigth: string;
    innerWidth: number;
    innerHeight: number;

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
                
                this.nombre = this.usuario.name+' '+this.usuario.surname;   
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
    this.todosLosProductos();
    this.todosLasCategorias();
    this.todosLosClientes();    

    this.cols = [
        { field: 'titulo', header: 'Producto' },
        // { field: 'titulo', header: 'Titulo' },
        // { field: 'codigo', header: 'Código' },
        { field: 'precio_venta', header: 'Precio' },
        { field: 'cantidad', header: 'Cantidad' },
        { field: 'acciones', header: 'Acciones' },
    ] 

    this.cols2 = [
        { field: 'titulo', header: 'Producto' },
        // { field: 'titulo', header: 'Titulo' },
        { field: 'codigo', header: 'Código' },
        { field: 'precio_venta', header: 'Precio' },
        { field: 'cantidad', header: 'Cantidad' }
    ] 

    this.cols3 = [
        { field: 'titulo', header: 'Producto' },
        // { field: 'titulo', header: 'Titulo' },
        { field: 'codigo', header: 'Código' },
        { field: 'precio_venta', header: 'Precio' },
        { field: 'cantidad', header: 'Cantidad' },
        { field: 'acciones', header: 'Acciones' },
    ] 
    
    this.sortOptions = [
        {label: 'Price High to Low', value: '!price'},
        {label: 'Price Low to High', value: 'price'}
    ];

      this.facturaServ.metodo.subscribe((resp: any) => {
        console.log(resp);
        
          this.forma.get('efectivo').setValue('');
          this.forma.get('tarjeta').setValue('');
          this.forma.get('devuelta').setValue('');
        this.efectivo = resp.efectivo;
        this.tarjeta = resp.tarjeta;
        this.cheque = resp.cheque;
          this.ambos = resp.ambos;
          this.tipo(resp)
    });
    
    this.facturaServ.modoVenta.subscribe((resp: any) => {
        this.modo = resp;
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
      console.log(this.detailHeigth);  
    }
    
    tipo(valor) {        
        const efectivo = this.forma.get('efectivo');
        const tarjeta = this.forma.get('tarjeta');
        const tarjeta_no = this.forma.get('tarjeta_no');
        const cheque = this.forma.get('cheque');
        const cheque_no = this.forma.get('cheque_no');

        if (valor.efectivo === true) {            
            efectivo.setValidators(Validators.required)
            tarjeta.clearValidators();
            tarjeta_no.clearValidators();
            cheque.clearValidators();
            cheque_no.clearValidators();
            console.log('efectivo'); 
        }

        if (valor.tarjeta === true) {
            tarjeta.setValidators(Validators.required)
            tarjeta_no.setValidators(Validators.required)
            efectivo.clearValidators();
            cheque.clearValidators();
            cheque_no.clearValidators();
            console.log('tarjeta');
            console.log(this.forma);
        }

        if (valor.cheque === true) {
            cheque.setValidators(Validators.required)
            cheque_no.setValidators(Validators.required)
            tarjeta.clearValidators();
            tarjeta_no.clearValidators();
            efectivo.clearValidators();
            console.log('cheque');
        }

        if (valor.ambos === true) {
            efectivo.setValidators(Validators.required)  
            tarjeta.setValidators(Validators.required)
            tarjeta_no.setValidators(Validators.required)
            cheque.clearValidators();
            cheque_no.clearValidators();
            console.log('ambos');
        }

        efectivo.updateValueAndValidity
        tarjeta.updateValueAndValidity
        tarjeta_no.updateValueAndValidity
        cheque.updateValueAndValidity     
        cheque_no.updateValueAndValidity
        console.log(this.forma);
        
    }
    
  todosLosProductos() {
      this.inventarioServ.getDatos().then((resp: any) =>{
          this.productos = resp;
          this.loading = false;
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
          num_emp:         [this.usuario.empleado.id_numemp, Validators.required],
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
      console.log(this.forma);
      if (this.forma.valid) {          
          let devuelta = Math.abs(Number(this.forma.get('devuelta').value));
          this.forma.get('devuelta').setValue(devuelta);  

          if (devuelta < 0 && !this.ambos) {
              this.devueltaMenor = true;
              this.uiMessage.getMiniInfortiveMsg('tc','error','Error','LA CANTIDAD PAGADA ES MENOR AL MONTO TOtAL');
              return;
          } 
          if (this.tarjeta || this.ambos) {
              this.forma.get('tarjeta').setValue(devuelta) 
          }
          if (this.cheque) {
              this.forma.get('cheque').setValue(devuelta) 
          }
          this.facturaServ.crearFactura(this.forma.value).then((resp: any) => {              
              this.uiMessage.getMiniInfortiveMsg('tc','success','Excelente','PRODUCTO FACTURADO');  
              this.resetFormulario();
              this.todosLosProductos();
          })       
      }else{            
          if (this.forma.value.productos.length === 0) {
              this.uiMessage.getMiniInfortiveMsg('tc','error','Error','DEBE AGREGAR ARTICULOS A LA FACTURA');
              return;
          }
      }
  }

  financiarFactura() {
      if (this.financiando) {
          this.facturaServ.crearFacturaPrestamo(this.forma.get('financiar').value).then((resp: any) => {
              console.log(resp);                
          })
      } else {
          
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
            this.display = true;
          this.facturaServ.display = true;
          this.agregarFormulario(producto);

          this.productosSeleccionados.push(producto);
          
          this.calcularTotal(this.producto.value)
          let efectivo = Number(this.forma.get('efectivo').value)
          if (efectivo !== 0) {
              this.calculaDevueltaE(efectivo)               
          }
          document.getElementById(producto.id).classList.add("agregado")
        }else{
            this.uiMessage.getMiniInfortiveMsg('tc','info','Atención','Este producto ya esta en la factura');             
        }
  }

  eliminarProducto(producto) {
      const nuevoArray = this.productosSeleccionados.filter( (data: any) => {   
          return data.id !== producto.id;
      });     
      
      this.productosSeleccionados = nuevoArray
      this.calcularTotal(this.productosSeleccionados)
      document.getElementById(producto.id).classList.remove("agregado")
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

  onSortChange(event) {
      let value = event.value;

      if (value.indexOf('!') === 0) {
          this.sortOrder = -1;
          this.sortField = value.substring(1, value.length);
      }
      else {
          this.sortOrder = 1;
          this.sortField = value;
      }
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
        this.forma.get('num_emp').setValue(this.usuario.empleado.id_numemp);
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
