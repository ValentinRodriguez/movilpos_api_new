import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';
const URL = environment.urlImagenes;

@Pipe({
  name: 'usuario'
})
export class UsuarioPipe implements PipeTransform {

  transform(img: string): any {
    if (img === null || img === '') {
      return "../assets/images/user.png";
    }
    let url = URL + '/storage/' + img;
    return url;
  }
}
