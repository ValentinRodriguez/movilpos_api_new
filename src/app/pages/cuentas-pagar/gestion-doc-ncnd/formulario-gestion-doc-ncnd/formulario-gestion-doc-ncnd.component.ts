import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/services/panel-control/usuario.service';

@Component({
  selector: 'app-formulario-gestion-doc-ncnd',
  templateUrl: './formulario-gestion-doc-ncnd.component.html',
  styleUrls: ['./formulario-gestion-doc-ncnd.component.scss']
})
export class FormularioGestionDocNcndComponent implements OnInit {

  forma: FormGroup;
  guardar = true;
  actualizar = false;
  usuario: any;

  documento = [
    { value: 'nd', label: 'Nota de Debito' },
    { value: 'nc', label:'Nota de Credito'}
  ]
  constructor(private fb: FormBuilder,
              private usuarioServ: UsuarioService) {
              this.usuario = this.usuarioServ.getUserLogged();
    this.crearFormulario()
  }

  ngOnInit(): void {
  }

  guardarDocumento() {

  }

  tipoDoc(data) {

  }

  crearFormulario() {
    this.forma = this.fb.group({
      tipo_doc:            ['', Validators.required],      
      usuario_creador:     [this.usuario.username, Validators.required],
      usuario_modificador: [''],
      estado:              ['activo'],
      cuentas_no:          this.fb.array([])
    })
  }

  // FUNCIONES PARA EL MANEJO DE LOS ERRORES EN LOS CAMPOS DEL FORMULARIO
  getNoValido(input: string) {
    return this.forma.get(input).invalid && this.forma.get(input).touched;
  }
}
