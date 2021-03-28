import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { BrandsService } from 'src/app/services/brands.service';
import { EntradasDiarioService } from 'src/app/services/entradas-diario.service';
import { UiMessagesService } from 'src/app/services/ui-messages.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-entrada-diario',
  templateUrl: './entrada-diario.component.html',
  styleUrls: ['./entrada-diario.component.scss']
})
export class EntradaDiarioComponent implements OnInit {

  formaAct: FormGroup;
  marcas: any[] = [];
  usuario: any;
  actualizando = false;
  marcaExiste = 3;
  actualizar = false;
  id_marca: any;
  cols: any[];
  loading: boolean;
  index: number = 0;

  constructor(private fb: FormBuilder,
              private uiMessage: UiMessagesService,
              private usuariosServ: UsuarioService,
              private EntradaServ: EntradasDiarioService,
              private confirmationService: ConfirmationService,
              public dialogService: DialogService) { 
                this.usuario = this.usuariosServ.getUserLogged()
                this.crearFormulario();
              
              }

  ngOnInit(): void {
    this.todasLasEntradas();
    this.EntradaServ.guardar.subscribe((resp: any)=>{  
      this.index = resp;
    })

    this.EntradaServ.entradaGuardada.subscribe(resp =>{
      this.todasLasEntradas();
    })

    this.EntradaServ.marcaBorrada.subscribe((resp: any)=>{      
      this.todasLasEntradas();   
    })

    this.EntradaServ.entradaAct.subscribe(resp =>{
      this.todasLasEntradas();
    })

    this.cols = [
      { field: 'ref', header: 'No. Entrada' },
      { field: 'fecha', header: 'Fecha' },
      { field: 'detalle', header: 'Detalle' },
      { field: 'acciones', header: 'Acciones' },
    ]
  }

  todasLasEntradas() {
    this.loading = true;
    this.EntradaServ.getDatos().then((resp: any) =>{
     //  
      this.loading = false;
      this.marcas = resp;      
    })
  }

  crearFormulario() {
    this.formaAct = this.fb.group({
      descripcion:         ['', Validators.required],
      estado:              ['activo', Validators.required],
      usuario_creador:     ['', Validators.required],
      usuario_modificador: ['', Validators.required]
    })
  }

  actualizarEntrada(data){
    this.index = 1;   
    
    this.EntradaServ.actualizando(data);
  }

  borrarMarca(marca) { 
    this.confirmationService.confirm({
      message:"Esta seguro de borrar este registro?",
      accept:() =>{ 
        this.EntradaServ.borrarMarca(marca).then((resp: any)=>{
          this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente',resp.msj);   
        })       
      }
    })
  }

}
