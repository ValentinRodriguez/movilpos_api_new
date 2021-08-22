import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api/menuitem';
import { CategoriasStoreService } from 'src/app/services/tienda/categorias-store.service';

@Component({
  selector: 'app-clasificacion',
  templateUrl: './clasificacion.component.html',
  styleUrls: ['./clasificacion.component.scss']
})
export class ClasificacionComponent implements OnInit {

  items: MenuItem[];
  
  constructor(private categoriasStoreSrv: CategoriasStoreService,
              private router: Router) { }

  ngOnInit(): void {
    this.categoriasStoreSrv.getDatos().then((resp: any) =>{
      console.log(resp);      
      let temp2: any[] = [];
      
      resp.forEach((element: any) => {                
         let dato = {
              label: element.descripcion, 
              // url: element.url,
              icon: 'pi pi-fw pi-file',
              items: this.crearhijos(element.children)
          }                
          temp2.push(dato)
      });
      this.items = temp2
      console.log(this.items);
      
    }) 
  }

  crearhijos(element: any) {
    const temp: any = [];        
    element.forEach((subelement: any) => {                        
        let obj = {
          label: subelement.descripcion, 
          icon: 'pi pi-fw pi-file',
          items: this.crearhijos(subelement.children || []).length != 0 ? this.crearhijos(subelement.children || []) : null
        }
        temp.push(obj)
    });        
    return temp
} 

  nextPage() {
    // if (this.seatInformation.class && this.seatInformation.seat && this.seatInformation.wagon) {
    //     this.ticketService.ticketInformation.seatInformation = this.seatInformation;
    //     this.router.navigate(['steps/payment']);
    // }
  }

  prevPage() {
      this.router.navigate(['plaza-online/creacion-productos-plaza/general']);
  }
}
