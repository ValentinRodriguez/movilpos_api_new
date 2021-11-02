import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';
const URL = environment.urlClean;

@Pipe({
  name: 'invProductos'
})
export class InvProductosPipe implements PipeTransform {
  transform(img: any): any {       
    if (img === null || img === '' || img == '[]') {
      return "../assets/images/empty-image.png";
    }else{         
      let url = `${URL}/${img[0]}`;
      return url;
    }
  }
}
