import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PeriodosFiscalesService } from 'src/app/services/contabilidad/periodos-fiscales.service';
import { UiMessagesService } from 'src/app/services/globales/ui-messages.service';
import { UsuarioService } from 'src/app/services/panel-control/usuario.service';

@Component({
  selector: 'app-act-periodos',
  templateUrl: './act-periodos.component.html',
  styleUrls: ['./act-periodos.component.scss'],
  providers:[UsuarioService,PeriodosFiscalesService,]
})
export class ActPeriodosComponent implements OnInit {
  periodo: any;
  forma: FormGroup;
  usuario: any;
  actualizando = false;
  meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  month = [ "January","February","March","April","May","June","July","August","September","October","November","December" ];
  deadline: any[] = [];
  
  
  constructor(private fb: FormBuilder,
              private usuariosServ: UsuarioService,
              private periodoServ: PeriodosFiscalesService,
              private uiMessage: UiMessagesService,
              private ref: DynamicDialogRef,
              public config: DynamicDialogConfig) { 
        this.usuario = this.usuariosServ.getUserLogged();
        this.crearFormulario();
  }

  ngOnInit(): void {
    this.periodo = this.config.data;
    this.periodoServ.getDato(this.periodo).then((resp: any) => {
      this.forma.patchValue(resp);   
      this.forma.get('fecha_ini_fin').setValue([new Date(resp.fecha_corte), new Date(resp.fecha_inicio)]);
    })  
  }

  crearFormulario() {
    this.forma = this.fb.group({ 
      anio:                ['', Validators.required],   
      fecha_ini_fin:       ['', Validators.required], 
      fecha_inicio:        ['', Validators.required], 
      fecha_corte:         ['', Validators.required], 
      dias_habiles:        [''],
      dias_gracia:         [''],
      mes:                 [''],
      estado:              ['activo', Validators.required],
      usuario_modificador: [''],
      usuario_creador:     [this.usuario.username, Validators.required]   
    })
  }

  actualizarPeriodo() {
     
    this.forma.get('usuario_modificador').setValue(this.usuario.username);
    const divide = this.forma.get('fecha_ini_fin').value;
    this.forma.get("fecha_inicio").patchValue(this.transformarFecha(divide[0]));
    this.forma.get("fecha_corte").patchValue(this.transformarFecha(divide[1]));

    if (this.forma.invalid) {
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios');
    } else {
      this.periodoServ.actualizarPeriodo(this.periodo, this.forma.value).then((resp: any) => {
        this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro Actualizado');
         
        this.ref.close();
      })      
    }
  }

  transformarFecha(fecha) {
    let d = new Date(Date.parse(fecha));
    return `${d.getFullYear()}/${d.getMonth()+1}/${d.getDate()}`;
  }

  obtenerUltimoDia(anio, mes) {
    var ultimoDia = new Date(anio, mes, 0);
    return ultimoDia.getDate();
  }

  getNoValido(input: string) {
    return this.forma.get(input).invalid && this.forma.get(input).touched;
  }

}
