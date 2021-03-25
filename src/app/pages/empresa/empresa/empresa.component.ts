import { Component, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { EmpresaService } from 'src/app/services/empresa.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.component.html',
  styleUrls: ['./empresa.component.scss']
})
export class EmpresaComponent implements OnInit {

  usuario: any;
  categorias: any[] = [];
  empresas: any[] = [];
  actualizar = false;
  id_categoria: any;
  cols: any[];
  loading: boolean;
  index: number = 0;

  constructor(private usuariosServ: UsuarioService,
              private empresasServ: EmpresaService,
              public dialogService: DialogService) { 
                this.usuario = this.usuariosServ.getUserLogged();
              }

  ngOnInit(): void {   
    this.todasLasEmpresas();
    this.cols = [
      { field: 'id', header: 'Código' },
      { field: 'nombre', header: 'Descripción' },
      { field: 'acciones', header: 'Acciones' },
    ] 

    this.empresasServ.guardar.subscribe((resp: any)=>{  
      this.index = resp;
    })

    this.empresasServ.empresaEscogida.subscribe((resp: any)=>{  
      this.todasLasEmpresas();
    })

    this.empresasServ.empresaBorrada.subscribe((resp: any)=>{  
      this.todasLasEmpresas();
    })

    this.empresasServ.empresaAct.subscribe((resp: any)=>{  
      this.todasLasEmpresas();
    })
  }

  todasLasEmpresas() {
    this.loading = true;
    this.empresasServ.getDatos().then((resp: any) => {
      this.empresas = resp;
      this.loading = false;
    })
  }

  actualizarEmpresa(data) {
    this.index = 1;   
    this.empresasServ.actualizando(data);
  }
}
