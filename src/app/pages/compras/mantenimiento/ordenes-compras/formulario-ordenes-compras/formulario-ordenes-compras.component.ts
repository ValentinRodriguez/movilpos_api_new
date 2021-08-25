import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { FileUpload } from 'primeng/fileupload';
import { ListaProductosComponent } from 'src/app/components/lista-productos/lista-productos.component';
import { ListadoDireccionesComponent } from 'src/app/components/listado-direcciones/listado-direcciones.component';
import { OrdenescomprasService } from 'src/app/services/compras/ordenescompras.service';
import { ProveedoresService } from 'src/app/services/compras/proveedores.service';
import { PuertosService } from 'src/app/services/compras/puertos.service';
import { DatosEstaticosService } from 'src/app/services/globales/datos-estaticos.service';
import { DireccionesService } from 'src/app/services/compras/direcciones.service';
import { InventarioService } from 'src/app/services/inventario/inventario.service';
import { UiMessagesService } from 'src/app/services/globales/ui-messages.service';

@Component({
  selector: 'app-formulario-ordenes-compras',
  templateUrl: './formulario-ordenes-compras.component.html',
  styleUrls: ['./formulario-ordenes-compras.component.scss'],
  providers: [OrdenescomprasService, InventarioService, DialogService,
              ProveedoresService,PuertosService,DireccionesService,]
})
export class FormularioOrdenesComprasComponent implements OnInit {

  forma: FormGroup;
  
  listSubscribers: any = [];
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
  ProveedoresFiltrados: any[];
  proveedores=[];
  @ViewChild(FileUpload)
  fileUpload: FileUpload
  condpago: any[];
  monedas: any;
  simbolo: any = '$';
  metodosEnv: any[];
  minDate: Date;
  puertos: any[] = [];
  direcciones: any[] = [];  
  productos = [];
  direccion: any;
  cols2: any[];
  usuario: any;
  uploadedFiles: any[] = [];
  items: MenuItem[] = [];
  
  constructor(private fb: FormBuilder, 
              private uiMessage: UiMessagesService,
              private ordenServ :OrdenescomprasService,
              private datosEstaticosServ: DatosEstaticosService,
              private invProductosServ: InventarioService,
              public dialogService: DialogService,
              private proveedoresServ: ProveedoresService,
              private puertosServ: PuertosService,
              private direccionesServ: DireccionesService,
              @Inject(DOCUMENT) private document: Document) { 
                this.crearFormulario()
              }

  ngOnDestroy(): void {
    this.listSubscribers.forEach(a => a.unsubscribe());
  }

  ngOnInit(): void {    
    this.setMinDate();
    this.listObserver();

    this.direccion = {
      "nombre": "",
      "direccion_a": "",
      "direccion_b": "",
      "telefono": "",
      "pais": "",
      "ciudad": ""
    }
    
    this.cols2 = [
      { field: 'imagen', header: 'Producto' },
      { field: 'num_req', header: 'Requisición' },
      { field: 'porc_desc', header: '% Descuento' },
      { field: 'monto_desc', header: 'Descuento' },
      { field: 'itbis', header: 'ITBIS' },
      { field: 'cantidad1', header: 'Cantidad' },
      { field: 'precio', header: 'Precio' },
      { field: 'valor_bruto', header: 'Valor Bruto'},
      { field: 'valor_neto', header: 'Valor Neto'},
      { field: 'acciones', header: 'Acciones'},
    ]

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

    this.datosEstaticosServ.getMetEnvios().then((resp: any) => {
      this.metodosEnv = resp;      
    })
  }

  listObserver = () => {
    const observer2$ = this.proveedoresServ.proveedoresCreados.subscribe((resp) => {
      this.proveedores.push(resp);
                  
    })

    const observer3$ = this.direccionesServ.direccionGuardada.subscribe((resp) => {
      this.direcciones.push(resp);
    })

    const observer4$ = this.puertosServ.puertoGuardada.subscribe((resp) => {
      this.puertos.push(resp);
    })

    const observer5$ =  this.invProductosServ.productoEscogido.subscribe((resp: any) => {      
      resp.forEach(element => {
                
        element.descuento = 0;    
        this.agregarFormulario(element);
        this.productos.push(element)
      });
      
      let totalCantidad = 0;

      for(let sale of this.productos) {
        totalCantidad += 1;
      }
      this.totalCantidad = totalCantidad;
      
      
    })

    const observer6$ = this.direccionesServ.direccionEscogida.subscribe((resp: any) => {
      this.direccion = resp;      
      this.forma.get('nombre').setValue(resp.nombre);
      this.forma.get('id_pais').setValue(resp.id_pais);
      this.forma.get('id_ciudad').setValue(resp.id_ciudad);
      this.forma.get('direccion_a').setValue(resp.direccion_a);
      this.forma.get('direccion_b').setValue(resp.direccion_b);
      this.forma.get('telefono').setValue(resp.telefono);
    }) 

    this.listSubscribers = [observer2$,observer3$,observer4$,observer5$,observer6$];
  };

  crearFormulario() {                
    this.forma = this.fb.group({
      fecha_enviada:     ['', Validators.required],
      numero_proforma:   ['654564ffgh', Validators.required],
      archivos:          [''],
      cond_pago:         ['', Validators.required],
      via_envio:         ['', Validators.required],
      cod_sp:            ['', Validators.required],
      cod_sp_sec:        ['', Validators.required],
      id_moneda:         ['', Validators.required],
      id_puerto:         ['', Validators.required],
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
      proveedor:         ['', Validators.required],
      productos: this.fb.array([])     
    })
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

  get producto() {   
    return this.forma.get('productos') as FormArray;
  }
  
  autollenado(data) {
    data.forEach(element => {            
      if (element.data.length === 0) {
        this.items.push({label: this.datosEstaticosServ.capitalizeFirstLetter(element.label), routerLink: element.label})
      }
    });      
  }

  guardarOrdenes(){
    this.forma.get("total_bruto").setValue(this.totalBruto)
    this.forma.get("total_desc").setValue(this.totalDescuento)
    this.forma.get("total_itbis").setValue(this.totalItbis)
    this.forma.get("total_neto").setValue(this.totalNeto)
    
    if (this.forma.invalid) {      
      this.uiMessage.getMiniInfortiveMsg('tst','error','Error!!','Debe completar los campos que son obligatorios');       
      Object.values(this.forma.controls).forEach(control =>{          
        if (control instanceof FormArray) {    
          Object.values(control.controls).forEach(control => control.markAsTouched());
        } else {
          control.markAllAsTouched();
        }
      })
    }else{
      this.ordenServ.crearOrdenes(this.forma.value).then((resp: any)=>{      
        this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente!','Registro creado de manera correcta');
        this.imprimirOrden(resp.num_oc);     
      })
    }  
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

  imprimirOrden(num_oc) {
    const link = this.document.createElement('a');
    link.target = '_blank';
    link.href = `${URL}/reporte/orden-compras/${num_oc}`;
    link.click();
    link.remove();
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

  listadoDirecciones() {
    this.dialogService.open(ListadoDireccionesComponent, {
      header: `Listado de direcciones`,
      width: '70%'
    });
  }

  buscaProductos() {
    this.dialogService.open(ListaProductosComponent, {
    header: 'Catálogo de productos',
    width: '70%'
    });
  }

    
  borrarProducto(id) {
    this.productos.splice(id,1)  
  }
 
  getNoValido(input: string) {
    return this.forma.get(input).invalid && this.forma.get(input).touched;
  }

}
