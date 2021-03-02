import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class UiMessagesService {

  constructor(private service: MessageService) { }

  getMiniInfortiveMsg(key, severity: string, summary: string,detail: string) {
    this.service.add({ key, severity, summary, detail });
  }
}
