import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { BrandsService } from 'src/app/services/brands.service';
import { UiMessagesService } from 'src/app/services/ui-messages.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-marcas',
  templateUrl: './marcas.component.html',
  styleUrls: ['./marcas.component.scss']
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
  loading: boolean;
  index: number = 0;

  constructor(private fb: FormBuilder,
              private uiMessage: UiMessagesService,
              private usuariosServ: UsuarioService,
              private marcasServ: BrandsService,
              private confirmationService: ConfirmationService,
              public dialogService: DialogService) { 
                this.usuario = this.usuariosServ.getUserLogged()
                this.crearFormulario();
                this.todasLasMarcas();
              }

  ngOnInit(): void {
    this.marcasServ.guardar.subscribe((resp: any)=>{  
      this.index = resp;
    })

    this.marcasServ.marcaGuardada.subscribe(resp =>{
      this.todasLasMarcas();
    })

    this.marcasServ.marcaBorrada.subscribe((resp: any)=>{      
      this.todasLasMarcas();   
    })

    this.marcasServ.marcaAct.subscribe(resp =>{
      this.todasLasMarcas();
    })

    this.cols = [
      { field: 'id_brand', header: 'Código' },
      { field: 'descripcion', header: 'Descripción' },
      { field: 'acciones', header: 'Acciones' },
    ]
  }

  todasLasMarcas() {
    this.loading = true;
    this.marcasServ.getDatos().then((resp: any) =>{
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

  actualizarMarca(data){
    this.index = 1;   
    this.marcasServ.actualizando(data);
  }

  borrarMarca(marca) { 
    this.confirmationService.confirm({
      message:"Esta seguro de borrar este registro?",
      accept:() =>{ 
        this.marcasServ.borrarMarca(marca).then((resp: any)=>{
          this.uiMessage.getMiniInfortiveMsg('tst','success','Excelente',resp.msj);   
        })       
      }
    })
  }
}
   