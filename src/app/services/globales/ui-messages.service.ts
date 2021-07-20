import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class UiMessagesService {

  constructor(private service: MessageService) { }

  getMiniInfortiveMsg(key, severity: string, summary: string,detail: string) {
    this.service.add({ key, severity, summary, detail });
  }

  getSweetMessageOk(title: string, text: string) {
   return Swal.fire({
      title: title,
      text: text,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
     cancelButtonColor: '#d33',
     cancelButtonText: 'No',
      confirmButtonText: 'Si'
    })
  }
}
