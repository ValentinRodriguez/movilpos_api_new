import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CgcatalogoService } from 'src/app/services/cgcatalogo.service';
import { UiMessagesService } from 'src/app/services/ui-messages.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ZonasService } from 'src/app/services/zonas.service';

@Component({
  selector: 'app-formulario-cgcatalogo',
  templateUrl: './formulario-cgcatalogo.component.html',
  styleUrls: ['./formulario-cgcatalogo.component.scss']
})
export class FormularioCgcatalogoComponent implements OnInit {

  forma: FormGroup;
  usuario: any;
  transportistaExiste = 3;
  cuentaExiste = 3;
  cuentaAplicaExiste = 3;
  zonas: any[] = [];
  onLabel = 'Resumen Analítico';
  onIcon = 'pi pi-check';
  codigosRetencion: any[] = [];
  descripExiste = 3
  isControl = true;
  guardando = false;
  guardar = true;
  actualizando = false;
  actualizar = false;
  id: number;
  formSubmitted = false;
  listSubscribers: any = [];

  sino = [
    {label: 'Sí', value: 'si'},
    {label: 'No', value: 'no'},
  ];
  
  nivel = [
    {label: 'Control', value: 1},
    {label: 'Sub-Control', value: 2},
    {label: 'auxiliar', value: 3}
  ];

  grupo = [
    {label: 'Pasivo', value: 'pasivo'},
    {label: 'Capital', value: 'capital'},
    {label: 'Activos', value: 'activos'}
  ];

  tipo_cuenta = [
    {label: 'Normal', value: 'normal'},
    {label: 'Bienes', value: 'bienes'},
    {label: 'Servicios', value: 'servicios'},
    {label: 'Impuestos', value: 'impuestos'}
  ];

  origen = [
    {label: 'Deudor', value: 'deudor'},
    {label: 'Acreedor', value: 'acreedor'},
  ];

  constructor(private fb: FormBuilder,
              private uiMessage: UiMessagesService,
              private usuariosServ: UsuarioService,
              private catalogoServ: CgcatalogoService,
              private zonasServ: ZonasService) { 
                this.usuario = this.usuariosServ.getUserLogged()
                this.crearFormulario();
  }

  ngOnDestroy(): void { 
    this.listSubscribers.forEach(a => a.unsubscribe());
  }

  ngOnInit(): void {
    this.listObserver();

    this.forma.get('aplica_a').disable();

    this.catalogoServ.codigosRetencion().then((resp: any) => {
      this.codigosRetencion = resp;
    })

    this.zonasServ.getDatos().then((resp: any) => {
      this.zonas = resp;
    })
  }

  listObserver = () => {
    console.log('aqui');
    const observer1$ = this.catalogoServ.actualizar.subscribe((resp: any) =>{
      this.guardar = false;
      this.actualizar = true;   
      this.id = Number(resp);      
      console.log(resp);
      this.catalogoServ.getDato(resp).then((res: any) => {         
        this.forma.patchValue(res);
        console.log(res);
        this.forma.get('nivel').setValue(this.nivel.find(nivel => nivel.value === res.nivel));
        this.forma.get('origen').setValue(this.origen.find(origen => origen.value === res.origen));
        this.forma.get('grupo').setValue(this.grupo.find(grupo => grupo.value === res.grupo));
        this.forma.get('codigo_isr').setValue(this.codigosRetencion.find(codigo => codigo.codigo_isr == res.codigo_isr));
        this.forma.get('tipo_cuenta').setValue(this.tipo_cuenta.find(tipo_cuenta => tipo_cuenta.value === res.tipo_cuenta));
        this.forma.get('analitico').setValue(this.sino.find(sino => sino.value === res.analitico));
        this.forma.get('catalogo').setValue(this.sino.find(sino => sino.value === res.catalogo));
        this.forma.get('depto').setValue(this.sino.find(sino => sino.value === res.depto));
        this.forma.get('selectivo_consumo').setValue(this.sino.find(sino => sino.value === res.selectivo_consumo));
        this.forma.get('retencion').setValue(this.sino.find(sino => sino.value === res.retencion));
        this.forma.get('referencia').setValue(this.sino.find(sino => sino.value === res.referencia)); 
        this.forma.get('descripcion').setValue(res.descripcion);  
        this.forma.get('cuenta_no').setValue(res.cuenta_no);     
      })
    })

    const observer5$ = this.catalogoServ.formSubmitted.subscribe((resp) => {
      this.formSubmitted = resp;
       (resp);
      
    })

    const observer2$ = this.catalogoServ.actualizar.subscribe((resp: any) =>{
      this.guardar = false;
      this.actualizar = true;   
      this.id = Number(resp);      
      console.log(resp);
      this.catalogoServ.getDato(resp).then((res: any) => {         
        this.forma.patchValue(res);
       
        this.forma.get('nivel').setValue(this.nivel.find(nivel => nivel.value === res.nivel));
        this.forma.get('origen').setValue(this.origen.find(origen => origen.value === res.origen));
        this.forma.get('grupo').setValue(this.grupo.find(grupo => grupo.value === res.grupo));
        this.forma.get('codigo_isr').setValue(this.codigosRetencion.find(codigo => codigo.codigo_isr == res.codigo_isr));
        this.forma.get('tipo_cuenta').setValue(this.tipo_cuenta.find(tipo_cuenta => tipo_cuenta.value === res.tipo_cuenta));
        this.forma.get('analitico').setValue(this.sino.find(sino => sino.value === res.analitico));
        this.forma.get('catalogo').setValue(this.sino.find(sino => sino.value === res.catalogo));
        this.forma.get('depto').setValue(this.sino.find(sino => sino.value === res.depto));
        this.forma.get('selectivo_consumo').setValue(this.sino.find(sino => sino.value === res.selectivo_consumo));
        this.forma.get('retencion').setValue(this.sino.find(sino => sino.value === res.retencion));
        this.forma.get('referencia').setValue(this.sino.find(sino => sino.value === res.referencia));        
        this.forma.get('descripcion').setValue(res.descripcion);  
        this.forma.get('cuenta_no').setValue(res.cuenta_no);     
        
      })
    })

    this.listSubscribers = [observer1$,observer5$,observer2$];
  };

  crearFormulario() {
    this.forma = this.fb.group({
      descripcion:       ['', Validators.required],
      analitico:         [{label: 'No', value: 'no'}, Validators.required],
      catalogo:          [{label: 'No', value: 'no'}, Validators.required],
      depto:             [{label: 'No', value: 'no'}, Validators.required],
      nivel:             [{label: 'Control', value: 1}, Validators.required],
      referencia:        [{label: 'No', value: 'no'}, Validators.required],
      origen:            ['', Validators.required],
      cuenta_no:         ['', Validators.required],
      aplica_a:          ['', Validators.required],
      grupo:             ['', Validators.required],
      tipo_cuenta:       ['', Validators.required],
      selectivo_consumo: [{label: 'No', value: 'no'}, Validators.required],
      retencion:         [{label: 'No', value: 'no'}, Validators.required],
      cuenta_resultado:  [''],      
      codigo_isr:        [''],
      estado_bg:         [''],
      estado_resultado:  [''],
      estado_a:          [''],
      estado_m:          [''],
      codigo_estado:     [''],
      estado:            ['activo', Validators.required],
      usuario_creador:   [this.usuario.username, Validators.required],
      usuario_modificador : ['']
    })
  }

  guardarCatalogo(){
    this.formSubmitted = true;
    if (this.forma.invalid) {  
      this.formSubmitted = false;     
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios');      
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
      })
    }else{   
      switch (this.descripExiste) {
        case 0:
          this.uiMessage.getMiniInfortiveMsg('tst','info','Espere','Verificando disponibilidad de nombre');
          break;

        case 2:
          this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Existe una categoria con este nombre');
          break;

        default:
          this.catalogoServ.crearCgcatalogos(this.forma.value).then((resp: any)=>{
             (resp);            
            this.resetFormulario();            
            this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente',"Cuenta Guarda exitosamente!!");
          })
          break;
      } 
    }
  }
  
  ActualizarCatalogo(){
    this.formSubmitted = true;    
    if (this.forma.invalid) {    
      this.formSubmitted = false;   
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios');      
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
      })
    }else{   
      switch (this.descripExiste) {
        case 0:
          this.uiMessage.getMiniInfortiveMsg('tst','info','Espere','Verificando disponibilidad de nombre');           
          break;

        case 2:
          this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Existe una categoria con este nombre');           
          break;

        default:
          this.forma.get('usuario_modificador').setValue(this.usuario.username);
          this.catalogoServ.actualizarCatalogo(this.id, this.forma.value).then(()=>{
            this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente',"Cuenta Guarda exitosamente!!");           
            this.resetFormulario();             
          })
          break;
      } 
    }
  }

  cancelar() {
    this.actualizar = false;
    this.guardar = true;
    this.resetFormulario();
    this.catalogoServ.guardando();  
  }

  resetFormulario() {
    this.forma.get('descripcion').reset();
    this.forma.get('cuenta_no').reset();
    this.forma.get('aplica_a').reset();
    this.forma.get('aplica_a').enable();
    this.forma.get('analitico').setValue({label: 'No', value: 'no'});
    this.forma.get('catalogo').setValue({label: 'No', value: 'no'});
    this.forma.get('depto').setValue({label: 'No', value: 'no'});
    this.forma.get('nivel').setValue({label: 'Control', value: 1});
    this.forma.get('selectivo_consumo').setValue({label: 'No', value: 'no'});
    this.forma.get('retencion').setValue({label: 'No', value: 'no'});
    this.forma.get('referencia').setValue({label: 'No', value: 'no'});
    this.forma.get('estado').setValue('activo');
    this.forma.get('usuario_creador').setValue(this.usuario.username);
  }

  verificaDescripcion(data){  
    if (data === "") {
      this.descripExiste = 3;
      return;
    }
    let param = {'descripcion': data};
    this.descripExiste = 0;
    this.catalogoServ.busqueda(param).then((resp: any)=>{
      if(resp.length === 0) {
        this.descripExiste = 1;
      }else{
        this.descripExiste = 2;
      }
    })
  }

  verificaCuenta(data){  
     
    if (data === "") {
      this.cuentaExiste = 3;
      return;
    }
    this.cuentaExiste = 0;
    this.catalogoServ.busquedaCatalogo(data).then((resp: any)=>{
      if (this.isControl) {
        this.cuentaAplicaExiste = 1;
        this.forma.get('aplica_a').setValue(Number(data));
      }
      if(resp.length === 0) {
        this.cuentaExiste = 1;
      }else{
        this.cuentaExiste = 2;
      }
    })
  }

  verificaCuentaAplica(data){      
    if (data === "") {
      this.cuentaAplicaExiste = 3;
      return;
    }
    this.cuentaAplicaExiste = 0;
    this.catalogoServ.busquedaCatalogo(data).then((resp: any)=>{     
      if(resp.length === 0) {
        this.cuentaAplicaExiste = 2;
      }else{
        this.cuentaAplicaExiste = 1;
      }
    })
  }

  cuentaControl(data: any) {    
    if (data.value === 1) {
      this.isControl = true;
      this.forma.get('aplica_a').disable();
    } else {
      this.isControl = false;
      this.forma.get('aplica_a').enable();
    }
    this.forma.get('aplica_a').reset();
    this.cuentaAplicaExiste = 3;
  }

  getNoValido(input: string) {
    return this.forma.get(input).invalid && this.forma.get(input).touched;
  }

}
