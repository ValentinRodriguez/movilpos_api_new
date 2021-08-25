import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FileUpload } from 'primeng/fileupload';
import { DatosEstaticosService } from 'src/app/services/globales/datos-estaticos.service';
import { InventarioService } from 'src/app/services/inventario/inventario.service';
import { environment } from 'src/environments/environment';

const URLs = environment.urlImagenes;
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
    private invProductoSrv: InventarioService) { }

  ngOnInit(): void {
    this.invProductoSrv.enviarImagen.subscribe(resp => {
      console.log( `${URLs}/storage/${resp}`);
      this.test(`${URLs}/storage/${resp}`);
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
    this.propagar.emit(this.fileUpload.files);
  }
}
