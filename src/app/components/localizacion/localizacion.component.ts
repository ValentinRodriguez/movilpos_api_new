import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, ControlContainer, FormGroupDirective } from '@angular/forms';
import { PaisesCiudadesService } from 'src/app/services/paises-ciudades.service';

@Component({
  selector: 'app-localizacion',
  templateUrl: './localizacion.component.html',
  styleUrls: ['./localizacion.component.scss'],
  // viewProviders: [
  //   {
  //     provide: ControlContainer,
  //     useExisting: FormGroupDirective
  //   }
  // ]
})
export class LocalizacionComponent implements OnInit {
    
    ciudades: any;
    paises: any;
    @Input() forma: FormGroup;

    constructor(private fb: FormBuilder,
                private paisesCiudadesServ: PaisesCiudadesService, ) { 
                  // this.crearFormulario();
                }

    ngOnInit(): void {
      this.paisesCiudadesServ.getPaises().then((resp: any) =>{
        this.paises = resp;
      })
    }

    // crearFormulario() {
    //   this.forma = this.fb.group({
    //     id_pais: ['']
    //   })
    // }

    buscaPaises(event) {
      this.paisesCiudadesServ.buscaCiudad(event).then((resp:any) => {  
       this.ciudades = resp;
     })   
   }

    // getNoValido(input: string) {
    //   return this.forma.get(input).invalid && this.forma.get(input).touched;
    // }
}
