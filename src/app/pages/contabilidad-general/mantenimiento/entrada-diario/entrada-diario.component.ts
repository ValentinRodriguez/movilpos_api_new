import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
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
   
  index: number = 0;
    formSubmitted = false;
  listSubscribers: any = [];

  constructor(private fb: FormBuilder,
              private uiMessage: UiMessagesService,
              private usuariosServ: UsuarioService,
              private EntradaServ: EntradasDiarioService,
              private confirmationService: ConfirmationService,
              public dialogService: DialogService) { 
                this.usuario = this.usuariosServ.getUserLogged()
                this.crearFormulario();              
              }

  ngOnDestroy(): void {
    this.listSubscribers.forEach(a => a.unsubscribe());
  }
            
  ngOnInit(): void {
    this.todasLasEntradas();
    this.listObserver();

    this.cols = [
      { field: 'ref', header: 'No. Entrada' },
      { field: 'fecha', header: 'Fecha' },
      { field: 'detalle', header: 'Detalle' },
      { field: 'acciones', header: 'Acciones' },
    ]
  }

  listObserver = () => {
    const observer1$ = this.EntradaServ.guardar.subscribe((resp: any)=>{  
      this.index = resp;
    })

    const observer2$ = this.EntradaServ.entradaGuardada.subscribe(() =>{
      this.todasLasEntradas();
    })

    const observer3$ = this.EntradaServ.marcaBorrada.subscribe(()=>{      
      this.todasLasEntradas();   
    })

    const observer4$ = this.EntradaServ.entradaAct.subscribe(() =>{
      this.todasLasEntradas();
    })

    const observer5$ = this.EntradaServ.formSubmitted.subscribe((resp) => {
      this.formSubmitted = resp;
    })

    this.listSubscribers = [observer1$,observer5$,observer2$,observer3$,observer4$];
   };

  todasLasEntradas() {
     
    this.EntradaServ.getDatos().then((resp: any) =>{
       
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
          this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro eliminado de manera correcta');   
        })       
      }
    })
  }

}
