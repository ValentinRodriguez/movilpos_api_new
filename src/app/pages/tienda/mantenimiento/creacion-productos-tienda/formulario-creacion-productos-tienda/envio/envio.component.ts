import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TiendaService } from 'src/app/services/tienda/tienda.service';

@Component({
  selector: 'app-envio',
  templateUrl: './envio.component.html',
  styleUrls: ['./envio.component.scss']
})
export class EnvioComponent implements OnInit {

  generalInformation: any;
  submitted: boolean = false;
  rebaja: boolean = false;
  uploadedFiles: any[] = [];
  tipo: any;
  listSubscribers: any = [];

  constructor(private router: Router,
              private tiendaServ: TiendaService) { }
    
    ngOnInit() { 
      this.listObserver();

      this.generalInformation = {
        peso: 100,
        notas: 'testse',

        titulo: 'testse',
        tipo: null,
        precio_rebajado: null,
        stock: 50,
        cantidadLim: 50,
        fecha_rebaja: null,
        limDescargas: null,
        fechaLimDescarga: null,
        galeriaImagenes: null,
        documentosDigitales: null
    };
  }
  
  ngOnDestroy(): void {
    this.listSubscribers.forEach(a => a.unsubscribe());
  }

  listObserver = () => {
    const observer1$ = this.tiendaServ.tipoProducto.subscribe((resp: any) =>{
      this.tipo = resp.value;
      console.log(this.tipo);      
    })

    this.listSubscribers = [observer1$];
  };

  programar() {
    this.rebaja = !this.rebaja    
  }


  nextPage() {
      if (this.generalInformation.titulo && this.generalInformation.descripcion && 
        this.generalInformation.precio && this.generalInformation.stock) {
        this.tiendaServ.createProduct(this.generalInformation, 'envio');
        this.router.navigate(['plaza-online/creacion-productos-plaza/crear-producto']);
        return;
      }
      this.submitted = true;
  }

}
