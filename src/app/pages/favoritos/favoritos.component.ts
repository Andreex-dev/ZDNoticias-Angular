
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
  selector: 'app-favoritos',
  imports: [RouterLink, Header, Footer],
  templateUrl: './favoritos.component.html',
  styleUrl: './favoritos.component.css'
})
export class Favoritos implements OnInit {

  noticias: Noticia[] = [];
  favoritosIds: number[] = [];

  cargando = true;
  errorCarga = false;

  constructor(
    private noticiasService: NoticiasService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarFavoritos();
  }

  cargarFavoritos(): void {
    this.cargando = true;
    this.errorCarga = false;

    this.favoritosIds = this.leerFavoritos();

    this.noticiasService.obtenerNoticias().subscribe({
      next: (datos: Noticia[]) => {
        this.noticias = datos;
        this.favoritosIds = this.leerFavoritos();
        this.cargando = false;

        this.cdr.detectChanges();
      },

      error: (error: unknown) => {
        console.error('Error al cargar favoritos:', error);

        this.errorCarga = true;
        this.cargando = false;

        this.cdr.detectChanges();
      }
    });
  }

  get noticiasFavoritas(): Noticia[] {
    return this.noticias.filter(
      noticia => this.favoritosIds.includes(noticia.id)
    );
  }

  quitarFavorito(id: number): void {
    this.favoritosIds = this.favoritosIds.filter(
      favoritoId => favoritoId !== id
    );

    this.guardarFavoritos();

    this.cdr.detectChanges();
  }

  private leerFavoritos(): number[] {
    try {
      const datos = localStorage.getItem('zdnoticias_favoritos');
      const ids: unknown = datos ? JSON.parse(datos) : [];

      if (Array.isArray(ids)) {
        return ids.filter(
          (id): id is number =>
            typeof id === 'number' && Number.isInteger(id)
        );
      }

      return [];
    } catch {
      return [];
    }
  }

  private guardarFavoritos(): void {
    localStorage.setItem(
      'zdnoticias_favoritos',
      JSON.stringify(this.favoritosIds)
    );
  }

  reintentar(): void {
    this.cargarFavoritos();
  }
}
