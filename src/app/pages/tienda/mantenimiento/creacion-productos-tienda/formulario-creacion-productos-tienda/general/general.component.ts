import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FileUpload } from 'primeng/fileupload';
import { GlobalFunctionsService } from 'src/app/services/globales/global-functions.service';
import { UiMessagesService } from 'src/app/services/globales/ui-messages.service';
import { TiendaService } from 'src/app/services/tienda/tienda.service';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss'],
  // providers: [CategoriasStoreService,TiendaService]
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
              private uimessage: UiMessagesService,
              private gf: GlobalFunctionsService,
              private tiendaServ: TiendaService) { }
    
    ngOnInit() { 
      this.listObserver();
      const params = this.tiendaServ.getProduct('general');
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
        documentosDigitales: null
      };
      this.setValues(params)
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

  setValues(params) {    
    if (params !== null) {
      Object.keys(this.generalInformation).forEach((key) => {
        switch (key) {
          // case 'documentosDigitales':
          case 'galeriaImagenes':           
            this.gf.enviarUrlImagenes(params[key])
            break;
        
          default:
            this.generalInformation[key] = params[key];
            break;
        }
      });
    }
  }
  programar() {
    this.rebaja = !this.rebaja    
  }

  onFileSelect(event) {
     this.generalInformation.documentosDigitales = this.fileUpload.files;
  }

  recibeFiles(event) {
    this.generalInformation.galeriaImagenes = event;
  }

  nextPage() {
      if (this.generalInformation.titulo && this.generalInformation.descripcion && 
          this.generalInformation.precio && this.generalInformation.stock &&
          this.generalInformation.galeriaImagenes) {
          this.tiendaServ.createProduct(this.generalInformation, 'general');
          this.gf.ClearProductFU();
          this.router.navigate(['plaza-online/creacion-productos-plaza/clasificacion']);
          return;
      } else {
        this.uimessage.getMiniInfortiveMsg('tst', 'warn', 'Atención', 'Debe completar los campos obligatorios');
      }
      this.submitted = true;
  }
}
