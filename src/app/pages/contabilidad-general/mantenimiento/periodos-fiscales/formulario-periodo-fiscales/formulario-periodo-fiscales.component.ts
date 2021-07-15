import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { DialogService } from 'primeng/dynamicdialog';
import { DatosEstaticosService } from 'src/app/services/datos-estaticos.service';
import { PeriodosFiscalesService } from 'src/app/services/periodos-fiscales.service';
import { UiMessagesService } from 'src/app/services/ui-messages.service';
import { UsuarioService } from 'src/app/services/usuario.service';

import { GlobalFunctionsService } from 'src/app/services/global-functions.service';
@Component({
  selector: 'app-formulario-periodo-fiscales',
  templateUrl: './formulario-periodo-fiscales.component.html',
  styleUrls: ['./formulario-periodo-fiscales.component.scss']
})
export class FormularioPeriodoFiscalesComponent implements OnInit {

  forma: FormGroup;
  usuarioExiste = 3; 
  guardando = false;
  guardar = true;
  actualizando = false;
  actualizar = false;
  id: number;
  usuario: any;
  meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  month = [ "January","February","March","April","May","June","July","August","September","October","November","December" ];
  deadline: any[] = [];
  es: any;
  periodoExiste = 3;
  today = new Date();
  
  listSubscribers: any = [];

  constructor(private globalFunction: GlobalFunctionsService,private fb: FormBuilder,
              private uiMessage: UiMessagesService,
              private usuariosServ: UsuarioService,
              private periodoServ: PeriodosFiscalesService,
              public dialogService: DialogService,
              public DatosEstaticos: DatosEstaticosService) { 
                this.usuario = this.usuariosServ.getUserLogged()
                this.crearFormulario();
              }

  ngOnDestroy(): void {
    this.listSubscribers.forEach(a => a.unsubscribe());
  }

  ngOnInit(): void {
    this.listObserver();
    this.es = {
        firstDayOfWeek: 0,
        dayNames: ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sábado", "Domingo"],
        dayNamesShort: ["Lun", "Mar", "Mie", "Jue", "Vie", "Sáb", "Dom"],
        dayNamesMin: ["Lu", "Ma", "Mi", "Ju", "Vi", "Sáb", "Dom"],
        monthNames: this.meses,
        monthNamesShort: ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sept","Oct","Nov","Dic"],
        today: 'Hoy',
        clear: 'Limpiar',
        dateFormat: 'yy/mm/dd',
        weekHeader: 'Semana'
    };

    this.today = new Date();
    const date = this.today.getFullYear();
    let z = 0;
    this.meses.forEach((element: any) => {
      this.deadline.push(new Date(`${this.month[z]} 1 ${date}`));      
      let data = {
        mes:          z+1,
        dias_habiles: 23
      }
      this.agregarFormulario(data);
      z++;
    });
  }

  listObserver = () => {
    this.listSubscribers = [];
  };
   
  autoGenerar() {
    if (this.periodoExiste === 2) {
      this.uiMessage.getMiniInfortiveMsg('tst','error','Error','Este periodo fiscal ya esta registrado');
      return;
    }
    const gracia = this.forma.get('gracia').value;
    const anio = this.forma.get('anio').value || this.today.getFullYear();
    const meses = this.mes.value;
    let z = 0;

    for (let index = 0; index < meses.length; index++) {      
      const inicio = new Date(`${this.month[index]} 1 ${anio}`);
      const mes = this.obtenerUltimoDia(anio, inicio.getMonth() + 1);
      const fin = new Date(`${this.month[index]} ${mes} ${anio}`);
      ((this.mes).at(z) as FormGroup).get("fecha_ini_fin").patchValue([inicio, fin]);
      ((this.mes).at(z) as FormGroup).get("dias_gracia").patchValue(gracia);
      z++;      
    }
  }

  obtenerUltimoDia(anio, mes) {
    var ultimoDia = new Date(anio, mes, 0);
    return ultimoDia.getDate();
  }

  crearFormulario() {
    this.forma = this.fb.group({ 
      anio:                  [''],   
      estado:                ['activo', Validators.required],
      gracia:                [''],
      usuario_modificador:   [''],
      usuario_creador:       [this.usuario.username, Validators.required],
      meses: this.fb.array([])     
    })
  }

  get mes() {   
    return this.forma.get('meses') as FormArray;
  }

  agregarFormulario(periodo) {
    (<FormArray>this.forma.get('meses')).push(this.agregarFormularioTransacciones(periodo));    
  }
  
  agregarFormularioTransacciones(mes): FormGroup {
    return this.fb.group({
      mes:           [mes.mes, Validators.required],
      fecha_ini_fin: ['', Validators.required],
      fecha_inicio:  [''],
      fecha_corte:   [''],
      dias_habiles:  [mes.dias_habiles, Validators.required],
      dias_gracia:   ['', Validators.required],
    });
  }

  guardarPeriodo() {
    let divide = this.mes.value;
    let i = 0;    
    divide.forEach(element => {
      ((this.mes).at(i) as FormGroup).get("fecha_inicio").patchValue(this.transformarFecha(element.fecha_ini_fin[0]));
      ((this.mes).at(i) as FormGroup).get("fecha_corte").patchValue(this.transformarFecha(element.fecha_ini_fin[1]));
      i++;
    });

    if (this.forma.valid) {
      if (this.periodoExiste === 2) {
        this.uiMessage.getMiniInfortiveMsg('tst','error','Excelente','Este periodo fiscal ya esta registrado');
      }
      if (this.forma.get('anio').value === '') {
        this.forma.get('anio').setValue(this.today.getFullYear())
      }
            
      this.periodoServ.busquedaPeriodo(this.forma.get('anio').value.toString()).then((resp: any) => {
        if (resp.length) {
          this.uiMessage.getMiniInfortiveMsg('tst','error','Excelente','Este periodo fiscal ya esta registrado');
        } else {
          this.periodoServ.crearPeriodo(this.forma.value).then((resp: any) => {  
            this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro creado de manera correcta');
            this.forma.reset();
            this.forma.get('estado').setValue('activo');
            this.forma.get('usuario_creador').setValue(this.usuario.username);
          })
        }
         
      })
    }else{
      this.uiMessage.getMiniInfortiveMsg('tst','error','Atención','Debe completar los campos que son obligatorios');
      return;
    }
  }

  actualizarPeriodo() {
     
    this.forma.get('usuario_modificador').setValue(this.usuario.username);    
    if (this.forma.invalid) {  
           
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios');      
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
      })
    }else{ 
      this.usuariosServ.actUsuario(this.id, this.forma.value).then((resp: any) => {
        this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro actualizado de manera correcta');
         
      })
    }
  }
  
  verificaPeriodo(data){  
    if (data === "") {
      this.periodoExiste = 3;
      return;
    }
    this.periodoExiste = 0;
    this.periodoServ.busquedaPeriodo(data).then((resp: any)=>{
      if(resp.length === 0) {
        this.periodoExiste = 1;
      }else{
        this.periodoExiste = 2;
      }
    })
  }


  cancelar() {
    this.actualizar = false;
    this.guardar = true;
    this.forma.reset();
    this.forma.get('estado').setValue('activo');
    this.forma.get('usuario_creador').setValue(this.usuario.username); 
    this.usuariosServ.guardando();    
  }

  transformarFecha(fecha) {
    let d = new Date(Date.parse(fecha));
    return `${d.getFullYear()}/${d.getMonth()+1}/${d.getDate()}`;
  }

  getNoValido(input: string) {
    return this.forma.get(input).invalid && this.forma.get(input).touched;
  }
}
