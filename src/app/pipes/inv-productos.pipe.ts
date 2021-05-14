import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';
const URL = environment.urlImagenes;

@Pipe({
  name: 'invProductos'
})
export class InvProductosPipe implements PipeTransform {

  transform(img: any): any {      
    if (img === null || img === '' || img == '[]') {
      return "../assets/images/empty-image.png";
    }else{         
      // let tmp = JSON.parse(img);
      let url = URL + '/storage/' + img;
      return url;
    }
  }

}
