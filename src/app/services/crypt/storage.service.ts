import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';

const SecureStorage = require('secure-web-storage');
const URL = environment.url;

let SECRET_KEY = 'e161d29e7b89977b32bf2d3f15a7200d'

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  listSubscribers: any = [];  
  constructor(private http: HttpClient) { }

  public secureStorage = new SecureStorage(localStorage, {
    hash: function hash(key) {
      key = CryptoJS.SHA256(SECRET_KEY); 
      return key.toString();
    },
    encrypt: function encrypt(data) {
      data = CryptoJS.AES.encrypt(data, SECRET_KEY); 
      data = data.toString(); 
      return data;
    },
    decrypt: function decrypt(data) {
      data = CryptoJS.AES.decrypt(data, SECRET_KEY); 
      data = data.toString(CryptoJS.enc.Utf8); 
      return data;
    }
  });

}
