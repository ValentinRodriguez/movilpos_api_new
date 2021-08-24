import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { DialogService } from 'primeng/dynamicdialog';
import { ListaProductosComponent } from 'src/app/components/lista-productos/lista-productos.component';
import { PendientesLiquidacionComponent } from 'src/app/components/pendientes-liquidacion/pendientes-liquidacion.component';
import { InventarioService } from 'src/app/services/inventario/inventario.service';
import { LiquidacionMercanciasService } from 'src/app/services/inventario/liquidacion-mercancias.service';
import { OrdenescomprasService } from 'src/app/services/compras/ordenescompras.service';
import { UiMessagesService } from 'src/app/services/globales/ui-messages.service';
import { UsuarioService } from 'src/app/services/panel-control/usuario.service';

@Component({
  selector: 'app-formulario-liquidacion-mercancias',
  templateUrl: './formulario-liquidacion-mercancias.component.html',
  styleUrls: ['./formulario-liquidacion-mercancias.component.scss'],
  providers:[UsuarioService,InventarioService,OrdenescomprasService,LiquidacionMercanciasService,LiquidacionMercanciasService,]
})
export class FormularioLiquidacionMercanciasComponent implements OnInit {

  forma: FormGroup;
  usuario: any;
  ProveedoresFiltrados: any[];
  guardar = true;
  actualizando = false;
  actualizar = false;
  ocExiste = 3;  
  id: number;
  listSubscribers: any = [];
  proveedores: any = [];
  minDate: Date;
  cols2: any[] = [];
  productos = [];
  opciones: any[];
  value1: string = "no";
  totalImpuestos = 0;
  totalGastos = 0;
  totalFOB = 0;
  totalFlete = 0;
  pendientes: any;

  constructor(private fb: FormBuilder,
              private uiMessage: UiMessagesService,
              private usuariosServ: UsuarioService,
              private invProductosServ: InventarioService,
              private ordenCompraServ:OrdenescomprasService,
              public pendientesLiquidacionServ: LiquidacionMercanciasService,
              private liquidacionesServ: LiquidacionMercanciasService,
              private dialogService: DialogService) { 
                this.opciones = [{label: 'Sí', value: 'si'}, {label: 'No', value: 'no'}];
                this.usuario = this.usuariosServ.getUserLogged()
                this.crearFormulario();
  }

  ngOnDestroy(): void {
    this.listSubscribers.forEach(a => a.unsubscribe());
  }

  ngOnInit(): void {
    this.pendientesLiquidacionServ.autollenado().then((resp: any) =>{
            
      resp.forEach(element => {
        switch (element.label) {
          case 'proveedores':
            this.proveedores = element.data;
            break;

          case 'pendientes':
            this.pendientes = element.data;
            this.pendientesLiquidacion(this.pendientes);
            break;
        }
      })
    });

    this.listObserver();
    
    this.cols2 = [
      { field: 'materiales', header: 'Materiales' },
      { field: 'descripcion', header: 'Descripcion' },
      { field: 'cantidad', header: 'Cantidad Requerida' },
      { field: 'fob', header: 'FOB' },
      { field: 'flete', header: 'Flete' },
      { field: 'total FOB', header: 'Total FOB' },
      { field: 'impuestos', header: 'Impuestos' },
      { field: 'gastos', header: 'Gastos' },
      { field: 'acciones', header: 'Acciones' },
    ]
  }
  
  listObserver = () => {
    const observer1$ = this.liquidacionesServ.actualizar.subscribe((resp: any) =>{
      this.guardar = false;
      this.actualizar = true;   
      this.id = Number(resp);      
      this.liquidacionesServ.getDato(resp).then((res: any) => {         
        this.forma.get('divisa').setValue(res.divisa);
        this.forma.get('simbolo').setValue(res.simbolo);
        this.forma.patchValue(res);
      })
    })

    const observer3$ = this.liquidacionesServ.pendienteEnviadas.subscribe((resp: any) =>{
            
      this.forma.get('num_oc').setValue(resp.id_num_oc);
      this.forma.get('cod_sp').setValue(resp.cod_sp);
      this.forma.get('cod_sp_sec').setValue(resp.cod_sp_sec);
      this.forma.get('fecha').setValue(new Date(resp.orden.created_at));
      this.forma.get('rep_entrada').setValue(resp.num_doc);
      this.forma.get('tipo_doc').setValue(resp.tipo_doc);
      this.forma.get('nombre_sp').setValue(this.proveedores.find(proveedor => (proveedor.cod_sp == resp.cod_sp && proveedor.cod_sp_sec == resp.cod_sp_sec))); 
      this.productos.push(resp);
      this.agregarFormulario(resp);
    })

    this.listSubscribers = [observer1$,observer3$];
  };

  crearFormulario() {
    this.forma = this.fb.group({
      num_oc:              ['', Validators.required],
      cod_sp:              ['', Validators.required],
      cod_sp_sec:          ['', Validators.required],
      fecha:               ['', Validators.required],
      rep_entrada:         ['', Validators.required],
      status_orden:        ['', Validators.required],
      factura:             ['', Validators.required],
      prima:               ['', Validators.required],
      nombre_sp:           ['', Validators.required],
      total_impuestos:     ['', Validators.required],
      tipo_doc:            ['', Validators.required],
      total_gastos:        ['', Validators.required],
      flete:               ['', Validators.required],
      porciento:           ['', Validators.required],
      productos:           this.fb.array([]),     
      estado:              ['activo', Validators.required],
      usuario_modificador: ['']
    })
  }

  pendientesLiquidacion(pendientes) {
    if (pendientes.length !== 0) {
      this.dialogService.open(PendientesLiquidacionComponent, {
        header: 'Catálogo de productos',
        width: '70%'
      });        
    }
  }

  buscaProductos() {
    this.dialogService.open(ListaProductosComponent, {
      header: 'Catálogo de productos',
      width: '70%'
    });
  }
  
  agregarFormulario(producto) {
    (<FormArray>this.forma.get('productos')).push(this.agregarFormularioTransacciones(producto));    
  }
  
  agregarFormularioTransacciones(producto): FormGroup {
    return this.fb.group({
      codigo:       ['', Validators.required],
      num_req:      ['', Validators.required],
      porc_desc:    ['', Validators.required],
      monto_desc:   ['', Validators.required],
      itbis:        [''],
    });
  }

  productosEscogidos() {
    this.invProductosServ.productoEscogido.subscribe((resp: any) => {      
      this.productos = [];
      this.producto.reset();

      resp.forEach(element => {     
        this.agregarFormulario(element);
        this.productos.push(element)
      });
    })
  }

  get producto() {   
    return this.forma.get('productos') as FormArray;
  }

  guardarLiquidacion(){
        
    if (this.forma.invalid) {    
         
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios');      
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
      })
    }else{   
      this.liquidacionesServ.crearLiquidacion(this.forma.value).then(()=>{
        this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro creada de manera correcta'); 
        this.resetFormulario(); 
      })
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

  datosProv(event) {
    // this.liquidacions = JSON.parse(event.liquidacion) 
    this.forma.get("cod_sp").setValue(event.cod_sp);
    this.forma.get("cod_sp_sec").setValue(event.cod_sp);
  }
  
  verificaOrdenCompra(data) {        
    if (data === "" || this.forma.get("num_oc").value !== '') {
      this.ocExiste = 3;
      return;
    }
    this.ocExiste = 0;
    this.ordenCompraServ.buscaOrdenCompra(data).then((resp: any)=>{
       
      const proveedor = resp[0].proveedor;
      if(resp.length !== 0){          
        
        
        // this.productos = resp[0].productos;     
        // this.productos.forEach(element => {
        //   this.agregarFormulario(element);
        // });
        // this.ocExiste = 1;          
        // this.forma.controls['proveedor'].setValue(this.proveedores.find(proveedor => proveedor.cod_sp === resp[0].cod_sp && 
        //                                                                              proveedor.cod_sp_sec === resp[0].cod_sp_sec))
        // this.forma.controls['email'].setValue(resp[0].email);
        // this.forma.controls['num_rnc'].setValue(resp[0].rnc);
        // this.forma.controls['fecha'].setValue(new Date(resp[0].created_at));
        // this.forma.controls['cod_sp'].setValue(resp[0].cod_sp);
        // this.forma.controls['cod_sp_sec'].setValue(resp[0].cod_sp_sec);  
      }else{
        this.ocExiste = 2;
        return;
      }
    })
  }

  actualizarLiquidacion(){
    this.forma.get('usuario_modificador').setValue(this.usuario.username);    
    if (this.forma.invalid) {  
           
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios');      
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
      })
    }else{ 
      this.liquidacionesServ.actualizarLiquidacion(this.id, this.forma.value).then((resp: any) => {
        this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro actualizado de manera correcta');
        this.resetFormulario();
      })
    }
  }
  
  onSelectDate(event) {
    let d = new Date(Date.parse(event));
    // this.forma.get("fecha").setValue(`${d.getFullYear()}/${d.getMonth()+1}/${d.getDate()}`);
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

  cancelar() {
    this.actualizar = false;
    this.guardar = true;
    this.resetFormulario();
    this.liquidacionesServ.guardando();    
  }

  resetFormulario() {
    this.forma.reset();
    this.forma.get('estado').setValue('activo');
    this.forma.get('usuario_creador').setValue(this.usuario.username);
  }

  getNoValido(input: string) {
    return this.forma.get(input).invalid && this.forma.get(input).touched;
  }

}
