import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TiendaService } from 'src/app/services/tienda/tienda.service';

@Component({
  selector: 'app-atributos',
  templateUrl: './atributos.component.html',
  styleUrls: ['./atributos.component.scss']
})
export class AtributosComponent implements OnInit {
  uimessage: any;
  checked: any = [];
  atributos: any[] = [];
  materiales: any[] = [];
  actividades: any[] = [];
  edades: any[] = [];

  atributosModel = {
    talla: [],
    medida: '',
    estado: 'Nuevo',
    material: '',
    actividad: '',
    edad: '',
    color: [],
    step: 'atributo'
  }

  constructor(private tiendaSrv: TiendaService,
              private router: Router) { }
              
  ngOnInit(): void {
    const clasificacion = this.tiendaSrv.getProduct('atributo')

    switch (clasificacion.length) {
      case 1:
        this.tiendaSrv.getDataCategoria(clasificacion[0].id, 'categoria-plaza').then((resp: any) => {
           resp.atributo.forEach(element => {
            this.atributos.push(JSON.parse(element.atributo));          
          });  
        })
        break;
      
      case 2:
        this.tiendaSrv.getDataCategoria(clasificacion[1].id, 'subcategoria-plaza').then((resp: any) => {
           resp.atributo.forEach(element => {
            this.atributos.push(JSON.parse(element.atributo));          
          }); 
        })
        break;
      
      case 3:
        this.tiendaSrv.getDataCategoria(clasificacion[2].id, 'subsubcategoria-plaza').then((resp: any) => {
          resp.atributo.forEach(element => {                        
            this.setValues(element)            
            this.atributos.push(element);                     
            element.atributo = JSON.parse(element.atributo);
            this.checked.push(element.atributo);
          });                    
        })        
        break;
      
      default:
        break;
    }
  }

  setValues(element) {    
    switch (element.descripcion) {
      case 'material':
        this.materiales = JSON.parse(element.atributo);
        break;

      case 'actividad':
        this.actividades = JSON.parse(element.atributo);    
        break;

      case 'edad':
        this.edades = JSON.parse(element.atributo);               
        break;

      case 'talla':
        this.atributosModel.talla = JSON.parse(element.atributo);
        console.log(this.atributosModel);                
        break;
                     
      default:
        break;
    }
  }
  addColor(){this.atributosModel.color.push('#1976D2')}

  nextPage() {  
    this.tiendaSrv.createProduct(this.atributosModel, 'atributos');
    this.router.navigate(['plaza-online/creacion-productos-plaza/productos-enlazados']);
  }

  prevPage() {
      this.router.navigate(['plaza-online/creacion-productos-plaza/clasificacion']);
  }

}
