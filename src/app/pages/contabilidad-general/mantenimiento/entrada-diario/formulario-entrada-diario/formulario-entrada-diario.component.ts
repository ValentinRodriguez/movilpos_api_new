import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, NumberValueAccessor } from '@angular/forms';
import { DialogService } from 'primeng/dynamicdialog';
import { CatalogoCuentasComponent } from 'src/app/components/catalogo-cuentas/catalogo-cuentas.component';
import { BrandsService } from 'src/app/services/brands.service';
import { CgcatalogoService } from 'src/app/services/cgcatalogo.service';
import { DatosEstaticosService } from 'src/app/services/datos-estaticos.service';
import { EntradasDiarioService } from 'src/app/services/entradas-diario.service';
import { UiMessagesService } from 'src/app/services/ui-messages.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-formulario-entrada-diario',
  templateUrl: './formulario-entrada-diario.component.html',
  styleUrls: ['./formulario-entrada-diario.component.scss']
})
export class FormularioEntradaDiarioComponent implements OnInit {

  guardando = false;
  guardar = true;
  actualizando = false;
  actualizar = false;
  forma: FormGroup;
  usuario: any;
  cuentaExiste = 3;
  id: number;
  cuentas:any[]=[]
  cols:any[]
  secuencia:string;
  mes:string;
  ano:string;
  mask:string;
  cuenta1:any[]=[];

  constructor(private fb: FormBuilder,
              private uiMessage: UiMessagesService,
              private usuariosServ: UsuarioService,
              private entradasServ: EntradasDiarioService,
              public dialogService: DialogService,
              public cuentaServices: CgcatalogoService) { 
                this.usuario = this.usuariosServ.getUserLogged()
                this.crearFormulario();
  }

  ngOnInit(): void {
    this.mask="ED.99-99/9999"
   /* this.marcasServ.actualizar.subscribe((resp: any) =>{
      this.guardar = false;
      this.actualizar = true;   
      this.id = Number(resp);      
      this.marcasServ.getDato(resp).then((res: any) => {
        console.log(res);
        this.forma.get('descripcion').setValue(res.descripcion);
        this.forma.patchValue(res);
      })

    })*/
  this.cuentaServices.catalogoEscogido.subscribe((resp:any)=>{
      this.cuentas=resp;
  })
   this.entradasServ.getEdsec().then((resp: any) => {
    this.secuencia = resp;
  
   })

    this.cols = [
      { field: 'cuenta_no', header: 'No. Cuenta' },
      { field: 'departamento', header: 'Departamento' },
      { field: 'cod_aux', header: 'Id auxiliar' },
      { field: 'cod_sec', header: 'Codigo auxiliar' },
      { field: 'num_doc', header: 'Numero Documento' },
      { field: 'debito', header: 'Debito' },
      { field: 'credito', header: 'Credito' },
    ]
  //  this.catalogoEscogido()
    this.agregarRegistro();

  }
/*
  catalogoEscogido() {
    this.cuentaServices.catalogoEscogido.subscribe((resp: any) => {
      resp.forEach(element => {
        this.cuenta1.push(element);
        this.agregarFormulario(element);
      });               
    })
  }*/
  
  crearFormulario() {
    this.forma = this.fb.group({
      fecha:           ['', Validators.required],
      ref:             ['', Validators.required],
      mes:             [''],
      periodo:         [''],
      detalle:         [''],
      estado:          ['activo'],
      usuario_creador: [this.usuario.username, Validators.required],
      cuentas: this.fb.array([])     
    })
    console.log(this.forma.value)
  }

  get cuenta() {   
    return this.forma.get('cuentas') as FormArray;
  }
  

  agregarFormulario() {

    (<FormArray>this.forma.get('cuentas')).push(this.agregarFormularioTransacciones());    
 
  }
  
  agregarFormularioTransacciones(): FormGroup {
    
    return this.fb.group({
      cuenta_no:        ['', Validators.required],
      departamento:     [""],
      cod_aux:          [""],
      cod_sec:          [""],
      num_doc:          [""],
      debito:           [""],
      credito:          [""]
    });
  }

  guardarEntradas(){
    //this.guardando = true;
 
    
    console.log(this.forma.value);
    
    if (this.forma.invalid) {      
      this.uiMessage.getMiniInfortiveMsg('tst','error','Error!!','Debe completar los campos que son obligatorios');       
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
      })
      this.guardando = false;
    }else{      
      this.guardando = false;
   
      this.entradasServ.crearEntrada(this.forma.value).then((resp: any)=>{
        this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente!',resp.msj); 
           
      })
    } 

  } 


  onSelectDate(event) {
    let d = new Date(Date.parse(event));
    this.forma.get("fecha").setValue(`${d.getFullYear()}/${d.getMonth()+1}/${d.getDate()}`);

    this.mes=`${d.getMonth()+1}`
    if (Number(this.mes) < 10){
        this.mes="0"+this.mes
    }
    this.ano=d.getFullYear().toString().substr(-2)
    console.log(this.mes+this.ano)

    if (Number(this.secuencia) < 10){
      this.secuencia="0"+this.secuencia
    }
    this.mask="ED.99-"+this.secuencia+"/"+this.mes+this.ano
 
    this.forma.get("periodo").setValue(this.mes+this.ano);
    this.forma.get("mes").setValue(this.mes);
   // console.log(this.mask)

  }

  buscaCuentas() {
    const ref = this.dialogService.open(CatalogoCuentasComponent, {
      header: 'Catalogo de Productos',
      width: '50%'
    });
  }
 /* ActualizarMarca(){
    this.actualizando = true;
    this.forma.get('usuario_modificador').setValue(this.usuario.username);    
    if (this.forma.invalid) {       
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios');      
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
      })
    }else{
      this.marcasServ.actualizarMarca(this.id, this.forma.value).then((resp: any) => {
        this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente',resp.msj);
        this.actualizando = false;
      })
    }
  }
*/
  cancelar() {
    this.actualizar = false;
    this.guardar = true;
    this.forma.reset();
    this.forma.get('estado').setValue('activo');
    this.forma.get('usuario_creador').setValue(this.usuario.username);
    this.entradasServ.guardando();    
  }



  getNoValido(input: string) {
    return this.forma.get(input).invalid && this.forma.get(input).touched;
  }

  verificaCuenta(data){  
    console.log(data)
    if (data === "") {
      this.cuentaExiste = 3;
      return;
    }
    let param = {'cuenta_no': data};
    this.cuentaExiste = 0;
    console.log(param)
    this.cuentaServices.busquedaCatalogo(param).then((resp: any)=>{
      if(resp.length === 0) {
        this.cuentaExiste = 2;
      }else{
        this.cuentaExiste = 1;
      }
    })
  }

  agregarRegistro(){
   /* if (e !== null){
      e.preventDefault()
    }*/
   
    // if (event.keyCode === 9 ){
      this.cuentas.push(this.agregarFormularioTransacciones())
      this.agregarFormulario();
     
   //}
   // return
  }

}
