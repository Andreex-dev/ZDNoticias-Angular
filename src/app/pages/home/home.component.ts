
import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { RouterLink } from '@angular/router';
import { Header } from '../../shared/header/header.component';
import { Footer } from '../../shared/footer/footer.component';
import { Noticia } from '../../models/noticia';
import { NoticiasService } from '../../services/noticias.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink, Header, Footer],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class Home implements OnInit {

  noticias: Noticia[] = [];
  cargando = true;
  errorCarga = false;

  constructor(
    private noticiasService: NoticiasService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarNoticias();
  }

  cargarNoticias(): void {
    this.cargando = true;
    this.errorCarga = false;

    this.noticiasService.obtenerNoticias().subscribe({
      next: (datos: Noticia[]) => {
        this.noticias = datos;
        this.cargando = false;

        // Actualiza la vista al recibir las noticias.
        this.cdr.detectChanges();
      },

      error: (error: unknown) => {
        console.error('Error al cargar las noticias:', error);

        this.errorCarga = true;
        this.cargando = false;

        // Actualiza la vista si ocurre un error.
        this.cdr.detectChanges();
      }
    });
  }

  reintentar(): void {
    this.cargarNoticias();
  }

  get noticiasDestacadas(): Noticia[] {
    return this.noticias
      .filter(noticia => noticia.destacada)
      .slice(0, 3);
  }
}
