import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { DatosEstaticosService } from 'src/app/services/datos-estaticos.service';
import { PaisesCiudadesService } from 'src/app/services/paises-ciudades.service';
import { PuestosService } from 'src/app/services/puestos.service';
import { RrhhService } from 'src/app/services/rrhh.service';
import { SucursalesService } from 'src/app/services/sucursales.service';
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
  empresa: any;
  formSubmitted = false;
  listSubscribers: any = [];
  puestos: any[] = [];
  puestosFiltrados: any[];
  paisesFiltrados: any[];
  supervisoresFiltrados: any[];
  departamento: any[] = [];
  supervisores: any[] = [];
  bancos: any[] = [];
  rutaActual: string[];
  items: any = [];
  educacion = [] 
  estado_civil = [] 
  tipo_empleado = [] 
  tipo_sangre = [] 

  paises: any[] = [];
  regiones: any[] = [];
  provincias: any[] = [];
  municipios: any[] = [];
  sectores: any[] = [];
  ciudades: any[] = [];
  horario: any[] = [];
  sucursales: any[] = [];

  sino = [
    { label: 'Si', value:'si'},
    { label: 'No', value:'no'},
  ] 

  sexo = [
    { label: 'Masculino', value:'M'},
    { label: 'Femenino', value:'F'},
  ] 

  tipo_sueldo = [
    { label: 'Quincenal', value:'Q'},
    { label: 'Mensual', value:'M'},    
    { label: 'Ajuste', value:'A'},
  ] 

  estado = [
    { label: 'Activo', value:'activo'},
    { label: 'Inactivo', value:'inactivo'},
  ] 

  ngOnDestroy(): void {
    this.listSubscribers.forEach(a => a.unsubscribe());
  }

  constructor(private fb: FormBuilder,
              private usuariosServ: UsuarioService,
              private uiMessage: UiMessagesService,
              private empleadosServ: RrhhService,           
              public dialogService: DialogService,
              private puestosServ: PuestosService,
              private router: Router,
              private sucursalesServ: SucursalesService,
              private paisesCiudadesServ: PaisesCiudadesService,
              private datosEstaticosServ: DatosEstaticosService) {     
    this.usuario = this.usuariosServ.getUserLogged();
    this.crearFormulario();
   }

  ngOnInit(): void {
    this.rutaActual = this.router.url.split("/");
    console.log(this.rutaActual);
    this.setMinDate();
    this.rangoAnio();
    this.listObserver();
    
    this.empleadosServ.autoLlenado().then((resp: any) => {
      console.log(resp);
      
      resp.forEach(element => {
        if (element.data.length === 0) {
          this.items.push({label: this.datosEstaticosServ.capitalizeFirstLetter(element.label), routerLink: element.label})
        }
        switch (element.label) {
          case 'horarios':
            this.horario = element.data;
            break;
        
          case 'puestos':
            this.puestos = element.data;
            break;

          case 'departamento':
            this.departamento = element.data;
            break;

          case 'monedas':
            this.monedas = element.data;
            break;
            
          // case 'sucursal':
          //   this.sucursales = element.data;
          //   break;
          
          case 'empresas':
            this.empresa = element.data;
            if (this.empresa.length === 1) {
              console.log(this.empresa[0]);
              this.forma.get("cod_cia").setValue(this.empresa[0])
              this.buscaSucursales(this.empresa[0].cod_cia)
            }
            break;
          
          case 'paises':
            this.paises = element.data;
            break;

          case 'bancos':
            this.bancos = element.data;
            break;

          case 'educacion':
            this.educacion = element.data;
            break;

          case 'estadoCivil':
            this.estado_civil = element.data;
            break;

          case 'tipoEmpleado':
            this.tipo_empleado = element.data;
            break;

          case 'tipoSangre':
            this.tipo_sangre = element.data;
            break;
            
          default:
            break;
        }
      });     
    })
  }
  
  listObserver = () => {
    const observer1$ = this.puestosServ.puestoGuardada.subscribe((resp: any)=>{
      this.puestos.push(resp);
    })

    const observer5$ = this.puestosServ.formSubmitted.subscribe((resp) => {
      this.formSubmitted = resp;
    })

    this.listSubscribers = [observer1$,observer5$,observer5$];
  };

  rangoAnio() {
    const today = new Date();
    const date = today.getFullYear();
    let rangoanio = `1900:${date}`;
    return rangoanio;    
  }

  guardarEmpleado() {
    this.formSubmitted = true;
    console.log(this.forma);
    
    if (this.forma.invalid) {  
      this.formSubmitted = false;
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios');
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
      })
       
    }else{ 
      this.empleadosServ.crearEmpleado(this.forma.value).then(() => {
        this.uiMessage.getMiniInfortiveMsg('tst','error','Excelente','Registro creado de manera correcta');        
      })       
    } 
  }
    
  buscaRegion(event) {
      this.paisesCiudadesServ.buscaRegion(event).then((resp:any) => {  
      this.regiones = resp;
    })   
  }

  buscaProvincia(event) {
      this.paisesCiudadesServ.buscaProvincias(event).then((resp:any) => {  
      this.provincias = resp;
    })   
  }

  buscaMunicipio(event) {
    this.paisesCiudadesServ.buscaMunicipios(event).then((resp:any) => {  
      this.municipios = resp;
    })   
  }
 
  buscaCiudad(event) {
    this.paisesCiudadesServ.buscaCiudad(event).then((resp:any) => { 
      this.ciudades = resp;
    })   
  }

  buscaSector(event) {
    this.paisesCiudadesServ.buscaSector(event).then((resp:any) => {  
      this.sectores = resp;
    })   
  }

  buscaSucursales(cod_cia) {  
    this.formSubmitted = true;
    this.sucursalesServ.busquedaXempresa(cod_cia).then((resp: any) => {
      this.sucursales = resp; 
    })
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
      telefono: ["(666)-666-6666", Validators.required],
      email: ["asdad@dfdf.com"],
      licencia: ["234234", Validators.required],
      cod_tss: ["234234"],
      nomina: ["23"],
      sueldo_ac: ["", Validators.required],
      tasa: ["2323"], //
      id_pais: ["", Validators.required],
      id_region: ["", Validators.required],
      id_provincia: ["", Validators.required],
      id_municipio: ["", Validators.required],
      id_ciudad: ["", Validators.required],
      id_sector: [""],
      cuenta_fi: ["2323"],
      codigo_es: ["234234"], //
      codigo_retiro_bco: ["345435"],
      cuenta_no: ["234"],
      calle: ["asdads", Validators.required],
      barrio: ["zfzxfsadf", Validators.required],
      is_sup: ["", Validators.required],
      departamento: ["", Validators.required],
      cod_puesto: ["", Validators.required],
      nivel_emp: ["", Validators.required],
      educacion: ["", Validators.required], //
      num_emp_supervisor: [""],
      cod_cia: ["", Validators.required],
      fech_nac: ["", Validators.required],
      cod_nac: [""],
      estado_civil: ["", Validators.required],
      tipo_sangre: [""],
      fech_efec: ["", Validators.required],
      paga_seg: ["", Validators.required],
      tipo_sueldo: ["", Validators.required],
      nacionalidad: ["", Validators.required],
      observacion: [""],  
      credito: [""],
      sucid: ["", Validators.required],
      sexo: ["", Validators.required], //
      poncha: ["", Validators.required], //
      moneda: ["", Validators.required],
      tipocuenta: [""],
      codbancodestino: [""],
      digiverbancodestino: [""],
      genera_file_bco: [""],
      fecha_ultimo_aumento: [""],
      fecha_inicio_c: [""],
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

  onSelectDate(event, campo: string) {
    let d = new Date(Date.parse(event));
    const fecha1 = new Date(this.forma.get('fecha_inicio_c').value);
    let fecha2 = new Date(this.forma.get('fecha_termino_c').value);
    const fecha3 = new Date(this.forma.get('fecha_ultimo_aumento').value);
    
    if (campo === 'fecha_termino_c') {
      const diferencia = this.datosEstaticosServ.getDiffMilliseconds(fecha1, fecha2);
      if (diferencia < 0) {
        this.uiMessage.getMiniInfortiveMsg('tst', 'warn', 'Atencion', 'La fecha de salida no puede ser menor a la fecha de contratacion.');
        this.forma.get('fecha_termino_c').setValue('');
        return;
      }      
    }

    if (campo === 'fecha_ultimo_aumento') {
      if (this.forma.get('fecha_termino_c').value === '') {
        fecha2 = null;
      }
      const diferencia = this.datosEstaticosServ.isBetweenDate(fecha1, fecha2, fecha3);
      console.log(diferencia);
      if (diferencia < 0) {
        this.uiMessage.getMiniInfortiveMsg('tst', 'warn', 'Atencion', 'La fecha de aumento debe ser mayor a la de contrato.');
      }
      
      if (diferencia === false) {
        this.uiMessage.getMiniInfortiveMsg('tst', 'warn', 'Atencion', 'La fecha de aumento debe entre la de contrato y la de salida.');
      }   
    }
    this.forma.get(campo).setValue(this.datosEstaticosServ.getDateTimeFormated(d));
  }

  fechaNacimiento(event) {
    let d = new Date(Date.parse(event));
    const edad = this.datosEstaticosServ.getYearsOld(d);

    if (edad < 18) {
      const title = 'Atención!';
      const text = 'Esta persona es menor de edad, desea continuar?'
      const res = this.uiMessage.getSweetMessageOk(title, text).then((result) => {
        if (result.isDenied) {          
          this.forma.get('fech_nac').setValue('');
          return;
        }
      })     
    }
    this.forma.get('fech_nac').setValue(`${d.getFullYear()}/${d.getMonth()+1}/${d.getDate()}`);
  }

  setHorarios(data) {
    console.log(data);
    this.forma.get('horario_inicial').setValue(new Date(data.value.horario_inicial));
    this.forma.get('horario_final').setValue(new Date(data.value.horario_final));
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
