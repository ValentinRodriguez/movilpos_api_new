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

  estado = "nuevo";
  
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
        this.tiendaSrv.getDataCategoria(clasificacion[0].id, 'subcategoria-plaza').then((resp: any) => {
           resp.atributo.forEach(element => {
            this.atributos.push(JSON.parse(element.atributo));          
          }); 
        })
        break;
      
      case 3:
        this.tiendaSrv.getDataCategoria(clasificacion[0].id, 'subsubcategoria-plaza').then((resp: any) => {
          resp.atributo.forEach(element => {
            element.atributo = JSON.parse(element.atributo);
            this.checked.push(element.atributo);
            this.atributos.push(element);                     
          });          
          console.log(this.checked);
        })
        
        break;
      
      default:
        break;
    }
  }

  ver(event) {
    console.log(event);    
  }

  nextPage() {
    var bandera = 0;
    this.checked.forEach(element => {
      element.forEach(element => {
        if (element.value === true) {
          bandera += 1;
        }
      });
    });  
    console.log(bandera);
    
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
