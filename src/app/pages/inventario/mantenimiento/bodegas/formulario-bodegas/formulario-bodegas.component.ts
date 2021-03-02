import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BodegasService } from 'src/app/services/bodegas.service';
import { PaisesCiudadesService } from 'src/app/services/paises-ciudades.service';
import { UiMessagesService } from 'src/app/services/ui-messages.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-formulario-bodegas',
  templateUrl: './formulario-bodegas.component.html',
  styleUrls: ['./formulario-bodegas.component.scss']
})
export class FormularioBodegasComponent implements OnInit {

  forma: FormGroup;
  guardando = false;
  guardar = true;
  actualizando = false;
  actualizar = false;
  bodegaExiste = 3;
  usuario: any;
  paises: any[] = [];
  ciudades: any[] = [];
  paisesFiltrados: any[] = [];  
  ciudadesFiltradas: any[] = [];  
  id: number;

  constructor(private uiMessage: UiMessagesService,
              private bodegasServ: BodegasService,
              private fb: FormBuilder, 
              private usuariosServ: UsuarioService,
              private paisesCiudadesServ: PaisesCiudadesService) { 
                this.usuario = this.usuariosServ.getUserLogged()
                this.crearFormulario();
              }

  ngOnInit(): void {
    this.todosLosPaises();    
    this.bodegasServ.actualizar.subscribe((resp: any) =>{
      this.guardar = false;
      this.actualizar = true;   
      this.id = Number(resp);      
      this.bodegasServ.getDato(resp).then((res: any) => {
        this.forma.get('descripcion').setValue(res.descripcion);
        this.forma.get('id_pais').setValue(this.paises.find(pais => pais.id_pais === res.id_pais));
        this.forma.get('id_ciudad').setValue(this.ciudades.find(ciudad => ciudad.id_ciudad === res.id_ciudad));
        this.forma.patchValue(res);
      })
    })
  }

  todosLosPaises() {
    this.paisesCiudadesServ.getPaises().then((resp: any)=>{
      this.paises = resp;   
    })
  }

  crearFormulario() {
    this.forma = this.fb.group({
      descripcion:     ['', Validators.required],
      id_pais:         ['', Validators.required],
      id_ciudad:       ['', Validators.required],
      estado:          ['ACTIVO', Validators.required],
      usuario_creador: [this.usuario.username, Validators.required],
      usuario_modificador: ['']
    })
  }

  guardarBodega(){
    this.guardando = true;   
    if (this.forma.invalid) {  
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios');
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
      })
      this.guardando = false;
    }else{ 
      switch (this.bodegaExiste) {
        case 0:
          this.uiMessage.getMiniInfortiveMsg('tst','info','Espere','Verificando disponibilidad de nombre');
          this.guardando = false;
          break;

        case 2:
          this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Existe una categoria con este nombre');
          this.guardando = false;
          break;

        default:
          this.bodegasServ.crearBodega(this.forma.value).then((resp: any)=>{
            this.guardando = false;
            this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente',resp.msj); 
            this.forma.get('descripcion').reset();
            this.forma.get('id_pais').reset();
            this.forma.get('id_ciudad').reset();
          })
          break;
      } 
    }  
  }

  actualizarBodega() {
     //this.actualizando = true;
     this.forma.get('usuario_modificador').setValue(this.usuario.username);    
     if (this.forma.invalid) {       
       this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios');      
       Object.values(this.forma.controls).forEach(control =>{          
         control.markAllAsTouched();
       })
     }else{  
      this.actualizando = true;
      this.bodegasServ.actualizarBodega(this.id, this.forma.value).then((resp: any) => {
        this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente',resp.msj);
        this.actualizando = false;
      })
  }
  }

  cancelar() {
    this.actualizar = false;
    this.guardar = true;
    this.forma.reset();
    this.forma.get('estado').setValue('activo');
    this.forma.get('usuario_creador').setValue(this.usuario.username);
    this.bodegasServ.guardando();    
  }

  filtrarPaises(event) {
    const filtered: any[] = [];
    const query = event.query;
    for (let i = 0; i < this.paises.length; i++) {
      const size = this.paises[i];
      if (size.descripcion.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(size);
      }
    }
    this.paisesFiltrados = filtered;
  }

  filtrarCiudades(event) {
    const filtered: any[] = [];
    const query = event.query;
    for (let i = 0; i < this.ciudades.length; i++) {
      const size = this.ciudades[i];
      if (size.descripcion.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(size);
      }
    }
    this.ciudadesFiltradas = filtered;
  }

  verificaBodega(data){  
    if (data === "") {
      this.bodegaExiste = 3;
      return;
    }
    let param = {'bodega': data};
    this.bodegaExiste = 0;
    this.bodegasServ.busquedaBodega(param).then((resp: any)=>{
      if(resp.length === 0) {
        this.bodegaExiste = 1;
      }else{
        this.bodegaExiste = 2;
      }
    })
  }

  buscaPaises(event) {    
    this.paisesCiudadesServ.getCiudadesXpaises(event).then((resp:any) => {  
     this.ciudades = resp;    
    })   
  }

  getNoValido(input: string) {
    return this.forma.get(input).invalid && this.forma.get(input).touched;
  }

}
