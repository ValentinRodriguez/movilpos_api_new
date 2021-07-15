import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PaisesCiudadesService } from 'src/app/services/paises-ciudades.service';
import { TransportistasService } from 'src/app/services/transportistas.service';
import { UiMessagesService } from 'src/app/services/ui-messages.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ZonasService } from 'src/app/services/zonas.service';

import { GlobalFunctionsService } from 'src/app/services/global-functions.service';
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
  
  listSubscribers: any = [];
  regiones: any;
  provincias: any;
  municipios: any;
  sectores: any;

  constructor(private globalFunction: GlobalFunctionsService,private fb: FormBuilder,
              private uiMessage: UiMessagesService,
              private usuariosServ: UsuarioService,
              private paisesCiudadesServ: PaisesCiudadesService,
              private transportistaServ: TransportistasService,
              private zonasServ: ZonasService) { 
                this.usuario = this.usuariosServ.getUserLogged()
                this.crearFormulario();
  }

  ngOnDestroy(): void {
    this.listSubscribers.forEach(a => a.unsubscribe());
  }

  ngOnInit(): void {
    this.listObserver();

    this.zonasServ.getDatos().then((resp: any) => {
      this.zonas = resp;
    })

    this.paisesCiudadesServ.getPaises().then((resp: any) => {
      this.paises = resp;
    })
  }

  listObserver = () => {
    const observer1$ = this.transportistaServ.actualizar.subscribe((resp: any) =>{
      this.guardar = false;
      this.actualizar = true;   
      this.id = Number(resp);      
      this.transportistaServ.getDato(resp).then((res: any) => {         
        this.forma.patchValue(res);
        this.forma.get('id_pais').setValue(this.paises.find(pais => pais.id_pais === res.id_pais));        
        this.paisesCiudadesServ.buscaCiudad(res.id_pais).then((resp:any) => { 
          this.ciudades = resp;
          this.forma.get('cod_provincia').setValue(this.ciudades.find(ciudad => ciudad.cod_provincia === res.id_ciudad));
        })
      })
    }) 
    
    this.listSubscribers = [observer1$];
  };

  crearFormulario() {
    this.forma = this.fb.group({
      cedula:              ['', Validators.required],
      nombre:              ['', Validators.required],
      cod_transportista:   ['', Validators.required],
      calle:               ['', Validators.required],
      telefono:            ['', Validators.required],
      id_pais:             ['', Validators.required],
      // id_zona:             ['', Validators.required],
      id_region:           ['', Validators.required],
      id_provincia:        ['', Validators.required],
      id_municipio:        ['', Validators.required],
      id_ciudad:           ['', Validators.required],
      id_sector:           [''],
      estado:              ['activo', Validators.required],
      usuario_creador:     [this.usuario.username, Validators.required],
      usuario_modificador: ['']
    })
  }

  guardarTransportista(){
         
    console.log(this.forma);
        
    if (this.forma.invalid) {    
         
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios');      
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
      })
    }else{   
      this.transportistaServ.crearTransportista(this.forma.value).then(()=>{         
        this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro creado de manera correcta');
        this.resetFormulario();
      })
    }
  }
    
  ActualizarCategoria(){
    if (this.forma.invalid) {  
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios');      
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
      })
    }else{   
      this.forma.get('usuario_modificador').setValue(this.usuario.username);
      this.transportistaServ.actualizarTransportista(this.id, this.forma.value).then((resp: any) => {
        this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro actualizado de manera correcta');       
        this.resetFormulario();  
      })
    }
  }
  
  todosLosPaises() {
    this.paisesCiudadesServ.getPaises().then((resp: any)=>{      
      this.paises = resp;   
    })
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
  
  cancelar() {
    this.actualizar = false;
    this.guardar = true;
    this.resetFormulario();
    this.transportistaServ.guardando();    
  }

  resetFormulario() {
    this.forma.reset();
    this.forma.get('estado').setValue('activo');
    this.forma.get('usuario_creador').setValue(this.usuario.username);
  }

  buscaPaises(id) {    
    this.paisesCiudadesServ.buscaCiudad(id).then((resp:any) => {
      this.ciudades = resp;     
    })  
  }

  getNoValido(input: string) {
    return this.forma.get(input).invalid && this.forma.get(input).touched;
  }
}
