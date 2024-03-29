import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { ListadoRncComponent } from 'src/app/components/listado-rnc/listado-rnc.component';
import { OnlineRncComponent } from 'src/app/components/online-rnc/online-rnc.component';
import { DgiiService } from 'src/app/services/globales/dgii.service';
import { EmpresaService } from 'src/app/services/mi-empresa/empresa.service';
import { MonedasService } from 'src/app/services/mi-empresa/monedas.service';
import { PaisesCiudadesService } from 'src/app/services/globales/paises-ciudades.service';

import { UiMessagesService } from 'src/app/services/globales/ui-messages.service';
import { environment } from 'src/environments/environment';
import { ClientesService } from 'src/app/services/ventas/clientes.service';

const URL = environment.urlClean;

@Component({
  selector: 'app-formulario-empresa',
  templateUrl: './formulario-empresa.component.html',
  styleUrls: ['./formulario-empresa.component.scss'],
  providers:[EmpresaService,MonedasService,ClientesService,PaisesCiudadesService,DgiiService]
})
export class FormularioEmpresaComponent implements OnInit {

  forma: FormGroup;
  selectedMulti: any[] = [];
  usuario: any;
  empresas = [];
  imgEmpresa = null;
  imgURL = null;
  message: string;
  nombreExiste = 3;
  rncExiste= 3;
  monedas: any;
  guardando = false;
  actualizando = false;
  guardar = true;
  actualizar = false;
  imagePath;
  empresa: any;
  documento=[];
  paises: any[] = [];
  ciudades: any[] = [];

  paisesFiltrados: any[] = [];  
  ciudadesFiltradas: any[] = [];  
  id: number;
  
  listSubscribers: any = [];

  sino = [
    {label: 'Sí', value: 'si'},
    {label: 'No', value: 'no'},
  ];

  tipo_cuadre = [
    {label: 'Monedero', value: 'm'},
    {label: 'Total Efectivo', value: 'tf'},
  ];
  
  valuacion_inv = [
    {label: 'Estandar', value: 'standard'},
    {label: 'PEPS', value: 'peps'},
    {label: 'UEPS', value: 'ueps'},
  ];
  regiones: any;
  provincias: any;
  municipios: any;
  sectores: any;
  cedula = false;
  rnc = true;
  pasaporte = false;

  constructor(private fb: FormBuilder,
              private uiMessage: UiMessagesService,
              private empresasServ: EmpresaService,
              private monedasServ: MonedasService,              
              public dialogService: DialogService,
              public router: Router,
              private clientesServ: ClientesService,
              private paisesCiudadesServ: PaisesCiudadesService,
              private dgiiServ: DgiiService) { 
    
    this.crearFormulario();
  }

  ngOnDestroy(): void {
    this.listSubscribers.forEach(a => a.unsubscribe());
  }

  ngOnInit(): void {      
    this.todosLosPaises();
    
    this.clientesServ.getDocumento().then((resp: any) => {
      this.documento = resp;
      this.forma.get('tipo_documento').setValue(this.documento.find(doc => doc.descripcion === 'RNC'));
    })

    this.listObserver();

    this.monedasServ.getDatos().then((resp: any) =>{
      this.monedas = resp;   
    })

  }

  tipoDoc(doc) {
    if (doc.descripcion === 'cedula') {
      this.cedula = true;
      this.rnc = false;
      this.pasaporte = false;
    } 
    if (doc.descripcion === 'RNC') {
      this.cedula = false;
      this.rnc = true;
      this.pasaporte = false;
    } 

    if (doc.descripcion === 'pasaporte') {
      this.cedula = false;
      this.rnc = false;
      this.pasaporte = true;
    } 
    this.forma.get('documento').reset()
  }
  
  listObserver = () => {
    const observer1$ = this.empresasServ.actualizar.subscribe((resp: any) =>{
      this.guardar = false;
      this.actualizar = true;   
      this.id = Number(resp);      
      this.empresasServ.getDato(resp).then((res: any) => {
         
        this.forma.patchValue(res);
        this.imgURL = `${URL}/storage/${res.logo}`;
        
        this.forma.get('moneda').setValue(JSON.parse(res.moneda));   
        this.forma.get('id_pais').setValue(this.paises.find(pais => pais.id_pais === res.id_pais)); 
        
        this.paisesCiudadesServ.buscaRegion(res.id_pais).then((resp:any) => { 
          this.regiones = resp;
          this.forma.get('id_region').setValue(this.regiones.find(region => region.id_region === res.id_region));
       
          this.paisesCiudadesServ.buscaProvincias(res.id_region).then((resp: any) => {
            this.provincias = resp;
            this.forma.get('id_provincia').setValue(this.provincias.find(provincia => provincia.id_provincia === res.id_provincia));
          
            this.paisesCiudadesServ.buscaMunicipios(res.id_provincia).then((resp: any) => {
              this.municipios = resp;
              this.forma.get('id_municipio').setValue(this.municipios.find(municipio => municipio.id_municipio === res.id_municipio));

              this.paisesCiudadesServ.buscaCiudad(res.id_municipio).then((resp:any) => { 
                this.ciudades = resp;
                this.forma.get('id_ciudad').setValue(this.ciudades.find(ciudad => ciudad.id_ciudad === res.id_ciudad));

                this.paisesCiudadesServ.buscaSector(res.id_ciudad).then((resp:any) => { 
                  this.sectores = resp;
                  this.forma.get('id_sector').setValue(this.sectores.find(sector => sector.id_sector === res.id_sector));
                })
              })
            });          
          });
        })
      })
    })
    
    const observer2$ = this.dgiiServ.rncEscogido.subscribe((resp) => {
      
      this.forma.get('nombre').setValue(resp.razon_social);
      this.forma.get('telefono_empresa').setValue(resp.telefono);
      this.forma.get('rnc').setValue(resp.rnc);
    })

    this.listSubscribers = [observer1$,observer2$];
  };

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

  crearFormulario() {
    this.forma = this.fb.group({
      nombre:            ['', Validators.required],
      telefono_empresa:  ['(333)-333-3333', Validators.required],
      email_empresa:     ['valentinrodriguez1427@gmail.com', Validators.required],
      documento:         ['', Validators.required],
      tipo_documento:    ['', Validators.required],
      id_pais:           ['', Validators.required],
      id_region:         ['', Validators.required],
      id_provincia:      ['', Validators.required],
      id_municipio:      ['', Validators.required],
      id_ciudad:         ['', Validators.required],
      id_sector:         [''],
      calle:             ['', Validators.required],
      web:               ['asdasd.com'],
      contacto:          ['luis miguel', Validators.required],
      telefono_contacto: ['(333)-333-3333', Validators.required],
      moneda:            ['', Validators.required],
      empresa_verde:     ['', Validators.required],
      tipo_cuadre:       ['', Validators.required],
      valuacion_inv:     ['', Validators.required],
      tipo_empresa:      ['D', Validators.required],
      logo:              [],
      estado:            ['activo'],
      usuario_modificador:   ['']
    })
  }

  guardarEmpresa() {
        
    if (this.forma.get('logo').value === '') {
      this.uiMessage.getMiniInfortiveMsg('tst', 'error', 'ERROR', 'Debe escoger un logo para la empresa.');
      return;
    }
    if (this.forma.invalid) {  
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios');
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
      })      
    }else{ 
      if (this.nombreExiste === 2) {
        this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Existe una empresa con este nombre.');  
        return;
      }

      if (this.rncExiste === 2) {
        this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','El RNC especificado no es valido.');  
        return;
      }

      this.empresasServ.crearEmpresa(this.forma.value).then(()=>{        
        this.resetFormulario();
        this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro creada de manera correcta');               
      })       
    } 
  }

  actualizarEmpresa(){        
    this.forma.get('usuario_modificador').setValue(this.usuario.username);
    
    if (this.forma.invalid) {  
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios.');
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
      })
       
    }else{ 
      switch (this.nombreExiste) {
        case 0:
          this.uiMessage.getMiniInfortiveMsg('tst','info','Espere','Verificando disponibilidad de nombre.');
           
          break;

        case 2:
          this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Existe una empresa con este nombre.');
           
          break;
      } 

      switch (this.rncExiste) {
        case 0:
          this.uiMessage.getMiniInfortiveMsg('tst','info','Espere','Verificando disponibilidad de nombre.');
           
          break;

        case 1:
          this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','El RNC especificado no es valido.');
           
          break;
      } 
      
      this.empresasServ.actEmpresa(this.forma.value, this.id).then((resp: any)=>{         
        this.resetFormulario();
        this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro actualizado de manera correcta');               
      })
       
    } 
  }

  listadoRNC() {
    this.dialogService.open(ListadoRncComponent, {
      header: 'Gestión de RNC`s',
      width: '50%'
    });
  }

  onlineRNC() {
    this.dialogService.open(OnlineRncComponent, {
      header: 'Verificación online RNC',
      width: '600'
    });
  }

  resetFormulario() {
    this.ciudades = [];
    this.forma.reset();
    this.imgURL = null;
    this.forma.get('estado').setValue('activo');
    
  }

  cancelar() {
    this.actualizar = false;
    this.guardar = true;  
    this.resetFormulario();
    this.empresasServ.guardando(); 
  }

  buscaPaises(event) {
    this.paisesCiudadesServ.buscaCiudad(event).then((resp:any) => {  
     this.ciudades = resp; 
    })   
  }

  datosEmpresa() {
    this.empresasServ.getEmpresa().then((resp: any) => {
      if (resp.length !== 0) {
        this.empresas = resp        
        this.forma.controls['nombre'].setValue(this.empresas[0].nombre)
        this.forma.controls['telefono_empresa'].setValue(this.empresas[0].telefono_empresa)
        this.forma.controls['email_empresa'].setValue(this.empresas[0].email_empresa)
        this.forma.controls['rnc'].setValue(this.empresas[0].rnc)
        this.forma.controls['direccion'].setValue(this.empresas[0].direccion)
        this.forma.controls['web'].setValue(this.empresas[0].web)
        this.forma.controls['contacto'].setValue(this.empresas[0].contacto)
        this.forma.controls['telefono_contacto'].setValue(this.empresas[0].telefono_contacto)   
        this.forma.controls['moneda'].setValue(this.empresas[0].moneda) 
        this.forma.controls['logo'].setValue(this.empresas[0].logo) 
        this.imgEmpresa = this.empresas[0].logo;        
      }
    })   
  }
  
  preview(files) {
    if (files.length === 0)
      return;
 
    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Solo puede escoger imagenes";
      return;
    }

    this.forma.get('logo').setValue(files[0])
    
    var reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]); 
    reader.onload = (_event) => { 
      this.imgURL = reader.result; 
    }
  }

  setValue() {
    this.selectedMulti = this.forma.get("moneda").value;   
  }

  verificaEmpresa(data){  
    if (data === "") {
      this.nombreExiste = 3;
      return;
    }
    let param = {'empresa': data};
    this.nombreExiste = 0;
    this.empresasServ.busquedaEmpresa(param).then((resp: any)=>{
      if(resp.length === 0) {
        this.nombreExiste = 1;
      }else{
        this.nombreExiste = 2;
      }
    })
  }

  verificaRNC(data){  
    if (data === "") {
      this.rncExiste = 3;
      return;
    }
    this.rncExiste = 0;
    this.dgiiServ.busquedaRNC(data).then((resp: any)=>{
      if(resp.length === 0) {
        this.rncExiste = 1;
      }else{
        this.rncExiste = 2;
        this.forma.get('nombre').setValue(resp[0].nombre_empresa);
        this.forma.get('telefono_empresa').setValue(resp[0].telefono);
      }
    })
  }

  getNoValido(input: string) {
    return this.forma.get(input).invalid && this.forma.get(input).touched;
  }

}
