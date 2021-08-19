import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TiendaService } from 'src/app/services/tienda/tienda.service';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss']
})
export class GeneralComponent implements OnInit {

  personalInformation: any;
  submitted: boolean = false;
  rebaja: boolean = false;
  
  constructor(private router: Router) { }

  ngOnInit() { 
      this.personalInformation = {
        titulo: '',
        descripcion: '',
        tipo: null,
        precio: null,
        precio_rebajado: null,
        stock: null,
        cantidadLim: null,
        fecha_rebaja: null,
        limDescargas: null,
        fechaLimDescarga: null
    };
    
  }

  programar() {
    this.rebaja = !this.rebaja    
  }

  nextPage() {
      if (this.personalInformation.titulo && this.personalInformation.descripcion && this.personalInformation.age) {
          // this.ticketService.ticketInformation.personalInformation = this.personalInformation;
          this.router.navigate(['plaza-online/creacion-productos-plaza/clasificacion']);
          return;
      }
      this.submitted = true;
  }
}
