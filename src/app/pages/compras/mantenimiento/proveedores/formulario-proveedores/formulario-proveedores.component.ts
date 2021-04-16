import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { DialogService } from 'primeng/dynamicdialog';
import { CatalogoCuentasComponent } from 'src/app/components/catalogo-cuentas/catalogo-cuentas.component';
import { CgcatalogoService } from 'src/app/services/cgcatalogo.service';
import { PaisesCiudadesService } from 'src/app/services/paises-ciudades.service';
import { ProveedoresService } from 'src/app/services/proveedores.service';
import { TipoProveedorService } from 'src/app/services/tipo-proveedor.service';
import { UiMessagesService } from 'src/app/services/ui-messages.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { StepProveedoresComponent } from '../step-proveedores/step-proveedores.component';

@Component({
  selector: 'app-formulario-proveedores',
  templateUrl: './formulario-proveedores.component.html',
  styleUrls: ['./formulario-proveedores.component.scss']
})
export class FormularioProveedoresComponent implements OnInit {
  forma: FormGroup;
  usuario:any;
  guardando = false;
  guardar = true;
  actualizando = false;
  actualizar = false;
  selectedMultiMoneda: any[] = [];
  cuenta_no: any;
  proveedorExiste = 3;
  tipo_proveedor=[];
  documento=[];
  ciudades=[];
  paises=[];
  condpago:any[] = [];
  monedas: any;
  cedula = true;
  rnc = false; 
  cols2:any[]= [];
  cgcatalogos: any[] = [];
  id: string;
    formSubmitted = false;
  listSubscribers: any = [];

  constructor(private fb: FormBuilder, 
              private paisesCiudadesServ: PaisesCiudadesService,
              private usuariosServ: UsuarioService,
              private uiMessage: UiMessagesService,
              private proveedoresServ:ProveedoresService,
              private cgCatalogoServ: CgcatalogoService,
              private tipoProveedorServ: TipoProveedorService,
              public dialogService: DialogService,
              private cd: ChangeDetectorRef) { 
      this.usuario = this.usuariosServ.getUserLogged();
      this.crearFormulario() 
  }

  ngOnInit(): void {
    this.todaLaData();
    this.listObserver();

    this.cols2 = [
      { field: 'descripcion', header: 'Descripción' },
      { field: 'cuenta_no', header: 'Cuenta' },
      { field: 'origen', header: 'Origen' },
      { field: 'tipo_cuenta', header: 'Tipo Cuenta' },
      { field: 'porciento', header: 'Porciento' },
      { field: 'acciones', header: 'Acciones' },
    ]

  }
  
  ngOnDestroy(): void {
    this.listSubscribers.forEach(a => a.unsubscribe());
  }

  listObserver = () => {
    const observer1$ = this.tipoProveedorServ.tipoPguardado.subscribe((resp: any)=>{
      this.tipo_proveedor.push(resp);      
    })

    const observer2$ = this.proveedoresServ.actualizar.subscribe((resp: any) =>{
      this.guardar = false;
      this.actualizar = true;    
      this.id = resp[0]+'-'+resp[1];
      
      this.proveedoresServ.getDato(resp[0]+'-'+resp[1]).then((res: any) => {
        this.forma.patchValue(res);
        
        this.forma.get('tipo_doc').setValue(this.documento.find(doc => doc.tipo_documento == res.tipo_doc)); 
        this.forma.get('cod_sp').setValue(this.tipo_proveedor.find(doc => doc.id == res.cod_sp)); 
        this.forma.get('cond_pago').setValue(this.condpago.find(doc => doc.id == res.cond_pago)); 
        this.forma.get('id_pais').setValue(this.paises.find(pais => pais.id_pais === res.id_pais));    
        this.forma.get('id_moneda').setValue(JSON.parse(res.moneda));      
        this.selectedMultiMoneda = JSON.parse(res.moneda);
        this.paisesCiudadesServ.getCiudadesXpaises(res.id_pais).then((resp:any) => { 
          this.ciudades = resp;
          this.forma.get('id_ciudad').setValue(this.ciudades.find(ciudad => ciudad.id_ciudad === res.id_ciudad));
        })

        res.cuentas_proveedor.forEach(element => {
          this.cgcatalogos.push(element);
          this.agregarFormulario(element);
        });
      })
    })

    const observer3$ = this.cgCatalogoServ.catalogoEscogido.subscribe((resp: any) => {
      resp.forEach(element => {
        if (element.tipo_cuenta !== "normal") {
          this.cgcatalogos.push(element);
          this.agregarFormulario(element);
        }
      });               
    })

    const observer5$ = this.proveedoresServ.formSubmitted.subscribe((resp) => {
      this.formSubmitted = resp;
       (resp);      
    })

    this.listSubscribers = [observer1$,observer5$,observer2$,observer3$];
  };

  todaLaData() {
    this.proveedoresServ.autoLlenado().then((resp: any)  => {
      resp.forEach(element => {
        switch (element.label) {
          case 'condiciones':
            this.condpago = element.data;
            break;

          case 'monedas':
            this.monedas = element.data;
            break;

          case 'catalogo':
            this.cuenta_no = element.data;
            break;  

          case 'tipo proveedor':
            this.tipo_proveedor = element.data;
            break; 

          case 'paises':
            this.paises = element.data;
            break; 

          case 'tipo documento':
            this.documento = element.data;           
            this.forma.get('tipo_doc').setValue(this.documento.find(doc => doc.descripcion === 'cedula'));
            break; 

          default:
            break;
        }
      });  
      this.autollenado(resp);  
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
       this.dialogService.open(StepProveedoresComponent, {
        data,
        closeOnEscape: false,
        header: 'Datos Necesarios Creación Proveedores',
        width: '70%'
      });
    }
  }

  crearFormulario() {
    this.forma = this.fb.group({
      cod_sp:              ['', Validators.required],  
      email:               ['', Validators.compose([ Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")])],  
      cod_sp_sec:          [''], 
      nom_sp:              ['', Validators.required],          
      dir_sp:              ['', Validators.required],
      tel_sp:              ['', Validators.required],
      fax_sp:              [''],          
      cont_sp:             ['', Validators.required],
      tipo_doc:            ['', Validators.required],
      cond_pago:           ['', Validators.required],          
      documento:           ['', Validators.required],        
      id_moneda:           ['', Validators.required],        
      cuenta_no:           ['', Validators.required],
      id_pais:             ['', Validators.required],            
      id_ciudad:           ['', Validators.required],          
      usuario_creador:     [this.usuario.username, Validators.required],
      usuario_modificador: [''],
      estado:              ['activo'],
      cuentas_no:          this.fb.array([])
    })
  }

  get cuentas_no() {   
    return this.forma.get('cuentas_no') as FormArray;
  }

  get cuentaForm() {   
    return this.forma.get('cuenta_no') as FormGroup;
  }
  
  agregarFormulario(cuentas) {
    (<FormArray>this.forma.get('cuentas_no')).push(this.agregarFormularioTransacciones(cuentas));    
  }
  
  agregarFormularioTransacciones(cuentas): FormGroup {
    return this.fb.group({
      descripcion: [cuentas.descripcion, Validators.required],  
      cuenta_no:   [cuentas.cuenta_no, Validators.required],  
      porciento:   [cuentas.porciento],  
    });
  }

  buscaPaises(id) {    
    this.paisesCiudadesServ.getCiudadesXpaises(id).then((resp:any) => {
      this.ciudades = resp;     
    })  
  }

  setValue() {
    this.selectedMultiMoneda = this.forma.get("id_moneda").value
  }

  guardarProveedor(){
    // this.formSubmitted = true; 
         console.log(this.forma);
          
    if (this.forma.invalid) { 
      this.formSubmitted = false;     
      this.uiMessage.getMiniInfortiveMsg('tst','error','Atención','Debe completar los campos que son obligatorios');      
      Object.values(this.forma.controls).forEach(control =>{          
        if (control instanceof FormArray) {    
          Object.values(control.controls).forEach(control => {
            control.markAsTouched();
          });
        } else {
          control.markAllAsTouched();
        }
      })
    }else{            
      this.proveedoresServ.crearProveedor(this.forma.value).then(()=>{
        this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente',"Proveedor creado exitosamente!!");      
        this.restaurarFormulario();
      })
    }      
  } 

  actualizarProveedor(){
    this.formSubmitted = true;            
    this.forma.get('usuario_modificador').setValue(this.usuario.username);   

    if (this.forma.invalid) {      
      this.formSubmitted = false;
      this.uiMessage.getMiniInfortiveMsg('tst','error','Atención','Debe completar los campos que son obligatorios');      
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
      })
    }else{      
      this.proveedoresServ.actualizarProveedor(this.id, this.forma.value).then((resp: any)=>{
        this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro actualizado de manera correcta');   
        this.restaurarFormulario();            
      })
    }
  }

  verificaProveedor(data){        
    if (data === "") {
      this.proveedorExiste = 3;
      return;
    }
    this.proveedorExiste = 0;
    this.proveedoresServ.busquedaProveedor(data).then((resp: any)=>{
      if(resp.length === 0) {
        this.proveedorExiste = 1;
      }else{
        this.proveedorExiste = 2;
      }
    })
  }

  setCuenta(data) {
    this.forma.get('cuenta_no').setValue(data);
    this.cgCatalogoServ.busquedaCatalogo(data).then((resp: any) => {
       (resp);
      if (resp[0].tipo_cuenta !== "normal") {
        this.cgcatalogos.push(resp[0]);
        this.agregarFormulario(resp[0]);
      }
    })
  }

  tipoDoc(doc) {
    if (doc.descripcion === 'cedula') {
      this.cedula = true;
      this.rnc = false;
    } 
    if (doc.descripcion === 'RNC') {
      this.cedula = false;
      this.rnc = true;
    } 
    this.forma.get('documento').reset()
  }

  restaurarFormulario() {
    let i = 0;
    this.forma.reset();
    while (0 !== this.cuentas_no.length) {
      this.cuentas_no.removeAt(0);
      i++
    }
    this.forma.get('tipo_doc').setValue(this.documento.find(doc => doc.tipo_documento == 1)); 
    this.forma.get('estado').setValue('activo');
    this.forma.get('usuario_creador').setValue(this.usuario.username);
    this.selectedMultiMoneda = [];
    this.cgcatalogos = [];
    this.cd.detectChanges();
  }

  cancelar() {
    this.actualizar = false;
    this.guardar = true;
    this.restaurarFormulario()
    this.proveedoresServ.guardando();    
  }

  buscaCuentas() {
     this.dialogService.open(CatalogoCuentasComponent, {
      header: 'Catalogo de cuentas',
      width: '50%'
    });
  }

  borrarCatEscogido(id) {    
    this.cgcatalogos.splice(id,1)  
    this.cuentas_no.removeAt(id);
  }

  // FUNCIONES PARA EL MANEJO DE LOS ERRORES EN LOS CAMPOS DEL FORMULARIO
  getNoValido(input: string) {
    return this.forma.get(input).invalid && this.forma.get(input).touched;
  }

  getNoValidoArray(input: string, index:number) {
     return ((this.cuentas_no).at(index) as FormGroup).get(input).invalid && ((this.cuentas_no).at(index) as FormGroup).get(input).touched;
  }

}
