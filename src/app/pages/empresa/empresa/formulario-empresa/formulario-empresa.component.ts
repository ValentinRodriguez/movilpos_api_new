import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EmpresaService } from 'src/app/services/empresa.service';
import { MonedasService } from 'src/app/services/monedas.service';
import { PaisesCiudadesService } from 'src/app/services/paises-ciudades.service';
import { UiMessagesService } from 'src/app/services/ui-messages.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-formulario-empresa',
  templateUrl: './formulario-empresa.component.html',
  styleUrls: ['./formulario-empresa.component.scss']
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
  monedas: any;
  guardando = false;
  actualizando = false;
  guardar = true;
  actualizar = false;
  imagePath;
  empresa: any;

  paises: any[] = [];
  ciudades: any[] = [];

  paisesFiltrados: any[] = [];  
  ciudadesFiltradas: any[] = [];  
  id: number;

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

  constructor(private fb: FormBuilder,
              private uiMessage: UiMessagesService,
              private empresasServ: EmpresaService,
              private monedasServ: MonedasService,
              private usuariosServ: UsuarioService,
              private paisesCiudadesServ: PaisesCiudadesService) { 
    this.usuario = this.usuariosServ.getUserLogged()
    this.crearFormulario();
  }

  ngOnInit(): void {  
    this.todosLosPaises();
    // this.datosEmpresa();

    this.monedasServ.getDatos().then((resp: any) =>{
      this.monedas = resp;   
    })

    this.empresasServ.actualizar.subscribe((resp: any) =>{
      this.guardar = false;
      this.actualizar = true;   
      this.id = Number(resp);      
      this.empresasServ.getDato(resp).then((res: any) => {
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

  todosLosPaises() {
    this.paisesCiudadesServ.getPaises().then((resp: any)=>{
      this.paises = resp;   
    })
  }

  crearFormulario() {
    this.forma = this.fb.group({
      nombre:            ['', Validators.required],
      telefono_empresa:  ['', Validators.required],
      email_empresa:     ['', Validators.required],
      rnc:               ['', Validators.required],
      id_pais:           ['', Validators.required],
      id_ciudad:         ['', Validators.required],
      direccion:         ['', Validators.required],
      web:               ['', Validators.required],
      contacto:          ['', Validators.required],
      telefono_contacto: ['', Validators.required],
      moneda:            ['', Validators.required],
      empresa_verde:     ['', Validators.required],
      tipo_cuadre:       ['', Validators.required],
      valuacion_inv:     ['', Validators.required],
      logo:              [],
      estado:            ['activo'],
      usuario_modificador:   ['']
    })
  }

  guardarEmpresa() {
    this.guardando = true;    
    if (this.forma.invalid) {  
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios');
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
      })
      this.guardando = false;
    }else{ 
      switch (this.nombreExiste) {
        case 0:
          this.uiMessage.getMiniInfortiveMsg('tst','info','Espere','Verificando disponibilidad de nombre');
          this.guardando = false;
          break;

        case 2:
          this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Existe una empresa con este nombre');
          this.guardando = false;
          break;

        default:
          this.empresasServ.crearEmpresa(this.forma.value).then((resp: any)=>{
            this.guardando = false;
            this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente',resp.msj);               
          })
          break;
      } 
    } 
  }

  actualizarEmpresa(){
    // this.actualizando = true;    
    if (this.forma.invalid) {  
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios');
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
      })
      this.guardando = false;
    }else{ 
      switch (this.nombreExiste) {
        case 0:
          this.uiMessage.getMiniInfortiveMsg('tst','info','Espere','Verificando disponibilidad de nombre');
          this.guardando = false;
          break;

        case 2:
          this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Existe una empresa con este nombre');
          this.guardando = false;
          break;

        default:
          this.forma.get('usuario_modificador').setValue(this.usuario.username);
          this.empresasServ.actEmpresa(this.forma.value, this.id).then((resp: any)=>{
            this.guardando = false;
            this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente',resp.msj);               
          })
          break;
      } 
    } 
  }

  cancelar() {
    this.actualizar = false;
    this.guardar = true;    
    this.ciudades = [];
    this.forma.reset();
    this.forma.get('estado').setValue('activo');
    this.forma.get('usuario_creador').setValue(this.usuario.username);
    this.empresasServ.guardando(); 
  }

  buscaPaises(event) {
    this.paisesCiudadesServ.getCiudadesXpaises(event).then((resp:any) => {  
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

    this.forma.controls['logo'].setValue(files[0])
    
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

  getNoValido(input: string) {
    return this.forma.get(input).invalid && this.forma.get(input).touched;
  }

}
