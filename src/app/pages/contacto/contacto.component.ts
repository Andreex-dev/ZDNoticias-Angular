
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

import { Header } from '../../shared/header/header.component';
import { Footer } from '../../shared/footer/footer.component';

@Component({
  selector: 'app-contacto',
  imports: [FormsModule, Header, Footer],
  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.css'
})
export class Contacto {

  formulario = {
    nombre: '',
    correo: '',
    asunto: '',
    mensaje: ''
  };

  formularioEnviado = false;

  enviar(formularioAngular: NgForm): void {
    if (formularioAngular.invalid) {
      formularioAngular.control.markAllAsTouched();
      this.formularioEnviado = false;
      return;
    }

    // El prototipo valida el formulario en el navegador.
    // Todavía no envía correos a un servidor.
    this.formularioEnviado = true;

    formularioAngular.resetForm({
      nombre: '',
      correo: '',
      asunto: '',
      mensaje: ''
    });

    this.formulario = {
      nombre: '',
      correo: '',
      asunto: '',
      mensaje: ''
    };
  }
}
