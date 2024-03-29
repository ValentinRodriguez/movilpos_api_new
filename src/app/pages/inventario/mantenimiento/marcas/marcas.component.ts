import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { BrandsService } from 'src/app/services/inventario/brands.service';
import { UiMessagesService } from 'src/app/services/globales/ui-messages.service';


@Component({
  selector: 'app-marcas',
  templateUrl: './marcas.component.html',
  styleUrls: ['./marcas.component.scss'],
  providers:[BrandsService]
})
export class MarcasComponent implements OnInit {

  formaAct: FormGroup;
  marcas: any[] = [];
  usuario: any;
  actualizando = false;
  marcaExiste = 3;
  actualizar = false;
  id_marca: any;
  cols: any[];   
  index: number = 0;    
  listSubscribers: any = [];

  constructor(private fb: FormBuilder,
              private uiMessage: UiMessagesService,              
              private marcasServ: BrandsService,
              private confirmationService: ConfirmationService,
              public dialogService: DialogService) {                 
                this.crearFormulario();
                this.todasLasMarcas();
              }

  ngOnDestroy(): void {
    this.listSubscribers.forEach(a => a.unsubscribe());
  }

  ngOnInit(): void {
    this.listObserver();

    this.cols = [
      { field: 'id_brand', header: 'Código' },
      { field: 'descripcion', header: 'Descripción' },
      { field: 'acciones', header: 'Acciones' },
    ]
  }
  listObserver = () => {
    const observer1$ = this.marcasServ.guardar.subscribe((resp: any)=>{  
      this.index = resp;
    })
    const observer2$ = this.marcasServ.marcaGuardada.subscribe(() =>{
      this.todasLasMarcas();
    })

    const observer3$ = this.marcasServ.marcaBorrada.subscribe(()=>{      
      this.todasLasMarcas();   
    })
    const observer4$ = this.marcasServ.marcaAct.subscribe(() =>{
      this.todasLasMarcas();
    })

    this.listSubscribers = [observer1$,observer2$,observer3$,observer4$];
   };
 
  todasLasMarcas() {     
    this.marcasServ.getDatos().then((resp: any) =>{       
      this.marcas = resp;      
    })
  }

  crearFormulario() {
    this.formaAct = this.fb.group({
      descripcion:         ['', Validators.required],
      estado:              ['activo', Validators.required],
      usuario_modificador: ['', Validators.required]
    })
  }

  actualizarMarca(data){
    this.index = 1;   
    this.marcasServ.actualizando(data);
  }

  borrarMarca(marca) { 
    this.confirmationService.confirm({
      message:"Esta seguro de borrar este registro?",
      accept:() =>{ 
        this.marcasServ.borrarMarca(marca).then((resp: any)=>{
          this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente','Registro eliminado de manera correcta');   
        })       
      }
    })
  }
}
   