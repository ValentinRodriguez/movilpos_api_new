import { Directive, ElementRef, HostListener, OnInit } from '@angular/core';

@Directive({
  selector: '[appImagen]'
})
export class ImagenRotaDirective{

  constructor(private elementRef: ElementRef) { }

  @HostListener('error')
  cargarImagenPorDefecto() {
    const element = this.elementRef.nativeElement
    element.src = './assets/images/user.png'
  }
}
