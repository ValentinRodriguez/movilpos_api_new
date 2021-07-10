import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, ControlContainer, FormGroupDirective, Validators } from '@angular/forms';
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
  regiones: any;
  provincias: any;
  municipios: any;
  sectores: any;

    constructor(private fb: FormBuilder,
                private paisesCiudadesServ: PaisesCiudadesService, ) { 
                  this.crearFormulario();
                }

    ngOnInit(): void {
      this.paisesCiudadesServ.getPaises().then((resp: any) =>{
        this.paises = resp;
      })
    }

    crearFormulario() {
      this.forma = this.fb.group({
        id_pais:             ['', Validators.required],
        id_zona:             ['', Validators.required],
        id_region:           ['', Validators.required],
        id_provincia:        ['', Validators.required],
        id_municipio:        ['', Validators.required],
        id_ciudad:           ['', Validators.required],
        id_sector:           ['', Validators.required],
      })
    }

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
  

    getNoValido(input: string) {
      return this.forma.get(input).invalid && this.forma.get(input).touched;
    }
}
