import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from 'src/app/app.breadcrumb.service';
import esLocale from '@fullcalendar/core/locales/es';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
// import listPlugin from '@fullcalendar/list';
import { ActividadesService } from 'src/app/services/miscelaneos/actividades.service';

import { DatosEstaticosService } from 'src/app/services/globales/datos-estaticos.service';
import { UiMessagesService } from 'src/app/services/globales/ui-messages.service';

@Component({
  selector: 'app-gestion-actividades',
  templateUrl: './gestion-actividades.component.html',
  styleUrls: ['./gestion-actividades.component.scss'],
  providers:[ActividadesService]
})
export class GestionActividadesComponent implements OnInit {

    events: any[] = [];
    options: any;
    header: any;
    eventDialog: boolean;
    changedEvent: any;
    clickedEvent = null;
    emptyDate = null;
    usuario: any;
    year: any;
    hour: any;
    cols: { field: string; header: string; }[];

    constructor(private actividadServ: ActividadesService, 
                private uiMessage: UiMessagesService,
                private breadcrumbService: BreadcrumbService,
                private DatosEstaticosServ: DatosEstaticosService) {
                    this.year = this.DatosEstaticosServ.getDate();
                    this.hour = this.DatosEstaticosServ.getHour();                    
                    this.breadcrumbService.setItems([
                        {label: 'Calendar'}
                    ]);
    }

    ngOnInit() {
        this.todasLasActividades();
        this.changedEvent = {title: '', start: null, end: '', allDay: null};

        this.cols = [
            { field: 'title', header: 'Evento' },
            { field: 'start', header: 'Inicio' },
            { field: 'notificacion', header: 'Notificame' }
        ] 

        this.options = {
            plugins: [ dayGridPlugin, timeGridPlugin, interactionPlugin],
            header: {
                left: 'prev,next',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
            },
            locale: esLocale,
            editable: true,
		    // selectable: true,
            eventClick: (e) => {
                this.eventDialog = true;
                this.clickedEvent = e.event;                
                this.emptyDate = false;
                this.changedEvent.title = this.clickedEvent.title;
                this.changedEvent.start = this.clickedEvent.start;
                this.changedEvent.end = this.clickedEvent.end;
                this.changedEvent.notificacion = new Date(this.clickedEvent.extendedProps.notificacion);
                // this.changedEvent.url = this.clickedEvent.url;
                this.changedEvent.id = Number(this.clickedEvent.id);
                this.changedEvent.estado = 'activo';             
            },
            dateClick: (e) =>  {
                this.eventDialog = true;
                this.clickedEvent = e;                
                this.emptyDate = true;
                this.changedEvent.title = '';
                this.changedEvent.start = this.clickedEvent.date;
                this.changedEvent.end = '';    
                this.changedEvent.notificacion = this.clickedEvent.date;      
            },
            select:(e) => {
              this.eventDialog = true;
              this.clickedEvent = e;
              this.emptyDate = true;
              this.changedEvent.title = '';
              this.changedEvent.start = this.clickedEvent.start || null ;
              this.changedEvent.end = this.clickedEvent.end || null ;  
              this.changedEvent.end.setDate(this.changedEvent.end.getDate() - 1);              
            }
        };
    }
    
    todasLasActividades() {
        this.actividadServ.getDatos().then((resp: any) => {
            this.events = resp;   
            this.changedEvent.username = this.usuario.username;         
        });
    }
    save() {
        let fin = null;
        const anio = this.changedEvent.start.getFullYear();   
        const mes = this.changedEvent.start.getMonth();   
        const dias = this.changedEvent.start.getDate();   

        const hora = this.changedEvent.start.getHours();   
        const minutos = this.changedEvent.start.getMinutes();   
        const segundos = this.changedEvent.start.getSeconds();  

        if (this.changedEvent.end) {
            const anio2 = this.changedEvent.end.getFullYear();   
            const mes2 = this.changedEvent.end.getMonth();   
            const dias2 = this.changedEvent.end.getDate();   
    
            const hora2 = this.changedEvent.end.getHours();   
            const minutos2 = this.changedEvent.end.getMinutes();   
            const segundos2 = this.changedEvent.end.getSeconds();  
            
            fin = `${anio2}/${mes2+1}/${dias2} ${hora2}:${minutos2}:${segundos2}`
        }

        const anio3 = this.changedEvent.notificacion.getFullYear();   
        const mes3 = this.changedEvent.notificacion.getMonth();   
        const dias3 = this.changedEvent.notificacion.getDate();   

        const hora3 = this.changedEvent.notificacion.getHours();   
        const minutos3 = this.changedEvent.notificacion.getMinutes();   
        const segundos3 = this.changedEvent.notificacion.getSeconds();  

        const data = {
            "id": this.events.length + 1,
            "title": this.changedEvent.title,
            "url": this.changedEvent.url,
            "start": `${anio}/${mes+1}/${dias} ${hora}:${minutos}:${segundos}`,
            "end": fin,
            "username": this.usuario.username,
            "enviado": "no",
            "notificacion":`${anio3}/${mes3+1}/${dias3} ${hora3}:${minutos3}:${segundos3}`,
            "estado": "activo"
        }               
           
        if (this.changedEvent.title !== "") {
            this.actividadServ.crearActividad(data).then((resp: any) => {                     
                this.events = [...this.events, {
                    "id": this.events.length + 1,
                    "title": this.changedEvent.title,
                    "url": this.changedEvent.url,
                    "start": `${anio}/${mes+1}/${dias} ${hora}:${minutos}:${segundos}`,
                    "end": fin,
                    "username": this.usuario.username,
                    "enviado": "no",
                    "notificacion":`${anio3}/${mes3+1}/${dias3} ${hora3}:${minutos3}:${segundos3}`,
                    "estado": "activo"
                }];                
                                
                this.changedEvent = {title: '', start: null, end: '', allDay: null};
                this.eventDialog = false; 
                this.uiMessage.getMiniInfortiveMsg('bc','success','Genial','Actividad registrada');
            })            
        }
    }

    update() {        
        this.clickedEvent.setProp('title', this.changedEvent.title);
        this.clickedEvent.setStart(this.changedEvent.start);
        this.clickedEvent.setEnd(this.changedEvent.end);   

        let fin = null;
        const anio = this.changedEvent.start.getFullYear();   
        const mes = this.changedEvent.start.getMonth();   
        const dias = this.changedEvent.start.getDate();   

        const hora = this.changedEvent.start.getHours();   
        const minutos = this.changedEvent.start.getMinutes();   
        const segundos = this.changedEvent.start.getSeconds();  

        if (this.changedEvent.end) {
            const anio2 = this.changedEvent.end.getFullYear();   
            const mes2 = this.changedEvent.end.getMonth();   
            const dias2 = this.changedEvent.end.getDate();   
    
            const hora2 = this.changedEvent.end.getHours();   
            const minutos2 = this.changedEvent.end.getMinutes();   
            const segundos2 = this.changedEvent.end.getSeconds();  
            
            fin = `${anio2}/${mes2+1}/${dias2} ${hora2}:${minutos2}:${segundos2}`
        }
    
        const anio3 = this.changedEvent.notificacion.getFullYear();   
        const mes3 = this.changedEvent.notificacion.getMonth();   
        const dias3 = this.changedEvent.notificacion.getDate();   

        const hora3 = this.changedEvent.notificacion.getHours();   
        const minutos3 = this.changedEvent.notificacion.getMinutes();   
        const segundos3 = this.changedEvent.notificacion.getSeconds(); 

        const data = {
            "id": this.changedEvent.id,
            "title": this.changedEvent.title,
            "url": this.changedEvent.url,
            "start": `${anio}/${mes+1}/${dias} ${hora}:${minutos}:${segundos}`,
            "end": fin,
            "notificacion":`${anio3}/${mes3+1}/${dias3} ${hora3}:${minutos3}:${segundos3}`,
            "username": this.usuario.username,
            "estado": "activo"
        } 

        if (this.changedEvent.notificacion !== null && this.changedEvent.title !== null) {
            this.actividadServ.actualizarActividad(data).then(()=>{  
                this.todasLasActividades();          
                this.changedEvent = {title: '', start: null, end: '', allDay: null};
                this.eventDialog = false;
                this.uiMessage.getMiniInfortiveMsg('bc','success','Genial','Actividad actualizada');
            });            
        }
    }

    borrarActividad() {   
        this.actividadServ.borrarActividad(this.changedEvent.id).then((resp: any) => {
            this.todasLasActividades();
            this.changedEvent = {title: '', start: null, end: '', allDay: null};
            this.eventDialog = false;
        })
    }

    reset() {
        this.changedEvent.title = this.clickedEvent.title;
        this.changedEvent.start = this.clickedEvent.start;
        this.changedEvent.end = this.clickedEvent.end;
    }
}
