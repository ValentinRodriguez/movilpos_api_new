import { Component, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { EmpresaService } from 'src/app/services/mi-empresa/empresa.service';
import { UsuarioService } from 'src/app/services/panel-control/usuario.service';

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
   
  index: number = 0;
  
  listSubscribers: any = [];

  constructor(private usuariosServ: UsuarioService,
              private empresasServ: EmpresaService,
              public dialogService: DialogService) { 
                this.usuario = this.usuariosServ.getUserLogged();
              }

  ngOnDestroy(): void {
    this.listSubscribers.forEach(a => a.unsubscribe());
  }

  ngOnInit(): void {   
    this.todasLasEmpresas();
    this.listObserver();

    this.cols = [
      { field: 'id', header: 'Código' },
      { field: 'nombre', header: 'Descripción' },
      { field: 'acciones', header: 'Acciones' },
    ] 
  }

  listObserver = () => {
    const observer1$ = this.empresasServ.guardar.subscribe((resp: any) => {  
      this.index = resp;         
    })

    const observer2$ = this.empresasServ.empresaEscogida.subscribe(() => {  
      this.todasLasEmpresas();
    })

    const observer3$ = this.empresasServ.empresaBorrada.subscribe(()=>{  
      this.todasLasEmpresas();
    })

    const observer4$ = this.empresasServ.empresaAct.subscribe(()=>{  
      this.todasLasEmpresas();
    })

    this.listSubscribers = [observer1$,observer2$,observer3$,observer4$];
  }

  todasLasEmpresas() {   
      
    this.empresasServ.getDatos().then((resp: any) => {
      this.empresas = resp;
      console.log(resp);       
    })
  }

  actualizarEmpresa(data) {
    this.index = 1;   
    this.empresasServ.actualizando(data);
  }
}
