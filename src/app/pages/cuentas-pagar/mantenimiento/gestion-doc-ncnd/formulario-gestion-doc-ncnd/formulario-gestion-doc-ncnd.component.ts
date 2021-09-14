import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GestionDocNcdcService } from 'src/app/services/cuentas-pagar/gestion-doc-ncdc.service';
import { UiMessagesService } from 'src/app/services/globales/ui-messages.service';


@Component({
  selector: 'app-formulario-gestion-doc-ncnd',
  templateUrl: './formulario-gestion-doc-ncnd.component.html',
  styleUrls: ['./formulario-gestion-doc-ncnd.component.scss'],
  providers:[GestionDocNcdcService]
})
export class FormularioGestionDocNcndComponent implements OnInit {

  forma: FormGroup;
  guardar = true;
  actualizar = false;
  cols: any;
  documento: any = [];
  
  constructor(private fb: FormBuilder,
              private uiMessage: UiMessagesService,
              private ncndService: GestionDocNcdcService) {
    this.crearFormulario()
  }

  ngOnInit(): void {
    this.documento=[
      { label: 'Nota de Debito', value: 'nd' },
      { label:'Nota de Credito', value: 'nc'}
    ]

    this.cols = [
      {field: 'tipo_doc',header: 'Tipo Documento'},
      {field: 'num_doc',header: 'Numero'},
      {field: 'cta_ctble',header: 'Cuenta'},
      {field: 'cod_sp',header: 'Codigo Suplidor'},
      {field: 'cod_sp_sec',header: 'Secuencia Suplidor'},
      {field: 'fecha_orig',header: 'Fecha'},
      {field: 'monto_itbi',header: 'itbis'},
      {field: 'valor',header: 'Valor'},
      {field: 'codigo_fiscal',header: 'Tipo Ncf'},
      {field: 'ncf',header: 'Ncf'},
      {field: 'detalle',header: 'Detalle'},
    ]

  }
  
  guardarDocumento() {
   // this.forma.get('cod_cia').setValue(this.usuario.empresa.cod_cia);  
    if (this.forma.invalid){
      this.uiMessage.getMiniInfortiveMsg('tst','error','ERROR','Debe completar los campos que son obligatorios');
      Object.values(this.forma.controls).forEach(control=>{
        control.markAllAsTouched();
      })
    }else{
      const fecha_orig = this.forma.get('fecha_orig').value;
      this.forma.get('fecha_orig').setValue(this.onSelectDate(fecha_orig));
      this.ncndService.crearDocumento(this.forma.value).then((resp:any)=>{
        this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro Guardado');
      })
    }
  }

  tipoDoc(data) {

  }

  crearFormulario() {
    this.forma = this.fb.group({
      tipo_doc:                 ['', Validators.required], 
      num_doc:                  [''],
      cta_ctble:                [''],
      cod_sp:                   [''],
      cod_sp_sec:               [''],
      fecha_orig:                    [''],
      monto_itbi:                [''],
      valor:                    [''],
      codigo_fiscal:            [''],
      ncf:                      [''],  
      detalle:                  [''],
      estado:                   ['activo'],
    })
  }

  // FUNCIONES PARA EL MANEJO DE LOS ERRORES EN LOS CAMPOS DEL FORMULARIO
  getNoValido(input: string) {
    return this.forma.get(input).invalid && this.forma.get(input).touched;
  }

  onSelectDate(fecha) {
    let d = new Date(Date.parse(fecha));
    return `${d.getFullYear()}/${d.getMonth()+1}/${d.getDate()}`;
  }
}
