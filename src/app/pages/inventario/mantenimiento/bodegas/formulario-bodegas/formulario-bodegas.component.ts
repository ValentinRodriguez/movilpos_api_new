import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BodegasService } from 'src/app/services/inventario/bodegas.service';
import { PaisesCiudadesService } from 'src/app/services/globales/paises-ciudades.service';
import { UiMessagesService } from 'src/app/services/globales/ui-messages.service';


@Component({
  selector: 'app-formulario-bodegas',
  templateUrl: './formulario-bodegas.component.html',
  styleUrls: ['./formulario-bodegas.component.scss'],
  providers:[BodegasService,PaisesCiudadesService]
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
  id: number;  
  listSubscribers: any = [];
  
  constructor(private uiMessage: UiMessagesService,
              private bodegasServ: BodegasService,
              private fb: FormBuilder,               
              private paisesCiudadesServ: PaisesCiudadesService) { 
                
                this.crearFormulario();
              }

  ngOnDestroy(): void {
    this.listSubscribers.forEach(a => a.unsubscribe());
  }

  ngOnInit(): void {
    this.todosLosPaises();   
    this.listObserver(); 
  }

  listObserver = () => {
    const observer1$ = this.bodegasServ.actualizar.subscribe((resp: any) =>{
      this.guardar = false;
      this.actualizar = true;   
      this.id = Number(resp);      
      this.bodegasServ.getDato(resp).then((res: any) => {
        this.forma.get('descripcion').setValue(res.descripcion);
        this.forma.get('id_pais').setValue(this.paises.find(pais => pais.id_pais === res.id_pais));
        this.paisesCiudadesServ.buscaCiudad(res.id_pais).then((resp:any) => { 
          this.ciudades = resp;
          this.forma.get('id_ciudad').setValue(this.ciudades.find(ciudad => ciudad.id_ciudad === res.id_ciudad));
        })      
      })
    })

    this.listSubscribers = [observer1$];
  };

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
      usuario_modificador: ['']
    })
  }

  guardarBodega(){       
    if (this.forma.invalid) {  
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios');
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
      })      
    }else{ 
      switch (this.bodegaExiste) {
        case 0:
          this.uiMessage.getMiniInfortiveMsg('tst','info','Espere','Verificando disponibilidad de nombre');          
          break;

        case 2:
          this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Existe una categoria con este nombre');          
          break;

        default:
          this.bodegasServ.crearBodega(this.forma.value).then((resp: any)=>{            
            this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro creado de manera correcta'); 
            this.resetFormulario();
          })
          break;
      } 
    } 
     
  }

  actualizarBodega() {
     
    this.forma.get('usuario_modificador').setValue(this.usuario.username);    
    if (this.forma.invalid) {   
          
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios');      
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
      })
    }else{  
      this.bodegasServ.actualizarBodega(this.id, this.forma.value).then((resp: any) => {
        this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro actualizado de manera correcta');
        this.resetFormulario();
      })
    }
  }

  cancelar() {
    this.actualizar = false;
    this.guardar = true;
    this.resetFormulario();
    this.bodegasServ.guardando();    
  }

  resetFormulario() {
    this.forma.reset();
    this.forma.get('estado').setValue('activo');
    
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
    this.paisesCiudadesServ.buscaCiudad(event).then((resp:any) => {  
     this.ciudades = resp;    
    })   
  }

  getNoValido(input: string) {
    return this.forma.get(input).invalid && this.forma.get(input).touched;
  }

}
