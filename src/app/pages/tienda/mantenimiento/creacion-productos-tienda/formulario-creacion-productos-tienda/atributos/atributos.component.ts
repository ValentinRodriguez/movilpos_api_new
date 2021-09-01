import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TiendaService } from 'src/app/services/tienda/tienda.service';

@Component({
  selector: 'app-atributos',
  templateUrl: './atributos.component.html',
  styleUrls: ['./atributos.component.scss']
})
export class AtributosComponent implements OnInit {
  atributo: any;
  uimessage: any;
  checked: any = [];
  atributos: any[] = [];
  estado = "Nuevo";
  
  atributosModel = {
    memoria: {},
    talla: [],
    medida: {},
    estado: {},
    almacenamiento: {},
    camara: {},
    procesador: {}
  }

  marca = '';
  medida = '';
  memoria = [];
  memorias: any[] = [];
  almacenamientos: any;
  camara: any;
  camaras: any;
  procesadores: any;
  procesador: any;

  constructor(private tiendaSrv: TiendaService,
              private router: Router) { }

  ngOnInit(): void {
    const clasificacion = JSON.parse(localStorage.getItem('clasificacion'));

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
            switch (element.descripcion) {
              case 'talla':
                this.atributosModel.talla = JSON.parse(element.atributo);
                console.log(this.atributosModel);                
                break;
              
              case 'memoria':
                this.memorias = JSON.parse(element.atributo);                
                break;
              
                case 'almacenamiento':
                  this.almacenamientos = JSON.parse(element.atributo);                
                break;
              
                case 'camara':
                  this.camaras = JSON.parse(element.atributo);                
                break;
              
                case 'procesador':
                  this.procesadores = JSON.parse(element.atributo);                
                  break;
              default:
                break;
            }
                        
            this.atributos.push(element);                     
            element.atributo = JSON.parse(element.atributo);
            this.checked.push(element.atributo);
          });          
          console.log(this.checked);
          console.log(this.atributos);
          
        })
        
        break;
      
      default:
        break;
    }
  }

  nextPage() {
    console.log(this.atributosModel);
    
    // this.router.navigate(['plaza-online/creacion-productos-plaza/productos-enlazados']);
    // if (bandera === true) {
    //   this.checked.step = 'atributo'
    //   this.tiendaSrv.createProduct(this.checked);
    // }else{
    //   this.uimessage.getMiniInfortiveMsg('tst','warn','Atención','Debe escoger una categoría')
    // }
  }

  prevPage() {
      this.router.navigate(['plaza-online/creacion-productos-plaza/clasificacion']);
  }

}
