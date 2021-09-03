import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TiendaService } from 'src/app/services/tienda/tienda.service';

@Component({
  selector: 'app-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.scss']
})
export class CrearComponent implements OnInit {

  constructor(private tiendSrv: TiendaService,
              private router: Router) { }

  ngOnInit(): void {
    this.tiendSrv.returnToGeneral()
  }

  crearProducto() {
    const parametros = this.tiendSrv.ProductFull;
    let objTemp = {};
    let obj = {}
    for (const key in parametros) {
      if (parametros[key] !== null) {
        // objTemp[key] = parametros[key];   
        Object.keys(parametros[key]).forEach(key2 => {
          if (key === 'general') {
            obj[key2] = parametros[key][key2];      
          } else {
            obj[key] = parametros[key];
          }
        });
      }
    }
    console.log(obj);
    
    this.tiendSrv.crearProducto(obj).then((resp: any) =>{
      console.log(resp);      
    })
  }

  prevPage() {
    this.router.navigate(['plaza-online/creacion-productos-plaza/general']);
  }

}
