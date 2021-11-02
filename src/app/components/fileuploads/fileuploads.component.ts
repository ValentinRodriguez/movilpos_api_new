import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FileUpload } from 'primeng/fileupload';
import { DatosEstaticosService } from 'src/app/services/globales/datos-estaticos.service';
import { GlobalFunctionsService } from 'src/app/services/globales/global-functions.service';
import { InventarioService } from 'src/app/services/inventario/inventario.service';
import { environment } from 'src/environments/environment';

const URLs = environment.urlClean;

@Component({
  selector: 'app-fileuploads',
  templateUrl: './fileuploads.component.html',
  styleUrls: ['./fileuploads.component.scss']
})
export class FileuploadsComponent implements OnInit {
  
  uploadedFiles: any[] = [];
  fileArr: any[] = [];
  @ViewChild(FileUpload)
  fileUpload: FileUpload
  image: any;
  imgURL: any;

  @Output() propagar = new EventEmitter<any>();

  constructor(private sanitizer: DomSanitizer,
              private DatosEstaticos: DatosEstaticosService,
              private gf: GlobalFunctionsService,
              private invProductoSrv: InventarioService) { }

  ngOnInit(): void {
      
  }


  onFileSelect() {
    this.enviarImagenes()
  }

  onClear(data) {
    this.enviarImagenes() 
  }

  onRemove(data) {
    this.enviarImagenes()
  }

  enviarImagenes() {
    console.log(this.fileUpload.files);
    
    // this.propagar.emit(this.fileUpload.files)
  }
}
