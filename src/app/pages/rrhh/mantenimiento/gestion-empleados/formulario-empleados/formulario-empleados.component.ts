import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DialogService } from 'primeng/dynamicdialog';
import { DatosEstaticosService } from 'src/app/services/datos-estaticos.service';
import { PuestosService } from 'src/app/services/puestos.service';
import { RrhhService } from 'src/app/services/rrhh.service';
import { UiMessagesService } from 'src/app/services/ui-messages.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { StepEmpleadosComponent } from '../step-empleados/step-empleados.component';

@Component({
  selector: 'app-formulario-empleados',
  templateUrl: './formulario-empleados.component.html',
  styleUrls: ['./formulario-empleados.component.scss']
})
export class FormularioEmpleadosComponent implements OnInit {

  forma: FormGroup;
  guardando = false;
  selectedMultiMoneda: any[] = [];
  selectedMulti: any[] = [];
  empleadoFiltrados: any[];
  usuario: any;
  imgURLUser = null;
  imgUser = null;
  message: string;
  imagePathUser: any;
  minDate: Date;
  monedas: any;
  paises: any;
  empresa: any;
  puestos: any[] = [];
  puestosFiltrados: any[];
  paisesFiltrados: any[];
  supervisoresFiltrados: any[];
  departamento: any[] = [];
  supervisores: any[] = [];
  bancos: any[] = [];

  educacion = [
    { label: 'ninguna', value: 'Ninguna' },
    { label: 'basica', value: 'Basica' },
    { label: 'bachiller', value: 'Bachiller' },
    { label: 'tecnico', value: 'Técnico' },
    { label: 'universitario', value: 'Universitario' },
    { label: 'maestria', value: 'Maestria' },
    { label: 'postgrado', value: 'Postgrado' },
    { label: 'doctorado', value: 'Doctorado' }
  ] 

  estado_civil = [
    { label: 'Soltero/a', value: 'soltero'},
    { label: 'Casado/a', value: 'casado'},
    { label: 'Divorciado/a', value: 'divorciado'},
    { label: 'Viudo/a', value: 'viudo'},
    { label: 'Union Libre', value: 'union-libre'}
  ] 

  tipo_empleado = [
    { label: 'Fijo', value: 'fijo'},
    { label: 'Temporal', value: 'temporal'},
    { label: 'Contratista', value: 'contratista'},
    { label: 'Viudo/a', value: 'viudo'},
    { label: 'Union Libre', value: 'union-libre'}
  ] 

  tipo_sangre = [
    { label: 'O+', value:'O+'},
    { label: 'O-', value:'O-'},
    { label: 'A+', value:'A+'},
    { label: 'A-', value:'A-'},
    { label: 'B+', value:'B+'},
    { label: 'B-', value:'B-'},
    { label: 'AB+', value:'AB+-'},
    { label: 'AB-', value:'AB-'},
  ] 

  sino = [
    { label: 'Si', value:'si'},
    { label: 'No', value:'no'},
  ] 

  sexo = [
    { label: 'Masculino', value:'masculino'},
    { label: 'Femenino', value:'femenino'},
  ] 

  tipo_sueldo = [
    { label: 'Quincenal', value:'quincenal'},
    { label: 'Mensual', value:'mensual'},    
    { label: 'Ajuste', value:'ajuste'},
  ] 

  estado = [
    { label: 'Activo', value:'activo'},
    { label: 'Inactivo', value:'inactivo'},
  ] 

  horario = [
    { label: 'matutino', value:'Matutino'},
    { label: 'vespertino', value:'Vespertino'},
    { label: 'nocturno', value:'Nocturno'},
    { label: 'rotativo', value:'Rotativo'},
  ] 

  listSubscribers: any = [];

  ngOnDestroy(): void {
    this.listSubscribers.forEach(a => a.unsubscribe());
  }

  constructor(private fb: FormBuilder,
              private usuariosServ: UsuarioService,
              private uiMessage: UiMessagesService,
              private empleadosServ: RrhhService,           
              public dialogService: DialogService,
              private puestosServ: PuestosService,
              private datosEstaticosServ: DatosEstaticosService) {     
    this.usuario = this.usuariosServ.getUserLogged();
    this.crearFormulario();
   }

  ngOnInit(): void {
    this.setMinDate();
    this.rangoAnio();
    this.listObserver();
    this.getBancos();
    
    this.empleadosServ.autoLlenado().then((resp: any) => {
      resp.forEach(element => {
        switch (element.label) {
          case 'puestos':
            this.puestos = element.data;
            break;

          case 'departamento':
            this.departamento = element.data;
            break;

          case 'monedas':
            this.monedas = element.data;
            break;

          case 'empresa':
            this.empresa = element.data;
            break;

          case 'paises':
            this.paises = element.data;
            break;

          default:
            break;
        }
      });  
      this.autollenado(resp);    
    })
  }
  
  listObserver = () => {
    const observer1$ = this.puestosServ.puestoGuardada.subscribe((resp: any)=>{
      this.puestos.push(resp);
    })

    this.listSubscribers = [observer1$];
  };

  getBancos() {
    this.empleadosServ.getBancos().then((resp: any) =>{
      this.bancos = resp;
    })
  }
  rangoAnio() {
    const today = new Date();
    const date = today.getFullYear();
    let rangoanio = `1900:${date}`;
    return rangoanio;    
  }

  autollenado(data) {
    let existe = null;
    data.forEach(element => {            
      if (element.data.length === 0) {
        existe = true;
      }
    });
    if (existe === true) {
      const ref = this.dialogService.open(StepEmpleadosComponent, {
        data,
        closeOnEscape: false,
        header: 'Datos Necesarios',
        width: '70%'
      });  
    }
  }

  guardarEmpleado() {
    // this.guardando = true;    
    console.log(this.forma);    
    if (this.forma.invalid) {  
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios');
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
      })
      this.guardando = false;
    }else{ 
      this.empleadosServ.crearEmpleado(this.forma.value).then(() => {
        this.uiMessage.getMiniInfortiveMsg('tst','error','Excelente','Empleado creado de manera correcta');        
      })
      this.guardando = false;
    } 
  }
  
  previewUserPhoto(files) {    
    if (files.length === 0)
      return;
 
    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Solo puede escoger imagenes";
      return;
    }

    this.forma.controls['foto_empleado'].setValue(files[0])
    
    var reader = new FileReader();
    this.imagePathUser = files;
    reader.readAsDataURL(files[0]); 
    reader.onload = (_event) => { 
      this.imgURLUser = reader.result;       
    }
  }

  crearFormulario() {
    this.forma = this.fb.group({      
      foto_empleado: [""],
      nom1_emp: ["valentin", Validators.required],
      nom2_emp: ["antonio"],
      apell1_emp: ["rodriguez", Validators.required],
      apell2_emp: ["martinez"],      
      cedula: ["22500192319", Validators.required],
      telefono: ["(809)-859-8542", Validators.required],
      email: ["asdad@dfdf.com"],
      licencia: ["234234"],
      cod_tss: ["234234"],
      nomina: ["23"],
      sueldo_ac: ["ssdfsfd", Validators.required],
      tasa: ["2323"], //
      cuenta_fi: ["2323"],
      codigo_es: ["234234"], //
      codigo_retiro_bco: ["345435"],
      cuenta_no: ["234"],
      calle: ["asdads", Validators.required],
      casa_num: ["67", Validators.required],
      barrio: ["zfzxfsadf", Validators.required],
      urbanizacion: ["asdfadsfasdf", Validators.required],
      is_sup: ["", Validators.required],
      departamento: ["", Validators.required],
      cod_puesto: ["", Validators.required],
      nivel_emp: ["", Validators.required],
      educacion: ["", Validators.required], //
      num_emp_supervisor: [""],

      fech_nac: ["", Validators.required],
      id_pais: ["", Validators.required],
      cod_nac: [""],
      estado_civil: ["", Validators.required],
      tipo_sangre: [""],
      fech_efec: ["", Validators.required],
      paga_seg: ["", Validators.required],
      tipo_sueldo: ["", Validators.required],
      
      observacion: [""],  
      credito: [""],
      sucid: ["", Validators.required],
      sexo: ["", Validators.required], //
      poncha: ["", Validators.required], //
      moneda: ["", Validators.required],
      fecha_salida: [""],
      tipocuenta: [""],
      codbancodestino: [""],
      digiverbancodestino: [""],
      genera_file_bco: [""],
      fecha_ultimo_aumento: [""],
      fecha_termino_c: [""],
      
      tipo_empleado: ["", Validators.required],
      horario: ["", Validators.required],
      horario_inicial: ["", Validators.required],
      horario_final: ["", Validators.required],
      serie: [""],
      cod_seg1: [""],
      cod_seg2: [""],
      cod_seg3: [""],
      monto_seg_med: [""],
      monto_seg_int: [""],
      monto_care: [""],
      instalador: [""],
      cuenta_aux: [""],
      cuenta_out: [""],
      departamento_out: [""],
      retiro_comercial: [""],
      estado_legal: [""],      
      fecha_suspension: [""],
      fecha_valido_retiro: [""],
      monto_retiro: [""],
      estado:          ['activo', Validators.required],
      usuario_creador: [this.usuario.username, Validators.required]
    })
  }

  filtrarPuesto(event) {
    const filtered: any[] = [];
    const query = event.query;
    for (let i = 0; i < this.puestos.length; i++) {
      const size = this.puestos[i];
      if (size.titulo.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(size);
      }
    }
    this.puestosFiltrados = filtered;
  }

  filtrarEmpleado(event) {
    const filtered: any[] = [];
    const query = event.query;
    for (let i = 0; i < this.puestos.length; i++) {
      const size = this.puestos[i];
      if (size.primernombre.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(size);
      }
    }
    this.empleadoFiltrados = filtered;
  }

  filtrarPais(event) {
    const filtered: any[] = [];
    const query = event.query;
    for (let i = 0; i < this.paises.length; i++) {
      const size = this.paises[i];            
      if (size.gentilicio.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(size);
      }
    }
    this.paisesFiltrados = filtered;
  }

  filtrarSupervisor(event) {
    const filtered: any[] = [];
    const query = event.query;
    for (let i = 0; i < this.supervisores.length; i++) {
      const size = this.supervisores[i];            
      if (size.primernombre.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(size);
      }
    }
    this.supervisoresFiltrados = filtered;    
  }

  onSelectDate(event, campo:string) {
    let d = new Date(Date.parse(event));
    this.forma.get(campo).setValue(`${d.getFullYear()}/${d.getMonth()+1}/${d.getDate()}`);
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

  setValueMoneda() {
    this.selectedMultiMoneda = this.forma.get("moneda").value   
  }

  buscaSupervisor(id:string) {
    this.empleadosServ.buscaSupervisores(id).then((resp: any) => {
      this.supervisores = resp;
    })
  }

  getNoValido(input: string) {
    return this.forma.get(input).invalid && this.forma.get(input).touched;
  }

}
