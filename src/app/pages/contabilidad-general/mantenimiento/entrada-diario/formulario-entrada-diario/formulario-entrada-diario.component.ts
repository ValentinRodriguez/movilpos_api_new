import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogService } from 'primeng/dynamicdialog';
import { ListadoCatalogoCuentasComponentsComponent } from 'src/app/components/listado-catalogo-cuentas-components/listado-catalogo-cuentas-components.component';
import { CgcatalogoService } from 'src/app/services/contabilidad/cgcatalogo.service';
import { EntradasDiarioService } from 'src/app/services/contabilidad/entradas-diario.service';

import { UiMessagesService } from 'src/app/services/globales/ui-messages.service';

@Component({
  selector: 'app-formulario-entrada-diario',
  templateUrl: './formulario-entrada-diario.component.html',
  styleUrls: ['./formulario-entrada-diario.component.scss'],
  providers:[EntradasDiarioService,CgcatalogoService,]
})
export class FormularioEntradaDiarioComponent implements OnInit {
  totalC = 0;
  totalD = 0;
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
  valor:number;
    
  listSubscribers: any = [];
  cliente:any[] = [];

  constructor(private fb: FormBuilder,
              private uiMessage: UiMessagesService,
              private entradasServ: EntradasDiarioService,
              public dialogService: DialogService,
              public cuentaServices: CgcatalogoService,
              @Inject(DOCUMENT) private document: Document) { 
                
                this.crearFormulario();
  }
  ngOnDestroy(): void {
    this.listSubscribers.forEach(a => a.unsubscribe());
  }

  ngOnInit(): void {
    this.mask="ED.99-99/9999"
    this.listObserver();

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
      { field: 'acciones', header: 'Acciones' },
    ]

    //  this.catalogoEscogido()
   // this.agregarRegistro();

    
  }

  listObserver = () => {
    
    const observer1$ = this.entradasServ.actualizar.subscribe((resp: any) =>{
      this.guardar = false;
      this.actualizar = true;   
      this.id = Number(resp);      
      let index = 0;
      this.entradasServ.getDato(resp).then((res: any) => {
        this.forma.get('fecha').setValue(new Date(res.fecha));
        this.forma.get('ref').setValue(res.ref);
        this.forma.get('detalle').setValue(res.detalle);
        this.forma.get('mes').setValue(res.mes);
        this.forma.get('periodo').setValue(res.periodo);
        
        res.cuentas.forEach(element => {
          this.cuentas.push(element);
          (<FormArray>this.forma.get('cuentas')).push(this.fb.group({
            cuenta_no:        [element.cuenta_no, Validators.required],
            departamento:     [element.departamento],
            cod_aux:          [element.cod_aux],
            cod_sec:          [element.cod_sec],
            num_doc:          [element.num_doc],
            debito:           [element.debito],
            credito:          [element.credito]
          }));   
          this.totalC += Number(((this.cuenta_no).at(index) as FormGroup).get("credito").value); 
          this.totalD += Number(((this.cuenta_no).at(index) as FormGroup).get("debito").value);     
        });
      })
    })

    const observer2$ = this.cuentaServices.catalogoEscogido.subscribe((resp:any)=>{
      this.cuentas=resp;
    })

    this.listSubscribers = [observer1$,observer2$];
  };
  
  crearFormulario() {
    this.forma = this.fb.group({
      fecha:               ['', Validators.required],
      ref:                 ['', Validators.required],
      mes:                 [''],
      periodo:             [''],
      detalle:             [''],
      estado:              ['activo'],
      usuario_modificador: [''],
      cuentas: this.fb.array([])     
    })    
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
    if (this.forma.invalid) { 
           
      this.uiMessage.getMiniInfortiveMsg('tst','error','Error!!','Debe completar los campos que son obligatorios');       
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
      })
    }else{    
      const diferencia = this.calculaTotal(this.cuenta_no.value);  

      if (diferencia !== 0) {
        this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','La transaccion no esta cuadrada.'); 
        return;
      }
      this.entradasServ.crearEntrada(this.forma.value).then((resp: any)=>{       
        this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente!','Registro creado de manera correcta');           
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

    if (Number(this.secuencia) < 10){
      this.secuencia="0"+this.secuencia
    }
    this.mask="ED.99-"+this.secuencia+"/"+this.mes+this.ano
 
    this.forma.get("periodo").setValue(this.mes+this.ano);
    this.forma.get("mes").setValue(this.mes);

  }

  onSelectDate1(fecha) {
    let d = new Date(Date.parse(fecha));
    return `${d.getFullYear()}/${d.getMonth()+1}/${d.getDate()}`;
  }

  buscaCuentas() {
     this.dialogService.open(ListadoCatalogoCuentasComponentsComponent, {
      header: 'Catalogo de Productos',
      width: '50%'
    });
  }

  actualizarEntrada(){    
     
    const fecha = this.forma.get('fecha').value;   
    this.forma.get('fecha').setValue(this.onSelectDate1(fecha));     
    this.forma.get('usuario_modificador').setValue(this.usuario.username);    
    if (this.forma.invalid) {   
          
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios');      
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
     })
    }else{
      this.entradasServ.actualizarEntrada(this.id, this.forma.value).then((resp: any) => {        
        this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro actualizado de manera correcta');
         
      })
    }
  }

  cancelar() {
    this.actualizar = false;
    this.guardar = true;
    this.forma.reset();
    this.forma.get('estado').setValue('activo');
    this.entradasServ.guardando();    
  }

  getNoValido(input: string) {
    return this.forma.get(input).invalid && this.forma.get(input).touched;
  }

  verificaCuenta(data){     
    if (data === "") {
      this.cuentaExiste = 3;
      return;
    }
    this.cuentaExiste = 0;    
    this.cuentaServices.busquedaCatalogo(data).subscribe((resp: any)=>{
      if (resp.ok) {
        if(resp.length === 0) {
          this.cuentaExiste = 2;
        }else{
          this.cuentaExiste = 1;
        }        
      }
    })
  }

  borrarCuenta(id) {
    this.cuentas.splice(id,1)      
  }

  agregarRegistro(){  
    this.cuentas.push(this.agregarFormularioTransacciones())
    this.agregarFormulario(); 
  }

  imprimirOrden(num_oc) {
    const link = this.document.createElement('a');
    link.target = '_blank';
    link.href = `${URL}/reporte/orden-compras/${num_oc}`;
    link.click();
    link.remove();  
  }

  calculaTotal(data) {
    this.totalD = 0;
    this.totalC = 0;
      
    data.forEach((element:any) => {      
      this.totalD += element.debito || 0;        
      this.totalC += element.credito || 0;
    });
     
      return Number(this.totalD) - Number(this.totalC);
  }
  get cuenta_no() {  
   
    return this.forma.get('cuentas') as FormArray;
  }

  get ref() {   
    return this.forma.get('ref') as FormGroup;
  }

  verificaRef(event){
    this.entradasServ.verificaEntrada(this.ref.value).then((resp: any) => { 
      
      if (resp !== null) {
        this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Este NCF ya ha ido registrado con este proveedor'); 
        this.ref.reset();
        return
      }
    })
  }

}

