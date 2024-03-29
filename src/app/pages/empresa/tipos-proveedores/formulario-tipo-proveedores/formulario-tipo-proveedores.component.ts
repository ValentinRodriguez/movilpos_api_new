import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CgcatalogoService } from 'src/app/services/contabilidad/cgcatalogo.service';
import { TipoProveedorService } from 'src/app/services/mi-empresa/tipo-proveedor.service';
import { UiMessagesService } from 'src/app/services/globales/ui-messages.service';


@Component({
  selector: 'app-formulario-tipo-proveedores',
  templateUrl: './formulario-tipo-proveedores.component.html',
  styleUrls: ['./formulario-tipo-proveedores.component.scss'],
  providers:[CgcatalogoService,TipoProveedorService]
})
export class FormularioTipoProveedoresComponent implements OnInit {

  forma: FormGroup;
  usuario: any;
  guardando = false;
  guardar = true;
  actualizando = false;
  actualizar = false;
  proveedorExiste = 3;
  cuenta_no: any[] = [];
  cuentasFiltradas: any[] = [];
  id: number;    
  listSubscribers: any = [];
  
  constructor(private fb: FormBuilder,
              private uiMessage: UiMessagesService,              
              private cgcatalogoServ: CgcatalogoService,
              private tipoProveedorServ: TipoProveedorService) { 
                
                this.crearFormulario();
  }

    
  ngOnDestroy(): void {
    this.listSubscribers.forEach(a => a.unsubscribe());
  }

  ngOnInit(): void {
    this.listObserver();    
    this.cgcatalogoServ.getDatosAux().subscribe((resp: any) => {
      if (resp.ok) {
        this.cuenta_no = resp;        
      }
    })
  }

  listObserver = () => {
    const observer1$ = this.cgcatalogoServ.catalogoGuardado.subscribe((resp: any) => {      
      if (resp.nivel == 3) {
        this.cuenta_no.push(resp);        
      }
    })

    const observer3$ = this.tipoProveedorServ.actualizar.subscribe((resp: any) =>{
      this.guardar = false;
      this.actualizar = true;   
      this.id = Number(resp);
      this.tipoProveedorServ.getDato(resp).then((res: any) => {       
        this.forma.patchValue(res);           
      })
    })

    this.listSubscribers = [observer1$,observer3$];
  };

  crearFormulario() {
    this.forma = this.fb.group({
      descripcion:         ['', Validators.required],
      cuenta_no:           ['', Validators.required],
      estado:              ['activo', Validators.required],
      usuario_modificador: ['']
    })
  }

  guardarTproveedor(){
        
     
    if (this.forma.invalid) {  
           
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios');      
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
      })
    }else{   
      switch (this.proveedorExiste) {
        case 0:
          this.uiMessage.getMiniInfortiveMsg('tst','info','Espere','Verificando disponibilidad de nombre');          
          break;

        case 2:
          this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Existe una categoria con este nombre');          
          break;

        default:
          this.tipoProveedorServ.crearTproveedor(this.forma.value).then((resp: any)=>{
            this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro creado de manera correcta');
            this.resetFormulario();
          })
          break;
      } 
    }
     
  }
  
  verificaTproveedor(data){  
    if (data === "") {
      this.proveedorExiste = 3;
      return;
    }
    let param = {'tipo': data};
    this.proveedorExiste = 0;
    this.tipoProveedorServ.busquedaTproveedor(param).then((resp: any)=>{
      if(resp.length === 0) {
        this.proveedorExiste = 1;
      }else{
        this.proveedorExiste = 2;
      }
    })
  }

  filtrarCuentas(event) {
    const filtered: any[] = [];
    const query = event.query;
    for (let i = 0; i < this.cuenta_no.length; i++) {
      const size = this.cuenta_no[i];
      if (size.descripcion.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(size);
      }
    }
    this.cuentasFiltradas = filtered;
  }

  actualizarTproveedor() {
     
    this.forma.get('usuario_modificador').setValue(this.usuario.username);    
    if (this.forma.invalid) {   
          
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios');      
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
      })
    }else{ 
      this.tipoProveedorServ.actualizarProveedor(this.id, this.forma.value).then((resp: any) => {
        this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro actualizado de manera correcta');
         
      })
    }
  }

  cancelar() {
    this.actualizar = false;
    this.guardar = true;
    this.resetFormulario();
    this.tipoProveedorServ.guardando();
  }

  resetFormulario() {
    this.forma.get('descripcion').reset();
    this.forma.get('cuenta_no').reset();
  }

  getNoValido(input: string) {
    return this.forma.get(input).invalid && this.forma.get(input).touched;
  }
}
