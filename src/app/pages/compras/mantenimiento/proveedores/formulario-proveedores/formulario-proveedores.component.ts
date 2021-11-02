import { DOCUMENT } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { ListadoCatalogoCuentasComponentsComponent } from 'src/app/components/listado-catalogo-cuentas-components/listado-catalogo-cuentas-components.component';
import { ProveedoresService } from 'src/app/services/compras/proveedores.service';
import { CgcatalogoService } from 'src/app/services/contabilidad/cgcatalogo.service';
import { DatosEstaticosService } from 'src/app/services/globales/datos-estaticos.service';
import { PaisesCiudadesService } from 'src/app/services/globales/paises-ciudades.service';
import { UiMessagesService } from 'src/app/services/globales/ui-messages.service';
import { TipoProveedorService } from 'src/app/services/mi-empresa/tipo-proveedor.service';

@Component({
  selector: 'app-formulario-proveedores',
  templateUrl: './formulario-proveedores.component.html',
  styleUrls: ['./formulario-proveedores.component.scss'],
  providers: [PaisesCiudadesService, ProveedoresService, CgcatalogoService, TipoProveedorService]
})
export class FormularioProveedoresComponent implements OnInit {
  forma: FormGroup;
  usuario:any;
  guardando = false;
  guardar = true;
  actualizando = false;
  actualizar = false;
  proveedorExiste = 3;
  id: string;  
  listSubscribers: any = [];

  condpago:any[] = [
    {label: "CONTRA ENTREGA", value: "contra-entrega"}
  ];
  
  monedas:any[] = [
    {label: "PESOS $RD", value: "$RD"}
  ];

  constructor(private fb: FormBuilder, 
              public router: Router,              
              private paisesCiudadesServ: PaisesCiudadesService,
              private uiMessage: UiMessagesService,
              private proveedoresServ:ProveedoresService,
              private tipoProveedorServ: TipoProveedorService,
              public dialogService: DialogService,) { 
      ;
      this.crearFormulario() 
  }

  ngOnInit(): void {
    this.listObserver();
  }
  
  ngOnDestroy(): void {
    this.listSubscribers.forEach(a => a.unsubscribe());
  }

  listObserver = () => {
    const observer2$ = this.proveedoresServ.actualizar.subscribe((resp: any) =>{
      this.guardar = false;
      this.actualizar = true;    
      this.id = resp[0]+'-'+resp[1];
      
      this.proveedoresServ.getDato(resp[0]+'-'+resp[1]).then((res: any) => {
        this.forma.patchValue(res);        
        this.forma.get('cond_pago').setValue(this.condpago.find(doc => doc.id == res.cond_pago));    
        this.forma.get('id_moneda').setValue(JSON.parse(res.moneda));
      })
    })
    this.listSubscribers = [observer2$];
  };

    crearFormulario() {
    this.forma = this.fb.group({ 
      email:               ['', Validators.compose([ Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")])],  
      nom_sp:              ['', Validators.required],          
      dir_sp:              ['', Validators.required],
      cond_pago:           ['', Validators.required],   
      moneda:              ['', Validators.required], 
      contacto:            ['', Validators.required],   
      tel_contacto:        ['', Validators.required],   
      usuario_modificador: ['']
    })
  }

  guardarProveedor(){    
    console.log(this.forma.value);
    
    if (this.forma.invalid) { 
           
      this.uiMessage.getMiniInfortiveMsg('tst','error','Atención','Debe completar los campos que son obligatorios');      
      Object.values(this.forma.controls).forEach(control =>{          
        if (control instanceof FormArray) {    
          Object.values(control.controls).forEach(control => {
            control.markAsTouched();
          });
        } else {
          control.markAllAsTouched();
        }
      })
    }else{    
      this.forma.value.cond_pago = this.forma.value.cond_pago.value
      this.forma.value.moneda = this.forma.value.moneda.value
      if (this.actualizar) {
        this.proveedoresServ.actualizarProveedor(this.id, this.forma.value).then((resp: any)=>{
          this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro actualizado de manera correcta');   
          this.restaurarFormulario();            
        })
      }else{
        this.proveedoresServ.crearProveedor(this.forma.value).subscribe((resp:any)=>{
          if (resp.ok) {
            this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente',"Proveedor creado exitosamente!!");      
            this.restaurarFormulario();            
          }
        })
      }        
    }      
  } 

  verificaProveedor(data){        
    if (data === "") {
      this.proveedorExiste = 3;
      return;
    }
    this.proveedorExiste = 0;
    this.proveedoresServ.busquedaProveedor(data).subscribe((resp: any)=>{
      console.log(resp);
      
      if (resp.ok) {
        if(resp.data.length === 0) {
          this.proveedorExiste = 1;
        }else{
          this.proveedorExiste = 2;
        }        
      }
    })
  }
 
  restaurarFormulario() {
    this.forma.reset();
  }

  cancelar() {
    this.actualizar = false;
    this.guardar = true;
    this.restaurarFormulario()
    this.proveedoresServ.guardando();    
  }

  // FUNCIONES PARA EL MANEJO DE LOS ERRORES EN LOS CAMPOS DEL FORMULARIO
  getNoValido(input: string) {
    return this.forma.get(input).invalid && this.forma.get(input).touched;
  }
}
