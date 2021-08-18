import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss']
})
export class GeneralComponent implements OnInit {

  personalInformation: any;
  submitted: boolean = false;
  
  constructor(private router: Router) { }

  ngOnInit() { 
      // this.personalInformation = this.ticketService.getTicketInformation().personalInformation;
      this.personalInformation = {
        titulo: '',
        descripcion: '',
        tipo: '',
        virtual: false,
        descargable: false,
        precio: null,
        precio_rebajado: null,
        stock: null,
        fecha_rebaja: null
      };
  }

  programar() {
    
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
