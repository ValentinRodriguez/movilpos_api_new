import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api/menuitem';
import { Subscription } from 'rxjs';
import { UiMessagesService } from 'src/app/services/globales/ui-messages.service';
import { TiendaService } from 'src/app/services/tienda/tienda.service';

@Component({
  selector: 'app-formulario-creacion-productos-tienda',
  templateUrl: './formulario-creacion-productos-tienda.component.html',
  styleUrls: ['./formulario-creacion-productos-tienda.component.scss']
})
export class FormularioCreacionProductosTiendaComponent implements OnInit {

  items: MenuItem[] = [];
  subscription: Subscription;

  constructor(private tiendaService: TiendaService,
              private uiMessage: UiMessagesService) { }

  ngOnInit(): void {
    this.items = [
      {label: 'General',routerLink: 'general'},
      {label: 'Clasificación',routerLink: 'clasificacion'},
      {label: 'Atributos',routerLink: 'atributos'},
      {label: 'Productos Enlazados',routerLink: 'productos-enlazados'},
      {label: 'Imagenes y Videos',routerLink: 'imagenes-videos'},
      {label: 'Datos Envío',routerLink: 'envios'},
      {label: 'Crear Producto',routerLink: 'crear-producto'},
    ];

    this.subscription = this.tiendaService.productoGuardado.subscribe(() =>{
      this.uiMessage.getMiniInfortiveMsg('tsc', 'success', 'Excelente!!', 'Producto Guardado Exitosamente');
    });
  }
  
  ngOnDestroy() {
    if (this.subscription) {
        this.subscription.unsubscribe();
    }
}
  
  
  
  
  
}
