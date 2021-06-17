import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtro'
})
export class FiltroPipe implements PipeTransform {

  transform( arreglo: any[], texto: string, columna: string ): any[] {

    if ( texto === '' || texto === undefined) {
      return arreglo;
    }    
    return arreglo.filter(item => {
      console.log(item[columna]);
      
      return item[columna].toLowerCase().includes( texto );
    });
  }

}
