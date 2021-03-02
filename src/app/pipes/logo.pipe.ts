import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

const URL = environment.urlImagenes;
@Pipe({
  name: 'logo'
})
export class LogoPipe implements PipeTransform {

  transform(img: string): any {
    if (img === null || img === '') {
      return 'http://movilsoluciones_pos.test:8090/storage/uploads/logo.png';
    }
    let url = URL + '/storage/' + img;
    return url;
  }

}
