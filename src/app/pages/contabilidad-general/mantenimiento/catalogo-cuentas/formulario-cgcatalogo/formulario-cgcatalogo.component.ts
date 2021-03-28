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
  guardando = false;
  transportistaExiste = 3;
  cuentaExiste = 3;
  cuentaAplicaExiste = 3;
  zonas: any[] = [];
  onLabel = 'Resumen Analítico';
  onIcon = 'pi pi-check';
  codigosRetencion: any[] = [];
  descripExiste = 3
  isControl = true;

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

  ngOnInit(): void {
    this.forma.get('aplica_a').disable();

    this.catalogoServ.codigosRetencion().then((resp: any) => {
      this.codigosRetencion = resp;
    })

    this.zonasServ.getDatos().then((resp: any) => {
      this.zonas = resp;
    })
  }

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
      codigo_isr:        ['XXXXXX', Validators.required],
      cuenta_resultado:  [''],
      
      estado_bg:         ['XXXXXX', Validators.required],
      estado_resultado:  ['XXXXXX', Validators.required],
      estado_a:          ['XXXXXX', Validators.required],
      estado_m:          ['XXXXXX', Validators.required],
      estado:            ['activo', Validators.required],
      codigo_estado:     ['XXXXXX', Validators.required],
      usuario_creador:   [this.usuario.username, Validators.required]
    })
  }

  guardarCatalogo(){
    this.guardando = true;
    if (this.forma.invalid) {       
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios');      
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
      })
    }else{   
      switch (this.descripExiste) {
        case 0:
          this.uiMessage.getMiniInfortiveMsg('tst','info','Espere','Verificando disponibilidad de nombre');
          this.guardando = false;
          break;

        case 2:
          this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Existe una categoria con este nombre');
          this.guardando = false;
          break;

        default:
          this.catalogoServ.crearCgcatalogos(this.forma.value).then((resp: any)=>{
            if (resp) {
              this.forma.get('descripcion').reset();
              this.forma.get('nivel').reset();
              this.forma.get('cuenta_no').reset();
              this.forma.get('aplica_a').reset();
              this.guardando = false;
              this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente',"Cuenta Guarda exitosamente!!");  
            }               
          })
          break;
      } 
    }
  }
  
  ActualizarCatatalogo(){

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
    let param = {'cuenta_no': data};
    this.cuentaExiste = 0;
    this.catalogoServ.busquedaCatalogo(param).then((resp: any)=>{
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
    let param = {'cuenta_no': data};
    this.cuentaAplicaExiste = 0;
    this.catalogoServ.busquedaCatalogo(param).then((resp: any)=>{     
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
