import { Component, OnInit } from '@angular/core';
import { ClientesService } from 'src/app/services/clientes.service';
import { DatosEstaticosService } from 'src/app/services/datos-estaticos.service';

@Component({
  selector: 'app-acto-descargo',
  templateUrl: './acto-descargo.component.html',
  styleUrls: ['./acto-descargo.component.scss']
})
export class ActoDescargoComponent implements OnInit {

  fechafabricacion: any[] = [];
  clientes: any[] = [];
  clientesFiltrados: any[] = [];

  form = {
    cedula: '',
    direccion: '',
    password: null
  };

  constructor(private DatosEstaticos: DatosEstaticosService,
              private clientesServ: ClientesService) { }

  ngOnInit(): void {
    this.fechaFabricacion();
    this.todosLosClientes();
  }

  todosLosClientes() {
    this.clientesServ.getDatos().then((resp: any) => {
      this.clientes = resp;
      console.log(resp);      
    })
  }

  print(): void {
    let printContents, popupWin;
    printContents = document.getElementById('print-section').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Print tab</title>
          <style>
          //........Customized style.......
          </style>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    // popupWin.document.close();
  }

  fechaFabricacion() {
    let rango = this.DatosEstaticos.getYear() - 1950 + 1;
    let temp = [];
    for (let index = 0; index < rango; index++) {
       temp.push({value: 1950 + (index)})
    }  
    this.fechafabricacion = temp.reverse();      
  }

  datosClientes(data) {
    console.log(data);  
    this.form.cedula = data.documento;  
    this.form.direccion = data.pais +','+ data.provincia +','+ data.municipio +','+ data.urbanizacion +','+ data.ciudad +','+ data.sector +','+ data.direccion
  }

  filtrarProveedor(event) {
    const filtered: any[] = [];
    const query = event.query;
    
    for (let i = 0; i < this.clientes.length; i++) {
      const size = this.clientes[i];
      
      if (size.nombre.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(size);
      }
    }
    this.clientesFiltrados = filtered;
  }

}
