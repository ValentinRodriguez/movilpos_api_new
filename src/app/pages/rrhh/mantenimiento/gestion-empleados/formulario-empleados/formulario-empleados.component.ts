import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { DatosEstaticosService } from 'src/app/services/globales/datos-estaticos.service';
import { GlobalFunctionsService } from 'src/app/services/globales/global-functions.service';
import { PaisesCiudadesService } from 'src/app/services/globales/paises-ciudades.service';
import { RrhhService } from 'src/app/services/rrhh/rrhh.service';
import { SucursalesService } from 'src/app/services/mi-empresa/sucursales.service';
import { UiMessagesService } from 'src/app/services/globales/ui-messages.service';


@Component({
  selector: 'app-formulario-empleados',
  templateUrl: './formulario-empleados.component.html',
  styleUrls: ['./formulario-empleados.component.scss'],
  providers:[RrhhService,SucursalesService,PaisesCiudadesService]
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
  cuentasFiltradas: any[] = [];
  cuentas: any[] = [];
  paises: any[] = [];
  regiones: any[] = [];
  provincias: any[] = [];
  municipios: any[] = [];
  sectores: any[] = [];
  ciudades: any[] = [];
  turno: any[] = [];
  sucursales: any[] = [];
  areas: any[] = [];
  guardar = true;
  actualizar = false;
  id: number;

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
  cedulaExiste: number;

  ngOnDestroy(): void {
    this.listSubscribers.forEach(a => a.unsubscribe());
  }

  constructor(private globalFunction: GlobalFunctionsService,
              private fb: FormBuilder,              
              private uiMessage: UiMessagesService,
              private empleadosServ: RrhhService,           
              public dialogService: DialogService,
              private router: Router,
              private sucursalesServ: SucursalesService,
              private paisesCiudadesServ: PaisesCiudadesService,
              private datosEstaticosServ: DatosEstaticosService) {     
    ;
    this.crearFormulario();
   }

  ngOnInit(): void {
    this.rutaActual = this.router.url.split("/");
    this.setMinDate();
    this.rangoAnio();
    this.listObserver();
    
    this.empleadosServ.autoLlenado().then((resp: any) => {      
      resp.forEach(element => {
        if (element.data.length === 0) {
          this.items.push({label: this.datosEstaticosServ.capitalizeFirstLetter(element.label), routerLink: element.label})
        }
        switch (element.label) {
          case 'horarios':
            this.turno = element.data;
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
              this.forma.get("cod_cia").setValue(this.empresa[0])
              this.buscaSucursales(this.empresa[0].cod_cia)
            }
            break;
            
          case 'cuentas':
              this.cuentas = element.data;
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
            
            case 'areas':
              this.areas = element.data;
              break;
            
          default:
            break;
        }
      });     
    })
  }
  
  listObserver = () => {

    const observer2$ = this.globalFunction.finalizar.subscribe((resp) => {
      this.items = [];
    })

    const observer3$ = this.empleadosServ.actualizar.subscribe((resp: any) =>{
      this.guardar = false;
      this.actualizar = true;    
      this.id = Number(resp);      
      this.empleadosServ.getDato(this.id).then((res: any) => {
        
        this.datosLocalidad(res);
        this.llenaCampos(res);
      })
    })

    const observer4$ = this.empleadosServ.duplicar.subscribe((resp: any) =>{    
      this.id = Number(resp);      
      this.empleadosServ.getDato(this.id).then((res: any) => {        
        this.datosLocalidad(res);
        this.llenaCampos(res) 
      })
    })
    this.listSubscribers = [observer2$,observer3$,observer4$];
  };

  llenaCampos(res) {
    for(const [key, value] of Object.entries(res)){
      if (this.forma.get(key) !== null && value !== null && key !== 'cedula') {
        if (key === 'fecha_entrada' || key === 'fecha_inicio_c' || key === 'fecha_nacimiento' || key === 'fecha_suspencion' ||
          key === 'fecha_termino_contrato' || key === 'fecha_ultimo_aumento' || key === 'horario_inicial' || key === 'horario_final') {
            this.forma.get(key).setValue(new Date(value.toString()));
          } else {
          this.forma.get(key).setValue(value);
        }
      } 
    }
    this.forma.get('educacion').setValue(this.educacion.find(data => data.id == res.educacion));
    this.forma.get('cod_nac').setValue(this.paises.find(pais => pais.id_pais == res.cod_nac));
    this.forma.get('tipo_sangre').setValue(this.tipo_sangre.find(data => data.id == res.tipo_sangre));
    this.forma.get('sexo').setValue(res.sexo);
    this.forma.get('turno').setValue(this.turno.find(data => data.id == res.turno));
    this.forma.get('estado_civil').setValue(this.estado_civil.find(data => data.id == res.estado_civil));
    this.forma.get('paga_seg').setValue(res.paga_seg);
    this.forma.get('tipo_empleado').setValue(this.tipo_empleado.find(data => data.id == res.tipo_empleado));
    this.forma.get('id_puesto').setValue(this.puestos.find(data => data.id == res.id_puesto));
    this.forma.get('cod_cia').setValue(this.empresa.find(empresa => empresa.cod_cia == res.cod_cia));
    this.forma.get('suc_id').setValue(this.sucursales.find(data => data.id == res.suc_id));
    this.forma.get('departamento').setValue(this.departamento.find(data => data.id == res.departamento));
    // this.forma.get('num_emp_supervisor').setValue(this.supervisores.find(data => data.id == res.id));
    this.forma.get('area').setValue(this.areas.find(data => data.id == res.area));
    this.forma.get('id_moneda').setValue(this.monedas.find(data => data.id == res.id_moneda));
    this.forma.get('codbancodestino').setValue(this.bancos.find(banco => banco.id == res.codbancodestino));
    this.forma.get('cuenta_no').setValue(this.cuentas.find(data => data.id == res.cuenta_no));
    // this.forma.get('retiro_comercial').setValue(res.retiro_comercial);
    this.forma.get('tipo_sueldo').setValue(res.tipo_sueldo);
    this.forma.get('id_pais').setValue(this.paises.find(pais => pais.id_pais == res.id_pais)); 
  }

  rangoAnio() {
    const today = new Date();
    const date = today.getFullYear();
    let rangoanio = `1900:${date}`;
    return rangoanio;    
  }

  guardarEmpleado() {
    // this.
    
    
    if (this.forma.invalid) {
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios');
      Object.values(this.forma.controls).forEach(control =>{           
        control.markAllAsTouched();
      })       
    }else{ 
      if (this.cedulaExiste === 2) {
        this.uiMessage.getMiniInfortiveMsg('tst', 'warn', 'Atención', 'Ya existe un empleado registrado con este numero de cédula.');
        return;
      } else {
        this.empleadosServ.crearEmpleado(this.forma.value).then(() => {
          this.uiMessage.getMiniInfortiveMsg('tst', 'success', 'Excelente', 'Registro creado de manera correcta');
        });
      }
    } 
  }
    
  actualizarEmpleado() {
     // this.
    
    
    if (this.forma.invalid) {
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios');
      Object.values(this.forma.controls).forEach(control =>{           
        control.markAllAsTouched();
      })       
    }else{ 
      this.empleadosServ.actualizarEmpleado(this.id, this.forma.value).then(() => {
        this.uiMessage.getMiniInfortiveMsg('tst', 'success', 'Excelente', 'Registro creado de manera correcta');
      });
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

    this.forma.controls['img_empleado'].setValue(files[0])
    
    var reader = new FileReader();
    this.imagePathUser = files;
    reader.readAsDataURL(files[0]); 
    reader.onload = (_event) => { 
      this.imgURLUser = reader.result;       
    }
  }

  crearFormulario() {
    this.forma = this.fb.group({      
      calle: ["", Validators.required],
      cedula: ["", Validators.required],
      cod_cia: ["", Validators.required],
      cod_nac: [""],
      cod_tss: ["", Validators.required],
      codbancodestino: [""],
      codigo_es: [""],
      codigo_retiro_bco: [""],
      credito: [""],
      cuenta_fi: [""],
      cuenta_no: [""],
      departamento: ["", Validators.required],
      digiverbancodestino: [""],
      educacion: [""],
      email: [""],
      estado_civil: [""],
      estadolegal: [""],      
      fecha_entrada: ["", Validators.required],
      fecha_inicio_c: ["", Validators.required],
      fecha_nacimiento: ["", Validators.required],
      fecha_suspencion: [""],
      fecha_termino_contrato: [""],
      fecha_ultimo_aumento: [""],
      img_empleado: [""],
      tipo_sueldo: ["", Validators.required],
      area: ["", Validators.required],
      id_ciudad: ["", Validators.required],
      id_moneda: ["", Validators.required],
      id_municipio: ["", Validators.required],
      id_pais: [, Validators.required],
      id_provincia: ["", Validators.required],
      id_puesto: ["", Validators.required],
      id_region: ["", Validators.required],
      id_sector: [""],
      is_sup: ["", Validators.required],
      licencia: ["", Validators.required],
      monto_adicional: [""],
      no_cuenta_banco: [""],
      nomina: ["", Validators.required],
      // num_emp_supervisor: [""],
      observacion: [""],  
      horario_inicial: [{value: '', disabled: true}],
      horario_final: [{value: '', disabled: true}],
      paga_seg: ["", Validators.required],
      poncha: ["", Validators.required],
      primerapellido: ["", Validators.required],
      primernombre: ["", Validators.required],
      // retiro_comercial: [""],
      segundoapellido: [""],      
      segundonombre: [""],
      sexo: ["", Validators.required],
      suc_id: ["", Validators.required],
      sueldo: ["", Validators.required],
      tasa: [""],
      telefono: ["", Validators.required],
      tipo_empleado: ["", Validators.required],
      tipo_sangre: [""],
      tipocuenta: [""],
      turno: ["", Validators.required],
      
      // cod_seg1: [""],
      // cod_seg2: [""],
      // cod_seg3: [""],
      // genera_file_bco: [""],
      // nivel_emp: ["", Validators.required],
      // monto_seg_med: [""],
      // monto_seg_int: [""],
      // monto_care: [""],
      // instalador: [""],
      // cuenta_aux: [""],
      // cuenta_out: [""],
      // departamento_out: [""],
      // fecha_valido_retiro: [""],
      // monto_retiro: [""],
      estado:          ['activo', Validators.required]
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

  filtrarCuentas(event) {
    const filtered: any[] = [];
    const query = event.query;
    for (let i = 0; i < this.cuentas.length; i++) {
      const size = this.cuentas[i];
      if (size.descripcion.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(size);
      }
    }
    this.cuentasFiltradas = filtered;
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
    let fecha2 = new Date(this.forma.get('fecha_termino_contrato').value);
    const fecha3 = new Date(this.forma.get('fecha_ultimo_aumento').value);
    
    if (campo === 'fecha_termino_contrato') {
      const diferencia = this.datosEstaticosServ.getDiffMilliseconds(fecha1, fecha2);
      if (diferencia < 0) {
        this.uiMessage.getMiniInfortiveMsg('tst', 'warn', 'Atención', 'La fecha de salida no puede ser menor a la fecha de contratacion.');
        this.forma.get('fecha_termino_contrato').setValue('');
        return;
      }      
    }

    if (campo === 'fecha_ultimo_aumento') {
      if (this.forma.get('fecha_termino_contrato').value === '') {
        fecha2 = null;
      }
      const diferencia = this.datosEstaticosServ.isBetweenDate(fecha1, fecha2, fecha3);
      if (diferencia < 0) {
        this.uiMessage.getMiniInfortiveMsg('tst', 'warn', 'Atención', 'La fecha de aumento debe ser mayor a la de contrato.');
      }
      
      if (diferencia === false) {
        this.uiMessage.getMiniInfortiveMsg('tst', 'warn', 'Atención', 'La fecha de aumento debe entre la de contrato y la de salida.');
      }   
    }
    
    if (campo === 'fecha_suspencion' || campo === 'fecha_termino_contrato' || campo === 'fecha_ultimo_aumento' || campo === 'fecha_entrada') {
      let d = new Date(Date.parse(event));
      let entrada = new Date(Date.parse(this.forma.get('fecha_entrada').value));
      const diferencia = this.datosEstaticosServ.getDiffMilliseconds(entrada, d);
      let temp = '';
      switch (campo) {
        case 'fecha_suspencion':
          temp = 'fecha de suspención';
          break;

        case 'fecha_termino_contrato':
          temp = 'fecha de término de contrato';
          break;

        case 'fecha_ultimo_aumento':
          temp = 'fecha de aumento';
          break;

        default:
          break;
      }
      if (diferencia < 0) {
        this.uiMessage.getMiniInfortiveMsg('tst', 'warn', 'Atención', `La ${temp} no puede ser menor a la de entrada.`);
        this.forma.get(campo).setValue('');
        return;
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
          this.forma.get('fecha_nacimiento').setValue('');
          return;
        }
      })     
    }
    this.forma.get('fecha_nacimiento').setValue(`${d.getFullYear()}/${d.getMonth()+1}/${d.getDate()}`);
  }

  verificaCedula(data) {
    if (data === "") {
      this.cedulaExiste = 3;
      return;
    }
    this.cedulaExiste = 0;
    this.empleadosServ.busquedaCedula(data).then((resp: any)=>{
      if(resp.length === 0) {
        this.cedulaExiste = 1;
      }else{
        this.cedulaExiste = 2;
        this.uiMessage.getMiniInfortiveMsg('tst', 'warn', 'Atención', 'Ya existe un empleado registrado con este numero de cédula.');
      }
    })
  }

  setHorarios(data) {
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
    this.selectedMultiMoneda = this.forma.get("id_moneda").value   
  }

  buscaSupervisor(id:string) {
    this.empleadosServ.buscaSupervisores(id).then((resp: any) => {
      this.supervisores = resp;
    })
  }
  
  datosLocalidad(data) {
        
           
    this.paisesCiudadesServ.buscaRegion(data.id_pais).then((resp:any) => { 
      this.regiones = resp;      
      this.forma.get('id_region').setValue(this.regiones.find(region => region.id_region == data.id_region));
   
      this.paisesCiudadesServ.buscaProvincias(data.id_region).then((resp: any) => {
        this.provincias = resp;
        this.forma.get('id_provincia').setValue(this.provincias.find(provincia => provincia.id_provincia == data.id_provincia));
      
        this.paisesCiudadesServ.buscaMunicipios(data.id_provincia).then((resp: any) => {
          this.municipios = resp;
          this.forma.get('id_municipio').setValue(this.municipios.find(municipio => municipio.id_municipio == data.id_municipio));

          this.paisesCiudadesServ.buscaCiudad(data.id_municipio).then((resp: any) => {
            if (data.length !== 0) {
              this.ciudades = resp;
              this.forma.get('id_ciudad').setValue(this.ciudades.find(ciudad => ciudad.id_ciudad == data.id_ciudad));              
            }

            this.paisesCiudadesServ.buscaSector(data.id_ciudad).then((resp: any) => {
              if (data.length !== 0) {
                this.sectores = resp;
                this.forma.get('id_sector').setValue(this.sectores.find(sector => sector.id_sector == data.id_sector));                
              }
            })
          })
        });          
      });
    })
  }
  
  cancelar() {
    this.actualizar = false;
    this.guardar = true;
    this.resetFormulario();
    this.empleadosServ.guardando();    
  }

  resetFormulario() {
    this.forma.reset();
    this.forma.get('estado').setValue('activo');
    
  }

  getNoValido(input: string) {
    return this.forma.get(input).invalid && this.forma.get(input).touched;
  }

}
