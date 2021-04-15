import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { FileUpload } from 'primeng/fileupload';
import { OverlayPanel } from 'primeng/overlaypanel';
import { ListaProductosComponent } from 'src/app/components/lista-productos/lista-productos.component';
import { ClientesService } from 'src/app/services/clientes.service';
import { DatosEstaticosService } from 'src/app/services/datos-estaticos.service';
import { DepartamentosService } from 'src/app/services/departamentos.service';
import { InventarioService } from 'src/app/services/inventario.service';
import { OrdenPedidosService } from 'src/app/services/orden-pedidos.service';
import { RequisicionesService } from 'src/app/services/requisiciones.service';
import { RrhhService } from 'src/app/services/rrhh.service';
import { UiMessagesService } from 'src/app/services/ui-messages.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-requisiciones',
  templateUrl: './requisiciones.component.html',
  styleUrls: ['./requisiciones.component.scss']
})
export class RequisicionesComponent implements OnInit {

  @ViewChild('op') overlay: OverlayPanel;
  forma: FormGroup;
  requisiciones:any[]=[];
  departamento: any[] = [];
  empleados: any[] = [];
  empleadoFiltrados: any[] = [];
  clientesFiltrados: any[];
  clientesSeleccionados: any[] = [];
  productos: any[] = [];
  clientes: any[] = [];
  i=0;
  isDisabled=true;
  cantidad= 0;
  total = 0;
  usuario: any;
  guardando = false;
  panelOpenState = false;
  cols: any[];
  cols2: any[];
  @ViewChild(FileUpload)
  fileUpload: FileUpload
  uploadedFiles: any[] = [];
  minDate: Date;
  ordenPedidoExiste = 3;
  blockedPanel: boolean = false;
  prioridad = [
    { label: 'VIP', value:'vip'},
    { label: 'Muy Alta', value:'muy-alta'},
    { label: 'Alta', value:'alta'},   
    { label: 'Media', value:'media'},     
    { label: 'Baja', value:'baja'},
  ] 

  constructor(private fb: FormBuilder, 
              private uiMessage: UiMessagesService,
              private empleadosServ: RrhhService,
              private usuariosServ: UsuarioService,
              private invProductosServ: InventarioService,
              private confirmationService: ConfirmationService,
              private departamentoServ: DepartamentosService,
              public dialogService: DialogService,
              private ordenPedido: OrdenPedidosService,
              private router: Router,
              private clientesServ: ClientesService,
              private requisicionesServ: RequisicionesService,
              private datosEstaticosServ: DatosEstaticosService) { 
                this.usuario = this.usuariosServ.getUserLogged(), 
                this.crearFormulario()
              }

  ngOnInit(): void {
    this.setMinDate();
    this.todosLosEmpleados();
    this.todasLasRequisiciones();
    this.productosEscogidos();
    
    this.clientesServ.getDatos().then((resp: any) => {
      this.clientes = resp;
    })
    
    this.departamentoServ.getDatos().then((resp: any) => {
      this.departamento = resp;            
    })

    this.requisicionesServ.requisicionGuardada.subscribe(resp => {
      this.todasLasRequisiciones();
    })

    this.requisicionesServ.requisicionBorrada.subscribe(resp => {
      this.todasLasRequisiciones();
    })

    this.requisicionesServ.requisicionact.subscribe(resp => {
      this.todasLasRequisiciones();
    })

    this.cols = [
      { field: 'num_req', header: 'Requisición' },
      { field: 'fech_req', header: 'Fecha' },
      { field: 'depto', header: 'Departamento' },
      { field: 'nombre_empleado', header: 'Empleado' },
      // { field: 'uso', header: 'Uso' },
      { field: 'prioridad', header: 'Prioridad' },
      { field: 'procesada', header: 'Procesada' },
      { field: 'acciones', header: 'Acciones' }
    ] 

    this.cols2 = [
      { field: 'imagen', header: 'Producto' },
      { field: 'tipoinventario', header: 'Tipo Inventario' },
      { field: 'categoria', header: 'Categoría' },
      { field: 'marca', header: 'Marca' },
      { field: 'cantidad1', header: 'Cantidad' },
      { field: 'precio_compra', header: 'Precio' },
      { field: 'total', header: 'Total'}
    ]
  }

  todasLasRequisiciones() {
    this.requisicionesServ.getDatos().then((resp: any) => {
       
      
      this.requisiciones = resp;
    })
  }

  productosEscogidos() {
    this.invProductosServ.productoEscogido.subscribe((resp: any) => {
      this.productos = [];  
      this.producto.clear()
       
      
      resp.forEach(element => {   
        element.total = Number(element.cantidad1) * Number(element.precio_compra)     
        this.total += element.total
        this.agregarFormulario(element);
        this.productos.push(element)
      });
    })
  }

  test(rowData) {
   
  }

  todosLosEmpleados() {
    this.empleadosServ.getDatos().then((resp:any) =>{
          
      this.empleados = resp;   
    })
  }
  
  get producto() {   
    return this.forma.get('productos') as FormArray;
  }
  
  crearFormulario() {                
    this.forma = this.fb.group({
      departamento:    ["", Validators.required],
      cod_emp_sec:     ["", Validators.required],
      uso:             ["", Validators.required],
      prioridad:       ["", Validators.required],
      num_oc:          [""],
      fech_req:        [""],
      cliente:         ["", Validators.required],
      tipo_cliente:    ["", Validators.required],
      sec_cliente:     ["", Validators.required],
      nombre_cliente:  ["", Validators.required],
      observacion:     ["", Validators.required],
      documento:       [""],
      procesada:       ["no"],
      estado:          ['activo'],
      usuario_creador: [this.usuario.username],
      productos: this.fb.array([])     
    })
  }

  agregarFormulario(producto) {
    (<FormArray>this.forma.get('productos')).push(this.agregarFormularioTransacciones(producto));    
  }
  
  agregarFormularioTransacciones(producto): FormGroup {
    return this.fb.group({
      codigo:          [producto.codigo, Validators.required],
      tipo_inv:        [producto.tipoinventario, Validators.required],
      marca:           [producto.marca, Validators.required],
      categoria:       [producto.categoria, Validators.required],
      cod_sp:          [producto.cod_sp, Validators.required],
      cod_sp_sec:      [producto.cod_sp_sec, Validators.required],
      cantidad1:       [producto.cantidad1 || producto.cantidad ||1, Validators.required],
      precio:          [producto.precio_compra, Validators.required],
      total:           [producto.total, Validators.required]
    });
  }

  guardarRequisiciones(){    
    this.forma.get('fech_req').setValue(this.datosEstaticosServ.getDate())
    if (this.forma.invalid) {      
      this.uiMessage.getMiniInfortiveMsg('tst','error','Error!!','Debe completar los campos que son obligatorios');       
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
      })
       
    }else{      
       
      this.requisicionesServ.crearRequisiciones(this.forma.value).then((resp: any)=>{
        this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente!','Registro creado de manera correcta');       
      })
    }  
  } 

  getNoValido(input: string) {
    return this.forma.get(input).invalid && this.forma.get(input).touched;
  }

  actualizarRequisiciones(producto) { 
    this.router.navigate(['actualizar-orden-compra',producto.id]);
  }

  borrarRequisicion(requisicion) {
    this.confirmationService.confirm({
      message:"Esta seguro de borrar este registro?",
      accept:() =>{ 
        this.requisicionesServ.borrarRequisicion(requisicion).then((resp: any)=>{
          this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro eliminado de manera correcta');   
        })       
      }
    })   
  }

  buscaProductos() {
     this.dialogService.open(ListaProductosComponent, {
      header: 'Catálogo de productos',
      width: '70%'
    });
  }

  calcula(i, event){
    if (event.target.value === '') {
      return;
    }
    let precio = this.producto.controls[i].value.precio;
    let cantidad = this.producto.controls[i].value.cantidad1; 
    
    let total = precio * cantidad;
    //let itbisRounded = this.datosEstaticosServ.decimalAdjust('round', itbis, -1)
    ((this.producto).at(i) as FormGroup).get("total").patchValue(total);
    
    this.total = 0;
  
    for (let i = 0; i < this.productos.length; i++) {     
      this.total += this.producto.controls[i].value.total;  
    }
   } 

  verificaOrdenPedido(data) {
    if (data === "") {
      this.ordenPedidoExiste = 3;
      return;
    }
    this.ordenPedidoExiste = 0;
    this.ordenPedido.buscaOrdenPedido(data).then((resp: any)=>{
      if(resp.length !== 0){
         
        this.productos = resp.productos;        
        this.productos.forEach(element => {
          element.total = Number(element.cantidad) * Number(element.precio_compra);
          this.total += element.total;
          this.agregarFormulario(element);
        });
        this.ordenPedidoExiste = 1;
        this.blockedPanel = true;
      }else{
        this.uiMessage.getMiniInfortiveMsg('tst','error','Atención','Esta orden de pedido no existe.');
        this.ordenPedidoExiste = 2;
        return;
      }
    })
  }

  borrarProdEscogido(id) {
    
  }

  onFileSelect(event) {
    this.forma.get("documento").setValue(this.fileUpload.files);
  }

  filtrarEmpleado(event) {
    const filtered: any[] = [];
    const query = event.query;    
    for (let i = 0; i < this.empleados.length; i++) {
      const size = this.empleados[i];
      if (size.primernombre.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(size);
      }
    }
    this.empleadoFiltrados = filtered;
  }

  datosEmpleado(data) {
         
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
  }

  clienteSeleccionado(cliente) {  
    this.forma.get('cliente').setValue(cliente) 
    this.forma.get('tipo_cliente').setValue(cliente.tipo_cliente)
    this.forma.get('nombre_cliente').setValue(cliente.sec_cliente)
    this.overlay.hide()
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
