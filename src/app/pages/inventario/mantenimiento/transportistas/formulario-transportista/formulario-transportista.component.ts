import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PaisesCiudadesService } from 'src/app/services/globales/paises-ciudades.service';
import { TransportistasService } from 'src/app/services/inventario/transportistas.service';
import { UiMessagesService } from 'src/app/services/globales/ui-messages.service';

import { ZonasService } from 'src/app/services/mi-empresa/zonas.service';

@Component({
  selector: 'app-formulario-transportista',
  templateUrl: './formulario-transportista.component.html',
  styleUrls: ['./formulario-transportista.component.scss'],
  providers:[PaisesCiudadesService,TransportistasService,ZonasService]
})
export class FormularioTransportistaComponent implements OnInit {

  forma: FormGroup;
  usuario: any;
  guardando = false;
  guardar = true;
  actualizando = false;
  actualizar = false;
  transportistaExiste = 3;
  zonas: any[] = [];
  id: number;
  ciudades=[];
  paises=[];
  
  listSubscribers: any = [];
  regiones: any;
  provincias: any;
  municipios: any;
  sectores: any;

  constructor(private fb: FormBuilder,
              private uiMessage: UiMessagesService,              
              private paisesCiudadesServ: PaisesCiudadesService,
              private transportistaServ: TransportistasService,
              private zonasServ: ZonasService) {                 
                this.crearFormulario();
  }

  ngOnDestroy(): void {
    this.listSubscribers.forEach(a => a.unsubscribe());
  }

  ngOnInit(): void {
    this.listObserver();
  }

  listObserver = () => {
    const observer1$ = this.transportistaServ.actualizar.subscribe((resp: any) =>{
      this.guardar = false;
      this.actualizar = true;   
      this.id = Number(resp);      
      this.forma.patchValue(resp);
    }) 
    
    this.listSubscribers = [observer1$];
  };

  crearFormulario() {
    this.forma = this.fb.group({
      nombre:              ['', Validators.required],
      telefono:            ['', Validators.required],
      usuario_modificador: ['']
    })
  }

  guardarTransportista(){
    if (this.forma.invalid) {             
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios');      
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
      })
    }else{
      if (this.actualizar) {
        this.forma.get('usuario_modificador').setValue(this.usuario.username);
        this.transportistaServ.actualizarTransportista(this.id, this.forma.value).subscribe((resp: any) => {
          this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro actualizado de manera correcta');       
          this.resetFormulario();  
        })
      } else {
        this.transportistaServ.crearTransportista(this.forma.value).subscribe((resp: any)=>{    
          if (resp.ok) {
            this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro creado de manera correcta');
            this.resetFormulario();            
          }     
        })        
      }
    }
  }
  
  cancelar() {
    this.actualizar = false;
    this.guardar = true;
    this.resetFormulario();
    this.transportistaServ.guardando();    
  }

  resetFormulario() {
    this.forma.reset();   
  }

  getNoValido(input: string) {
    return this.forma.get(input).invalid && this.forma.get(input).touched;
  }
}
