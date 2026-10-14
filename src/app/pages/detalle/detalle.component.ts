
import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { ActivatedRoute, RouterLink } from '@angular/router';
import { Header } from '../../shared/header/header.component';
import { Footer } from '../../shared/footer/footer.component';
import { Noticia } from '../../models/noticia';
import { NoticiasService } from '../../services/noticias.service';

@Component({
  selector: 'app-detalle',
  imports: [RouterLink, Header, Footer],
  templateUrl: './detalle.component.html',
  styleUrl: './detalle.component.css'
})
export class Detalle implements OnInit {

  noticia: Noticia | null = null;
  cargando = true;
  errorCarga = false;
  noEncontrada = false;
  favoritosIds: number[] = [];

  constructor(
    private route: ActivatedRoute,
    private noticiasService: NoticiasService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.favoritosIds = this.leerFavoritos();

    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));

      if (!Number.isInteger(id) || id <= 0) {
        this.cargando = false;
        this.noEncontrada = true;
        this.cdr.detectChanges();
        return;
      }

      this.cargarNoticia(id);
    });
  }

  cargarNoticia(id: number): void {
    this.cargando = true;
    this.errorCarga = false;
    this.noEncontrada = false;
    this.noticia = null;

    this.noticiasService.obtenerNoticias().subscribe({
      next: (noticias: Noticia[]) => {
        this.noticia =
          noticias.find(noticia => noticia.id === id) ?? null;

        this.noEncontrada = this.noticia === null;
        this.cargando = false;

        this.cdr.detectChanges();
      },

      error: (error: unknown) => {
        console.error('Error al cargar el detalle:', error);

        this.errorCarga = true;
        this.cargando = false;

        this.cdr.detectChanges();
      }
    });
  }

  esFavorita(id: number): boolean {
    return this.favoritosIds.includes(id);
  }

  toggleFavorito(id: number): void {
    if (this.esFavorita(id)) {
      this.favoritosIds = this.favoritosIds.filter(
        favoritoId => favoritoId !== id
      );
    } else {
      this.favoritosIds = [...this.favoritosIds, id];
    }

    localStorage.setItem(
      'zdnoticias_favoritos',
      JSON.stringify(this.favoritosIds)
    );
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
}
