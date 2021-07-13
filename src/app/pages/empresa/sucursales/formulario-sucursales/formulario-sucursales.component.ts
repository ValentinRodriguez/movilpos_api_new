import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EmpresaService } from 'src/app/services/empresa.service';
import { SucursalesService } from 'src/app/services/sucursales.service';
import { PaisesCiudadesService } from 'src/app/services/paises-ciudades.service';
import { UiMessagesService } from 'src/app/services/ui-messages.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Router } from '@angular/router';
import { GlobalFunctionsService } from 'src/app/services/global-functions.service';
import { DatosEstaticosService } from 'src/app/services/datos-estaticos.service';

@Component({
  selector: 'app-formulario-sucursales',
  templateUrl: './formulario-sucursales.component.html',
  styleUrls: ['./formulario-sucursales.component.scss']
})
export class FormularioSucursalesComponent implements OnInit {

  forma: FormGroup;
  usuario: any;
  
  guardar = true;
  actualizar = false;
  sucursalesExiste = 3;
  formSubmitted = false;
  id: number;
  listSubscribers: any = [];
  paises: any = [];
  regiones: any = [];
  provincias: any = [];
  municipios: any = [];
  ciudades: any = [];
  sectores: any = [];
  empresas: any = [];
  rutaActual: string[];
  items: any = [];

  constructor(private fb: FormBuilder,
              private uiMessage: UiMessagesService,
              private usuariosServ: UsuarioService,
              private paisesCiudadesServ: PaisesCiudadesService,
              private empresasServ: EmpresaService,
              private router: Router,
              private datosEstaticosServ: DatosEstaticosService,
              private globalFunction: GlobalFunctionsService,
              private sucursalesServ: SucursalesService) { 
                this.usuario = this.usuariosServ.getUserLogged()
                this.crearFormulario();
  }

  ngOnDestroy(): void {
    this.listSubscribers.forEach(a => a.unsubscribe());
  }

  ngOnInit(): void {
    this.listObserver();
    this.rutaActual = this.router.url.split("/");
    this.todaLaData();
  }

  listObserver = () => {
    const observer1$ = this.sucursalesServ.actualizar.subscribe((resp: any) =>{
      this.guardar = false;
      this.actualizar = true;   
      this.id = Number(resp);      
      this.sucursalesServ.getDato(resp).then((res: any) => {         
        this.forma.get('divisa').setValue(res.divisa);
        this.forma.get('simbolo').setValue(res.simbolo);
        this.forma.patchValue(res);
      })
    })

    const observer2$ = this.sucursalesServ.formSubmitted.subscribe((resp: any) =>{
      this.formSubmitted = resp;
    })

    
    const observer3$ = this.empresasServ.empresaCreada.subscribe((resp: any) =>{
      this.todaLaData();
    })

    const observer8$ = this.globalFunction.finalizar.subscribe((resp) => {
      this.items = [];
    })

    this.listSubscribers = [observer1$,observer2$,observer3$,observer8$];
   };

  crearFormulario() {
    this.forma = this.fb.group({
      descripcion:         ['', Validators.required],
      cod_cia:             ['', Validators.required],
      // direccion:           ['', Validators.required],
      id_pais:             ['', Validators.required],
      id_zona:             [''],
      id_region:           ['', Validators.required],
      id_provincia:        ['', Validators.required],
      id_municipio:        ['', Validators.required],
      id_ciudad:           [''],
      id_sector:           [''],
      calle:               [''],
      estado:              ['activo', Validators.required],
      usuario_creador:     [this.usuario.username, Validators.required],
      usuario_modificador: ['']
    })
  }

  todaLaData() {
    this.empresasServ.autoLlenado().then((resp: any) => {
      console.log(resp);      
      resp.forEach(element => {
        if (element.data.length === 0) {
          this.items.push({label: this.datosEstaticosServ.capitalizeFirstLetter(element.label), routerLink: element.label})      
        }
        switch (element.label) {
          case 'empresas':
            this.empresas = element.data;
            break;

          case 'paises':
            this.paises = element.data;
            break;

          default:
            break;
        }
      }); 
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

  guardarSucursales(){
    this.formSubmitted = true;    
    if (this.forma.invalid) {    
      this.formSubmitted = false;   
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios');      
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
      })
    }else{   
      switch (this.sucursalesExiste) {
        case 0:
          this.uiMessage.getMiniInfortiveMsg('tst','info','Espere','Verificando disponibilidad de nombre');          
          break;

        case 2:
          this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Existe una categoria con este nombre');          
          break;

        default:
          this.sucursalesServ.crearSucursales(this.forma.value).then(()=>{
            this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro creada de manera correcta'); 
            this.resetFormulario(); 
          })
          break;
      } 
    }
  }
  

  actualizarSucursales(){
    this.formSubmitted = true;
    this.forma.get('usuario_modificador').setValue(this.usuario.username);    
    if (this.forma.invalid) {  
      this.formSubmitted = false;     
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios');      
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
      })
    }else{ 
      this.sucursalesServ.actualizarSucursales(this.id, this.forma.value).then((resp: any) => {
        this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro actualizado de manera correcta');
        this.resetFormulario();
      })
    }
  }

  datosLocalidad(data) {
    console.log(data);
    
    this.formSubmitted = true;
    this.forma.get('id_pais').setValue(this.paises.find(pais => pais.id_pais === data.value.id_pais)); 
        
    this.paisesCiudadesServ.buscaRegion(data.value.id_pais).then((resp:any) => { 
      this.regiones = resp;
      this.forma.get('id_region').setValue(this.regiones.find(region => region.id_region === data.value.id_region));
   
      this.paisesCiudadesServ.buscaProvincias(data.value.id_region).then((resp: any) => {
        this.provincias = resp;
        this.forma.get('id_provincia').setValue(this.provincias.find(provincia => provincia.id_provincia === data.value.id_provincia));
      
        this.paisesCiudadesServ.buscaMunicipios(data.value.id_provincia).then((resp: any) => {
          this.municipios = resp;
          this.forma.get('id_municipio').setValue(this.municipios.find(municipio => municipio.id_municipio === data.value.id_municipio));

          this.paisesCiudadesServ.buscaCiudad(data.value.id_municipio).then((resp: any) => {
            if (resp.length !== 0) {
              this.ciudades = resp;
              this.forma.get('id_ciudad').setValue(this.ciudades.find(ciudad => ciudad.id_ciudad === data.value.id_ciudad));              
            }
            this.paisesCiudadesServ.buscaSector(data.value.id_ciudad).then((resp: any) => {
              if (resp.length !== 0) {
                this.sectores = resp;
                this.forma.get('id_sector').setValue(this.sectores.find(sector => sector.id_sector === data.value.id_sector));                
              }
              this.forma.get('calle').setValue(data.value.calle);   
              this.formSubmitted = false;
            })
          })
        });          
      });
    })
  }

  verificaSucursales(data){  
    if (data === "") {
      this.sucursalesExiste = 3;
      return;
    }
    let param = {'sucursaless': data};
    this.sucursalesExiste = 0;
    this.sucursalesServ.busquedaSucursales(param).then((resp: any)=>{
      if(resp.length === 0) {
        this.sucursalesExiste = 1;
      }else{
        this.sucursalesExiste = 2;
      }
    })
  }

  cancelar() {
    this.actualizar = false;
    this.guardar = true;
    this.resetFormulario();
    this.sucursalesServ.guardando();    
  }

  resetFormulario() {
    this.forma.reset();
    this.forma.get('estado').setValue('activo');
    this.forma.get('usuario_creador').setValue(this.usuario.username);
  }

  redirigir() {
    this.router.navigate([`/mi-negocio/gestion-de-sucursales`]);
  }



  getNoValido(input: string) {
    return this.forma.get(input).invalid && this.forma.get(input).touched;
  }
}
