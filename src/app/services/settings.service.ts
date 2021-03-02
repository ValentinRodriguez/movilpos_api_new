import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  ajustes: Ajustes = {
    tema: 'theme-green',
    font: 'font-montserrat',
    lv: 'nada_light_version',
    rtl: 'nada_rtl',
    hmenu: 'nada_h-menu',
    minis: 'nada_mini-sidebar'
  };

  constructor(@Inject(DOCUMENT) private document) {
 
  }

  guardarAjustes() {
    localStorage.setItem('ajustes', JSON.stringify(this.ajustes));
  }
  
  ajustesColor(scheme) {
    localStorage.setItem('scheme',scheme);
  }

}

interface Ajustes {
  tema: string;
  font: string;
  lv: string;
  rtl: string;
  hmenu: string;
  minis: string;
}
