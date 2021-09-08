import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FileUpload } from 'primeng/fileupload';
import { DatosEstaticosService } from 'src/app/services/globales/datos-estaticos.service';
import { GlobalFunctionsService } from 'src/app/services/globales/global-functions.service';
import { UiMessagesService } from 'src/app/services/globales/ui-messages.service';
import { CategoriasStoreService } from 'src/app/services/tienda/categorias-store.service';
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
  listSubscribers: any = [];
  groupedCities: any = [];
  selectedCity3: string;

  constructor(private router: Router,
              private categoriasStoreSrv: CategoriasStoreService,
              private de: DatosEstaticosService,
              private uimessage: UiMessagesService,
              private gf: GlobalFunctionsService,
              private tiendaServ: TiendaService) { }
    
    ngOnInit() { 
      this.listObserver();
      
      this.setValues()
      this.getCategorias();

      this.generalInformation = {
        titulo: 'testse',
        descripcion: 'testse',
        categoria: null,
        tipo: 'basico',
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
  }
  
  ngOnDestroy(): void {
    this.listSubscribers.forEach(a => a.unsubscribe());   
  }

  listObserver = () => {
    const observer1$ = this.tiendaServ.tipoProducto.subscribe((resp: any) =>{
      this.generalInformation.tipo = resp.value;         
    });
    
    this.listSubscribers = [observer1$];
  };

  getCategorias() {
    this.categoriasStoreSrv.getDatos().then((resp: any) =>{    
      let temp2: any[] = [];
      
      resp.forEach((element: any) => {                        
         let dato = {
              label: element.descripcion.toUpperCase(), 
              value: 'de',
              items: this.crearhijos(element.items)
          }                
          temp2.push(dato)
      });

      this.groupedCities = temp2;
    }) 
  }

  crearhijos(element: any) {
    const temp: any = [];        
    element.forEach((subelement: any) => {                        
        let obj = {
          label: subelement.descripcion, 
          value: subelement.id,
        }
        temp.push(obj)
    });        
    return temp
  } 

  setValues() {  
    const params = this.tiendaServ.getProduct('general');  
    if (params !== null) {
      Object.keys(this.generalInformation).forEach((key) => {
        switch (key) {
          // case 'documentosDigitales':
          case 'galeriaImagenes':           
            this.gf.enviarurlClean(params[key])
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
        this.generalInformation.galeriaImagenes && this.generalInformation.categoria) {
        this.tiendaServ.createProduct(this.generalInformation, 'general');
        this.gf.ClearProductFU();
        this.router.navigate(['plaza-online/creacion-productos-plaza/atributos']);
        return;
    } else {
      this.uimessage.getMiniInfortiveMsg('tst', 'warn', 'Atención', 'Debe completar los campos obligatorios');
    }
    this.submitted = true;
  }
}
