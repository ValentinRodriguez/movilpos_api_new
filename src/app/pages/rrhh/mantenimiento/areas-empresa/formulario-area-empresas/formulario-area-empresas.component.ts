import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AreasEmpresaService } from 'src/app/services/areas-empresa.service';
import { DatosEstaticosService } from 'src/app/services/datos-estaticos.service';
import { DepartamentosService } from 'src/app/services/departamentos.service';
import { EmpresaService } from 'src/app/services/empresa.service';
import { SucursalesService } from 'src/app/services/sucursales.service';
import { UiMessagesService } from 'src/app/services/ui-messages.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-formulario-area-empresas',
  templateUrl: './formulario-area-empresas.component.html',
  styleUrls: ['./formulario-area-empresas.component.scss']
})
export class FormularioAreaEmpresasComponent implements OnInit {

  forma: FormGroup;
  usuario: any;
  deptoFiltrados: any[] = [];
  guardar = true;
  actualizando = false;
  actualizar = false;
  areaExiste = 3;
  formSubmitted = false;
  id: number;
  listSubscribers: any = [];
  departamentos: any[] = [];
  items: any[] = [];
  empresas: any[] = [];
  sucursales: any[] = [];
  empresasFiltradas: any[]= [];
  sucursalesFiltradas: any[]= [];
  rutaActual: string[];

  constructor(private fb: FormBuilder,
              private uiMessage: UiMessagesService,
              private usuariosServ: UsuarioService,
              private DatosEstaticos: DatosEstaticosService,
              private empresasServ: EmpresaService,
              private departamentosServ: DepartamentosService,
              private sucursalesServ: SucursalesService,
              private router: Router,
              private areasServ: AreasEmpresaService) { 
                this.usuario = this.usuariosServ.getUserLogged()
                this.crearFormulario();
  }

  ngOnDestroy(): void {
    this.listSubscribers.forEach(a => a.unsubscribe());
  }

  ngOnInit(): void {
    this.rutaActual = this.router.url.split("/");
    this.listObserver();
    this.todaLaData();    
  }

  listObserver = () => {
    const observer1$ = this.areasServ.actualizar.subscribe((resp: any) =>{
      this.guardar = false;
      this.actualizar = true;   
      this.id = Number(resp);      
      this.areasServ.getDato(resp).then((res: any) => {         
        this.forma.get('divisa').setValue(res.divisa);
        this.forma.get('simbolo').setValue(res.simbolo);
        this.forma.patchValue(res);
      })
    })

    const observer2$ = this.areasServ.formSubmitted.subscribe((resp: any) =>{
      this.formSubmitted = resp;
    })

    const observer3$ = this.empresasServ.empresaCreada.subscribe((resp: any) =>{
      this.empresas.push(resp);
    })

    const observer4$ = this.departamentosServ.departamentoEscogido.subscribe((resp: any) =>{
      this.empresas.push(resp);
    })

    const observer5$ = this.sucursalesServ.sucursalesGuardada.subscribe((resp: any) =>{
      this.sucursales.push(resp);
    })

    this.listSubscribers = [observer1$,observer2$,observer3$,observer4$,observer5$];
  };

  todaLaData() {   
    this.areasServ.autoLlenado().then((resp: any) =>{
      console.log(resp);
        
      resp.forEach(element => {
        if (element.data.length === 0) {
          this.items.push({label: this.DatosEstaticos.capitalizeFirstLetter(element.label), routerLink: element.label})      
        }
        
        switch (element.label) {
          case 'empresa':
            this.empresas = element.data;
            break;

          // case 'sucursales':
          //   this.sucursales = element.data;
          //   break;

          case 'departamentos':
            this.departamentos = element.data;
            break;
        }
      }); 
    })
  }

  crearFormulario() {
    this.forma = this.fb.group({
      departamento:        ['', Validators.required],
      cod_cia:             ['', Validators.required],
      suc_id:              ['', Validators.required],
      descripcion:         ['', Validators.required],
      estado:              ['activo', Validators.required],
      usuario_creador:     [this.usuario.username, Validators.required],
      usuario_modificador: ['']
    })
  }

  guardarArea(){
    this.formSubmitted = true;    
    if (this.forma.invalid) {    
      this.formSubmitted = false;   
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios');      
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
      })
    }else{   
      switch (this.areaExiste) {
        case 0:
          this.uiMessage.getMiniInfortiveMsg('tst','info','Espere','Verificando disponibilidad de nombre');          
          break;

        case 2:
          this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Existe una categoria con este nombre');          
          break;

        default:
          this.areasServ.crearArea(this.forma.value).then(()=>{
            this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro creada de manera correcta'); 
            this.resetFormulario(); 
          })
          break;
      } 
    }
  }

  filtrarDeptos(event) {
    const filtered: any[] = [];
    const query = event.query;
    for (let i = 0; i < this.departamentos.length; i++) {
      const size = this.departamentos[i];
      if (size.descripcion.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(size);
      }
    }
    this.deptoFiltrados = filtered;
  }

  filtrarEmpresas(event) {
    const filtered: any[] = [];
    const query = event.query;
    for (let i = 0; i < this.empresas.length; i++) {
      const size = this.empresas[i];
      if (size.nombre.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(size);
      }
    }
    this.empresasFiltradas = filtered;
  }

  filtrarSucursales(event) {
    const filtered: any[] = [];
    const query = event.query;
    for (let i = 0; i < this.sucursales.length; i++) {
      const size = this.sucursales[i];
      if (size.descripcion.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(size);
      }
    }
    this.sucursalesFiltradas = filtered;
    console.log(this.sucursales);
  }

  verificaArea(data){  
    if (data === "") {
      this.areaExiste = 3;
      return;
    }
    let param = {'areas': data};
    this.areaExiste = 0;
    this.areasServ.busquedaArea(param).then((resp: any)=>{
      if(resp.length === 0) {
        this.areaExiste = 1;
      }else{
        this.areaExiste = 2;
      }
    })
  }

  actualizarArea(){
    this.formSubmitted = true;
    this.forma.get('usuario_modificador').setValue(this.usuario.username);    
    if (this.forma.invalid) {  
      this.formSubmitted = false;     
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios');      
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
      })
    }else{ 
      this.areasServ.actualizarArea(this.id, this.forma.value).then((resp: any) => {
        this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro actualizado de manera correcta');
        this.resetFormulario();
      })
    }
  }

  buscaSucursales(event) {
    console.log(event);
    
    this.sucursalesServ.getDato(event.id).then((resp: any) => {
      this.sucursales = resp;
      console.log(resp);
      
    })
  }

  cancelar() {
    this.actualizar = false;
    this.guardar = true;
    this.resetFormulario();
    this.areasServ.guardando();    
  }

  resetFormulario() {
    this.forma.reset();
    this.forma.get('estado').setValue('activo');
    this.forma.get('usuario_creador').setValue(this.usuario.username);
  }

  getNoValido(input: string) {
    return this.forma.get(input).invalid && this.forma.get(input).touched;
  }


}
