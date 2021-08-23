import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FileUpload } from 'primeng/fileupload';
import { CategoriasStoreService } from 'src/app/services/tienda/categorias-store.service';
import { TiendaService } from 'src/app/services/tienda/tienda.service';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss'],
  providers: [CategoriasStoreService,TiendaService]
})
export class GeneralComponent implements OnInit {

  generalInformation: any;
  submitted: boolean = false;
  rebaja: boolean = false;
  uploadedFiles: any[] = [];
  @ViewChild(FileUpload)
  fileUpload: FileUpload
  tipo: any;
  listSubscribers: any = [];
  constructor(private router: Router,
    private tiendaServ: TiendaService) { }
    
    ngOnInit() { 
      this.listObserver();

      this.generalInformation = {
        titulo: 'testse',
        descripcion: 'testse',
        tipo: null,
        precio: 100,
        precio_rebajado: null,
        stock: 50,
        cantidadLim: 50,
        fecha_rebaja: null,
        limDescargas: null,
        fechaLimDescarga: null,
        galeriaImagenes: null,
    };
  }
  
  ngOnDestroy(): void {
    this.listSubscribers.forEach(a => a.unsubscribe());
  }

  listObserver = () => {
    const observer1$ = this.tiendaServ.tipoProducto.subscribe((resp: any) =>{
      this.tipo = resp.value;      
    })

    this.listSubscribers = [observer1$];
  };

  programar() {
    this.rebaja = !this.rebaja    
  }

  onFileSelect(event) {
     this.generalInformation.galeriaImagenes = this.fileUpload.files;
  }

  nextPage() {
      if (this.generalInformation.titulo && this.generalInformation.descripcion && 
        this.generalInformation.precio && this.generalInformation.stock) {
        this.generalInformation.step = 'general';
        this.tiendaServ.createProduct(this.generalInformation);
        this.router.navigate(['plaza-online/creacion-productos-plaza/clasificacion']);
        return;
      }
      this.submitted = true;
  }
}
