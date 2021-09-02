import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api/menuitem';
import { UiMessagesService } from 'src/app/services/globales/ui-messages.service';
import { TiendaService } from 'src/app/services/tienda/tienda.service';

@Component({
  selector: 'app-formulario-creacion-productos-tienda',
  templateUrl: './formulario-creacion-productos-tienda.component.html',
  styleUrls: ['./formulario-creacion-productos-tienda.component.scss']
})
export class FormularioCreacionProductosTiendaComponent implements OnInit {

  items: MenuItem[] = [];
  items$: MenuItem[] = [];
  listSubscribers: any = [];

  constructor(private tiendaService: TiendaService,
              private uiMessage: UiMessagesService,
              private router: Router) { }

  ngOnInit(): void {
    this.listObserver();
    
    this.items$ = [
      {label: 'General',routerLink: 'general'},
      {label: 'Clasificación',routerLink: 'clasificacion'},
      {label: 'Atributos',routerLink: 'atributos'},
      {label: 'Productos Enlazados',routerLink: 'productos-enlazados'},
      // {label: 'Datos Envío',routerLink: 'envios'},
      {label: 'Crear Producto',routerLink: 'crear-producto'},
    ];
    
    this.items = this.items$;
  }
  
  ngOnDestroy() {
    this.listSubscribers.forEach(a => a.unsubscribe());
  }
  
  listObserver = () => {
    const observer1$ = this.tiendaService.productoGuardado.subscribe(() =>{
      this.uiMessage.getMiniInfortiveMsg('tsc', 'success', 'Excelente!!', 'Producto Guardado Exitosamente');
    });

    const observer2$ = this.tiendaService.tipoProducto.subscribe((resp) => {      
      switch (resp.value) {
        case 'basico':
          this.items = this.items$;
          break;
        
          case 'variable':
            this.items = this.items$.slice();
            this.items.pop();
            this.items.push({label: 'Variantes',routerLink: 'variantes'})
            this.items.push({label: 'Crear Producto',routerLink: 'crear-producto'})
          break;
        
          case 'digital':
            let temp = this.items$.slice();
            this.items = temp.filter(function (e: any) {              
              return e.routerLink !== 'envios';
            });
          break;
        
          case 'compuesto':
            this.items = [
              {label: 'Productos Enlazados',routerLink: 'productos-enlazados'},
              {label: 'Crear Producto',routerLink: 'crear-producto'},
            ];
          break;
        
        default:
          this.items = this.items$;
          break;
      }
      this.router.navigate([`plaza-online/creacion-productos-plaza/${this.items[0].routerLink}`]);
    });

    this.listSubscribers = [observer1$,observer2$];
  };
}
