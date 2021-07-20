import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidadoresService {

  constructor() { }

  esServicio(control: FormControl):{[s:string]: boolean} {
    if (control) {
      
    }
    return {
      esServicio: true
    }
  }
}
