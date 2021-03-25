import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PaisesCiudadesService } from 'src/app/services/paises-ciudades.service';
import { TransportistasService } from 'src/app/services/transportistas.service';
import { UiMessagesService } from 'src/app/services/ui-messages.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ZonasService } from 'src/app/services/zonas.service';

@Component({
  selector: 'app-formulario-transportista',
  templateUrl: './formulario-transportista.component.html',
  styleUrls: ['./formulario-transportista.component.scss']
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

  constructor(private fb: FormBuilder,
              private uiMessage: UiMessagesService,
              private usuariosServ: UsuarioService,
              private paisesCiudadesServ: PaisesCiudadesService,
              private transportistaServ: TransportistasService,
              private zonasServ: ZonasService) { 
                this.usuario = this.usuariosServ.getUserLogged()
                this.crearFormulario();
  }

  ngOnInit(): void {
    this.zonasServ.getDatos().then((resp: any) => {
      this.zonas = resp;
    })

    this.paisesCiudadesServ.getPaises().then((resp: any) => {
      this.paises = resp;
    })

    this.transportistaServ.actualizar.subscribe((resp: any) =>{
      this.guardar = false;
      this.actualizar = true;   
      this.id = Number(resp);      
      this.transportistaServ.getDato(resp).then((res: any) => {
        console.log(res);
        this.forma.patchValue(res);
        this.forma.get('id_pais').setValue(this.paises.find(pais => pais.id_pais === res.id_pais));        
        this.paisesCiudadesServ.getCiudadesXpaises(res.id_pais).then((resp:any) => { 
          this.ciudades = resp;
          this.forma.get('id_ciudad').setValue(this.ciudades.find(ciudad => ciudad.id_ciudad === res.id_ciudad));
        })
      })
    })
  }

  crearFormulario() {
    this.forma = this.fb.group({
      cedula:              ['', Validators.required],
      nombre:              ['', Validators.required],
      cod_transportista:   ['', Validators.required],
      calle:               ['', Validators.required],
      casa_num:            ['', Validators.required],
      barrio:              ['', Validators.required],
      urbanizacion:        ['', Validators.required],
      cod_zona:            ['', Validators.required],
      cod_provincia:       ['', Validators.required],
      id_pais:             ['', Validators.required],
      telefono:            ['', Validators.required],
      estado:              ['activo', Validators.required],
      usuario_creador:     [this.usuario.username, Validators.required]
    })
  }

  guardarTransportista(){
    //this.guardando = true;
    
    if (this.forma.invalid) {       
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios');      
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
      })
    }else{   
      this.transportistaServ.crearTransportista(this.forma.value).then((resp: any)=>{
        this.guardando = false;
        this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente',resp.msj);
      })
    }
  }
    
  ActualizarCategoria(){
    this.actualizando = true;
    this.transportistaServ.actualizarTransportista(this.id, this.forma.value).then((resp: any) => {
      this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro actualizado de manera correcta');
      this.actualizando = false;
    })
  }
  
  cancelar() {
    this.actualizar = false;
    this.guardar = true;
    this.forma.reset();
    this.forma.get('estado').setValue('activo');
    this.forma.get('usuario_creador').setValue(this.usuario.username);
    this.transportistaServ.guardando();    
  }

  buscaPaises(id) {    
    this.paisesCiudadesServ.getCiudadesXpaises(id).then((resp:any) => {
      this.ciudades = resp;     
    })  
  }

  getNoValido(input: string) {
    return this.forma.get(input).invalid && this.forma.get(input).touched;
  }
}
