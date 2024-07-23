import { Component, OnInit } from '@angular/core';
import Carros from 'src/app/model/entities/Carros';
import { AlertController } from '@ionic/angular';
import { FirebaseService } from 'src/app/model/services/firebase.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/model/services/auth.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/common/alert.service';
import { BrMaskModel } from 'br-mask';
 
@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
})

export class CadastroPage implements OnInit {
  carros!: Carros;
  public user : any;
  public imagem: any;
  formCadastrar : FormGroup;
  currentYear = new Date().getFullYear();
  constructor(private formBuilder:FormBuilder, private alert: AlertService, private router: Router, private firebase: FirebaseService,private auth: AuthService){
    this.user = this.auth.getUserLogged();
    this.formCadastrar = new FormGroup({
      modelo: new FormControl(''),
      marca: new FormControl(''),
      ano: new FormControl(''),
      potencia: new FormControl(''),
      carroceria: new FormControl('')
    });
   }

  ngOnInit() {}

  
cadastrar(formCadastra: FormGroup){
    this.alert.simpleLoader();
    setTimeout(() => {
      this.alert.dismissLoader();
    if(formCadastra.valid){
      let novo: Carros = new Carros(formCadastra.value.modelo,formCadastra.value['marca'], formCadastra.value['ano'], formCadastra.value['potencia'], formCadastra.value['carroceria']);
      novo.uid = this.user.uid;
      if(this.imagem){
        this.firebase.uploadImage(this.imagem, novo);
      }
      else{
        this.firebase.create(novo);  
      }
      this.alert.presentAlert("Salvo", "Carro Salvo!");
      this.router.navigate(['/home']);
    }
    else{
      this.alert.presentAlert("Erro", "Campos Obrigatórios");
    }
  }, 1000);
}


  uploadFile(imagem: any){
    this.imagem = imagem.files;
  }
}
