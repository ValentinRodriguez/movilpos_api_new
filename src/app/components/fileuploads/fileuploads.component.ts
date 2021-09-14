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
    this.invProductoSrv.clearProductfu.subscribe(() => {
      this.uploadedFiles = [];
      this.fileUpload.clear()
    });

    this.gf.enviarImagen.subscribe(resp => {
      this.fileUpload.clear();
      
      resp.forEach(element => {        
        if (typeof (element) === 'object') {          
          this.fileUpload.files.push(element)          
        } else {          
          setTimeout(() => {
            this.test(`${URLs}/storage/${element}`);               
          }, 500);
        }          
      });
    })   
  }

  test(imgURL: string) {
    const toDataURL = url => fetch(url)
          .then(response => response.blob())
          .then(blob => new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result)
          reader.onerror = reject
          reader.readAsDataURL(blob)
          
          let objectURL = URL.createObjectURL(blob);       
          this.image = this.sanitizer.bypassSecurityTrustUrl(objectURL);               
    }))
    
    toDataURL(imgURL).then(dataUrl => {      
      var fileData = this.dataURLtoFile(dataUrl, this.DatosEstaticos.getMilliseconds());
      fileData['objectURL'] = this.image
      this.fileArr.push(fileData)
      this.fileUpload.files.push(fileData)
      this.fileUpload.cd.detectChanges()
    })
  }
  
  dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','),
        mime = 'image/*',
        bstr = atob(arr[1]), n = bstr.length,
        u8arr = new Uint8Array(n);
    while(n--){
      u8arr[n] = bstr.charCodeAt(n);
    }    
    return new File([u8arr], filename,{type:mime});
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
    this.propagar.emit(this.fileUpload.files)
  }
}
