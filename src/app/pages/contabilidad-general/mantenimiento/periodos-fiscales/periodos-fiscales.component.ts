import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { PeriodosFiscalesService } from 'src/app/services/periodos-fiscales.service';
import { UiMessagesService } from 'src/app/services/ui-messages.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { groupBy, sumBy } from 'lodash-es';
import { ActPeriodosComponent } from './act-periodos/act-periodos.component';

@Component({
  selector: 'app-periodos-fiscales',
  templateUrl: './periodos-fiscales.component.html',
  styleUrls: ['./periodos-fiscales.component.scss']
})
export class PeriodosFiscalesComponent implements OnInit {

  usuarios = []; 
  usuario: any; 
  actualizando = false;
  actualizar = false;
  cols: any[]; 
  message: string;
  fileUser: any;
  index: number = 0;
  periodos: any[] = [];
  meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

  constructor(private confirmationService: ConfirmationService,
              private periodoFserv: PeriodosFiscalesService,
              private usuariosServ: UsuarioService,
              private uiMessage: UiMessagesService,
              public dialogService: DialogService) { 
                this.usuario = this.usuariosServ.getUserLogged();
              }

  ngOnInit(): void {
    this.obtenerPeriodos();

    this.periodoFserv.guardar.subscribe((resp: any)=>{  
      this.index = resp;
    })

    this.periodoFserv.periodoGuardado.subscribe(resp => {
      this.obtenerPeriodos();
    })

    this.periodoFserv.periodoActualizado.subscribe(resp => {
      this.obtenerPeriodos();
    })

    this.periodoFserv.periodoBorrado.subscribe(resp => {
      this.obtenerPeriodos();
    })

    this.cols = [
      { field: 'anio', header: 'Año' },
      { field: 'mes', header: 'Mes' },
      { field: 'fecha_inicio', header: 'Inicio' },
      { field: 'fecha_corte', header: 'Corte' },
      { field: 'dias_habiles', header: 'Dias Hábiles' },
      { field: 'dias_gracia', header: 'Dias Gracia' },
      { field: 'acciones', header: 'Acciones' },
    ] 
  }
  
  obtenerPeriodos() {
    this.periodoFserv.getDatos().then((resp: any) => {
      this.periodos = resp;      
      let newArray = this.agrupaData(resp, 'anio')
      let temp = [];
      for (const prop in newArray) {        
        const per: any = { 
          "id": newArray[prop][0].id,
          "anio": newArray[prop][0].anio,
          "dias_gracia": newArray[prop][0].dias_gracia,
          "dias_habiles": newArray[prop][0].dias_habiles,
          "estado": newArray[prop][0].estado,
          "fecha_corte": newArray[prop][0].fecha_corte,
          "fecha_inicio": newArray[prop][0].fecha_inicio,
          "mes":  newArray[prop][0].mes,
          "body":newArray[prop]
        }
        temp.push(per)
      }
      this.periodos = temp;     
       
    })
  }

  agrupaData(value: any, column: string) {   
    return groupBy(value, column)    
  }

  actualizarPeriodo(data) {
    const ref = this.dialogService.open(ActPeriodosComponent, {
      data,
      header: `Actualizar Periodo`,
      width: '60%',
      height: '490px'
    });
  }

  borrarPeriodo(periodo) {     
    this.confirmationService.confirm({
      message:"Esta seguro de borrar este registro?",
      accept:() =>{ 
        this.periodoFserv.borrarPeriodo(periodo).then((resp: any)=>{
          this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','periodo eliminado de manera correcta');   
        })       
      }
    })
  }

  restaurarPeriodo(periodo) {
    this.confirmationService.confirm({
      message:"Esta seguro de restaurar este registro?",
      accept:() =>{ 
        this.periodoFserv.restaurarPeriodo(periodo).then((resp: any)=>{
          this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','periodo eliminado de manera correcta');   
        })       
      }
    })
  }
}
