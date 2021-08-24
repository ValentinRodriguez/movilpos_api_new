import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MonedasService } from 'src/app/services/mi-empresa/monedas.service';
import { UiMessagesService } from 'src/app/services/globales/ui-messages.service';
import { UsuarioService } from 'src/app/services/panel-control/usuario.service';
import { CuadresService } from 'src/app/services/contabilidad/cuadres.service';
import { DatosEstaticosService } from 'src/app/services/globales/datos-estaticos.service';

@Component({
  selector: 'app-formulario-cuadre-caja',
  templateUrl: './formulario-cuadre-caja.component.html',
  styleUrls: ['./formulario-cuadre-caja.component.scss'],
  providers:[CuadresService,UsuarioService,MonedasService]
})
export class FormularioCuadreCajaComponent implements OnInit {

  forma: FormGroup;
  usuario: any;
  minDate: Date;
  guardar = true;
  actualizando = false;
  actualizar = false;
  monedaExiste = 3;
  
  id: number;
  listSubscribers: any = [];
  denominaciones: any = [];
  totalBilletes = 0;
  totalRecibido = 0;
  saldoActual: number;
  saldoFinal: number;
  saldoInicial: number;
  puestosCaja: any = [];
  cajeros: any = [];
  turnos: any = [];
  sourceProducts: any = [];
  targetProducts: any = [];
  sucursales: any = [];
  sucursalesEscogidas: any = [];
  cajeroFiltrado: any[];
  items:any = [];

  constructor(private fb: FormBuilder,
    private uiMessage: UiMessagesService,
              private cuadresServ: CuadresService,
              private usuariosServ: UsuarioService,
              private datosEstaticosServ: DatosEstaticosService,
              private monedasServ: MonedasService) {
                this.usuario = this.usuariosServ.getUserLogged()
                this.crearFormulario();
  }

  ngOnDestroy(): void {
    this.listSubscribers.forEach(a => a.unsubscribe());
  }

  ngOnInit(): void {
    this.autoLlenado();
    this.listObserver();
 
    this.denominaciones = [
      { denominacion: '$.0', valor: 0, cantidad: 0, total: 0 },
      { denominacion: '$1', valor: 1, cantidad: 0, total: 0 },
      { denominacion: '$5', valor: 5, cantidad: 0, total: 0 },
      { denominacion: '$10', valor: 10, cantidad: 0, total: 0 },
      { denominacion: '$25', valor: 25, cantidad: 0, total: 0 },
      { denominacion: '$50', valor: 50, cantidad: 0, total: 0 },
      { denominacion: '$100', valor: 100, cantidad: 0, total: 0 },
      { denominacion: '$200', valor: 200, cantidad: 0, total: 0 },
      { denominacion: '$500', valor: 500, cantidad: 0, total: 0 },
      { denominacion: '$1000', valor: 1000, cantidad: 0, total: 0 },
      { denominacion: '$2000', valor: 2000, cantidad: 0, total: 0 },      
    ]
  }

  listObserver = () => {
    const observer1$ = this.monedasServ.actualizar.subscribe((resp: any) =>{
      this.guardar = false;
      this.actualizar = true;   
      this.id = Number(resp);      
      this.monedasServ.getDato(resp).then((res: any) => {         
        this.forma.get('divisa').setValue(res.divisa);
        this.forma.get('simbolo').setValue(res.simbolo);
        this.forma.patchValue(res);
      })
    })

    this.listSubscribers = [observer1$];
  };

  autoLlenado() {
    this.cuadresServ.autoLlenado().then((resp: any) => {
      
      
      resp.forEach(element => {
        if (element.data.length === 0) {
          this.items.push({label: this.datosEstaticosServ.capitalizeFirstLetter(element.label), routerLink: element.label})
        }
        switch (element.label) {
          case 'turnos':
            this.turnos = element.data;
            break;

          case 'sucursales':
            this.sucursales = element.data;
            break;

          case 'empleado-caja':
            this.cajeros = element.data;
            break;

          case 'area-caja':
            this.puestosCaja = element.data;
            break;

          default:
            break;
        }
      });  
    })
  }

  crearFormulario() {
    this.forma = this.fb.group({
      cajero:              ['', Validators.required],
      fecha:               ['', Validators.required],
      caja:                ['', Validators.required],
      turno:               ['', Validators.required],
      descripcion:         ['', Validators.required],
      cod_cia:             ['', Validators.required],
      suc_id:              ['', Validators.required],
      estado:              ['activo', Validators.required],
      usuario_creador:     [this.usuario.username, Validators.required],
      usuario_modificador: ['']
    })
  }

  guardarMoneda() {    
    //     
    // if (this.forma.invalid) {    
    //      
    //   this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios');      
    //   Object.values(this.forma.controls).forEach(control =>{          
    //     control.markAllAsTouched();
    //   })
    // }else{   
    //   switch (this.monedaExiste) {
    //     case 0:
    //       this.uiMessage.getMiniInfortiveMsg('tst','info','Espere','Verificando disponibilidad de nombre');          
    //       break;

    //     case 2:
    //       this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Existe una categoria con este nombre');          
    //       break;

    //     default:
    //       this.monedasServ.crearMoneda(this.forma.value).then(()=>{
    //         this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro creada de manera correcta'); 
    //         this.resetFormulario(); 
    //       })
    //       break;
    //   } 
    // }
  }
  
  calculaDeno(event, campo, index) {
    if (event.value !== null) {
      if (campo.valor === 0) {
        this.denominaciones[index].total = campo.cantidad;
      } else {
        this.denominaciones[index].total = campo.cantidad * campo.valor;        
      }
      this.calcularTotal();           
    }
  }

  calcularTotal() {
    this.totalBilletes = 0;
    this.totalRecibido = 0;
    this.denominaciones.forEach(element => {
      if (element.valor === 0) {
        this.totalRecibido += (element.cantidad / 100);       
      } else {
        this.totalBilletes += element.cantidad;
        this.totalRecibido += element.total;        
      }
      this.forma.get('importeEntrega').setValue(this.totalRecibido);
    });
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

  filtrarcajero(event) {
    const filtered: any[] = [];
    const query = event.query;
    
    for (let i = 0; i < this.cajeros.length; i++) {
      const size = this.cajeros[i];
      
      if (size.primernombre.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(size);
      }
    }
    this.cajeroFiltrado = filtered;
  }

  datosCajero(event) {
    // this.forma.get("cod_sp").setValue(event.cod_sp);
    // this.forma.get("cod_sp_sec").setValue(event.cod_sp);
  }

  actualizarMoneda(){
    this.forma.get('usuario_modificador').setValue(this.usuario.username);    
    if (this.forma.invalid) {  
           
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios');      
      Object.values(this.forma.controls).forEach(control =>{          
        control.markAllAsTouched();
      })
    }else{ 
      this.monedasServ.actualizarMoneda(this.id, this.forma.value).then((resp: any) => {
        this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro actualizado de manera correcta');
        this.resetFormulario();
      })
    }
  }

  cancelar() {
    this.actualizar = false;
    this.guardar = true;
    this.resetFormulario();
    this.monedasServ.guardando();    
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
