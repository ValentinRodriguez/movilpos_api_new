import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-formulario-costo-standard',
  templateUrl: './formulario-costo-standard.component.html',
  styleUrls: ['./formulario-costo-standard.component.scss']
})
export class FormularioCostoStandardComponent implements OnInit {

  forma: FormGroup;
  ventas: any[] = [];

  constructor(private fb: FormBuilder) {
    this.crearFormulario()
  }

  ngOnInit(): void {
  }

  crearFormulario() {
    this.forma = this.fb.group({
      ventas: [''],
    })
  }

  crearCosto() {

  }

}
