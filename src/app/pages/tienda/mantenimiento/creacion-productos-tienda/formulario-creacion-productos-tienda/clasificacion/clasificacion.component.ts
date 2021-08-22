import { Component, OnInit } from '@angular/core';
import { CategoriasStoreService } from 'src/app/services/tienda/categorias-store.service';

@Component({
  selector: 'app-clasificacion',
  templateUrl: './clasificacion.component.html',
  styleUrls: ['./clasificacion.component.scss']
})
export class ClasificacionComponent implements OnInit {

  constructor(private categoriasStoreSrv: CategoriasStoreService) { }

  ngOnInit(): void {
    this.categoriasStoreSrv.getDatos().then((resp: any) =>{
      console.log(resp);      
    }) 
  }

}
