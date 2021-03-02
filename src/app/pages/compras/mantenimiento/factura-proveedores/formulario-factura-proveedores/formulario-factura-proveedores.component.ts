import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MonedasService } from 'src/app/services/monedas.service';
import { UiMessagesService } from 'src/app/services/ui-messages.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-formulario-factura-proveedores',
  templateUrl: './formulario-factura-proveedores.component.html',
  styleUrls: ['./formulario-factura-proveedores.component.scss']
})
export class FormularioFacturaProveedoresComponent implements OnInit {

  forma: FormGroup;
  usuario: any;
  guardando = false;
  guardar = true;
  actualizando = false;
  actualizar = false;
  monedaExiste = 3;
  minDate: Date;
  id: number;
  monedas: any[] = [];

  constructor(private fb: FormBuilder,
              private uiMessage: UiMessagesService,
              private usuariosServ: UsuarioService,
              private monedasServ: MonedasService) { 
                this.usuario = this.usuariosServ.getUserLogged()
                this.crearFormulario();
  }

  ngOnInit(): void {
    this.toDasLasMonedas()
    this.monedasServ.actualizar.subscribe((resp: any) =>{
      this.guardar = false;
      this.actualizar = true;   
      this.id = Number(resp);      
      this.monedasServ.getDato(resp).then((res: any) => {
        console.log(res);
        this.forma.get('divisa').setValue(res.divisa);
        this.forma.get('simbolo').setValue(res.simbolo);
        this.forma.patchValue(res);
      })
    })
  }

  toDasLasMonedas() {
    this.monedasServ.getDatos().then((resp: any) => {
      this.monedas = resp
    })
  }
  crearFormulario() {
    this.forma = this.fb.group({
      descripcion:         ['', Validators.required],
      num_doc:             ['', Validators.required],
      fecha_vencimiento:   ['', Validators.required],
      monedas:             ['', Validators.required],
      estado:              ['activo', Validators.required],
      usuario_creador:     [this.usuario.username, Validators.required],
      usuario_modificador: ['']
    })
  }

  guardarMoneda(){
    //this.guardando = true;
    
    if (this.forma.invalid) {       
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios');      
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
      })
    }else{   
      switch (this.monedaExiste) {
        case 0:
          this.uiMessage.getMiniInfortiveMsg('tst','info','Espere','Verificando disponibilidad de nombre');
          this.guardando = false;
          break;

        case 2:
          this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Existe una categoria con este nombre');
          this.guardando = false;
          break;

        default:
          this.monedasServ.crearMoneda(this.forma.value).then((resp: any)=>{
            if (resp) {
              this.guardando = false;
              this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente',resp.msj);  
            }               
          })
          break;
      } 
    }
  }
  
  verificaMoneda(data){  
    if (data === "") {
      this.monedaExiste = 3;
      return;
    }
    let param = {'monedas': data};
    this.monedaExiste = 0;
    this.monedasServ.busquedaMoneda(param).then((resp: any)=>{
      if(resp.length === 0) {
        this.monedaExiste = 1;
      }else{
        this.monedaExiste = 2;
      }
    })
  }

  actualizarMoneda(){
    //this.actualizando = true;
    this.forma.get('usuario_modificador').setValue(this.usuario.username);    
    if (this.forma.invalid) {       
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios');      
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
      })
    }else{ 
      this.monedasServ.actualizarMoneda(this.id, this.forma.value).then((resp: any) => {
        this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente',resp.msj);
        this.actualizando = false;
      })
    }
  }

  onSelectDate(event) {
    let d = new Date(Date.parse(event));
    this.forma.get("fecha_enviada").setValue(`${d.getFullYear()}/${d.getMonth()+1}/${d.getDate()}`);
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

  cancelar() {
    this.actualizar = false;
    this.guardar = true;
    this.forma.reset();
    this.forma.get('estado').setValue('activo');
    this.forma.get('usuario_creador').setValue(this.usuario.username);
    this.monedasServ.guardando();    
  }

  getNoValido(input: string) {
    return this.forma.get(input).invalid && this.forma.get(input).touched;
  }


}
