import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TreeNode } from 'primeng/api/treenode';
import { UiMessagesService } from 'src/app/services/globales/ui-messages.service';
import { CategoriasStoreService } from 'src/app/services/tienda/categorias-store.service';
import { TiendaService } from 'src/app/services/tienda/tienda.service';

@Component({
  selector: 'app-clasificacion',
  templateUrl: './clasificacion.component.html',
  styleUrls: ['./clasificacion.component.scss']
})
export class ClasificacionComponent implements OnInit {

  items: TreeNode[];
  selectedFile: TreeNode;
  categoria: any = [];
  
  constructor(private categoriasStoreSrv: CategoriasStoreService,
              private tiendaServ: TiendaService,
              private router: Router,
              private uimessage: UiMessagesService) { }

  ngOnInit(): void {
    this.categoriasStoreSrv.getDatos().then((resp: any) =>{    
      let temp2: any[] = [];
      
      resp.forEach((element: any) => {                        
         let dato = {
              label: element.descripcion.toUpperCase(), 
              data: element.id,
              expandedIcon: "pi pi-folder-open",
              collapsedIcon: "pi pi-folder",
              children: this.crearhijos(element.children)
          }                
          temp2.push(dato)
      });

      this.items = temp2    
    }) 
  }

  crearhijos(element: any) {
    const temp: any = [];        
    element.forEach((subelement: any) => {                        
        let obj = {
          label: subelement.descripcion.toUpperCase(), 
          data: subelement.id,
          expandedIcon: "pi pi-folder-open",
          collapsedIcon: "pi pi-folder",
          children: this.crearhijos(subelement.children || []).length != 0 ? this.crearhijos(subelement.children || []) : null
        }
        temp.push(obj)
    });        
    return temp
  } 

  nodeSelect(event) {
    this.categoria = []
    if (event.node.parent === undefined) {
      this.categoria.push({descripcion:event.node.label, id:event.node.data})
    }else{
      if (event.node.parent.parent) { 
        this.categoria.push(
          {descripcion: event.node.parent.parent.label, id:event.node.parent.parent.data},
          {descripcion: event.node.parent.label, id:event.node.parent.data},
          {descripcion: event.node.label, id:event.node.data}
        )
      } else {      
        this.categoria.push(
          {descripcion: event.node.parent.label, id:event.node.parent.data},
          {descripcion: event.node.label, id:event.node.data}
        )     
      }
    }
  }

  nodeUnselect(event) {
    this.categoria = [];
  }

  nextPage() {
    if (this.categoria.length !== 0) {      
      this.router.navigate(['plaza-online/creacion-productos-plaza/atributos']);
      this.categoria.step = 'clasificacion'
      this.tiendaServ.createProduct(this.categoria);
    }else{
      this.uimessage.getMiniInfortiveMsg('tst','warn','Atención','Debe escoger una categoría')
    }
  }

  prevPage() {
      this.router.navigate(['plaza-online/creacion-productos-plaza/general']);
  }
}
