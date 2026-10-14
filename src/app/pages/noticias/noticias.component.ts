
import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Header } from '../../shared/header/header.component';
import { Footer } from '../../shared/footer/footer.component';
import { Noticia } from '../../models/noticia';
import { NoticiasService } from '../../services/noticias.service';

@Component({
  selector: 'app-noticias',
  imports: [FormsModule, RouterLink, Header, Footer],
  templateUrl: './noticias.component.html',
  styleUrl: './noticias.component.css'
})
export class Noticias implements OnInit {

  noticias: Noticia[] = [];
  busqueda = '';
  categoriaSeleccionada = 'Todas';
  paginaActual = 1;
  readonly noticiasPorPagina = 6;

  cargando = true;
  errorCarga = false;
  favoritosIds: number[] = [];

  constructor(
    private noticiasService: NoticiasService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.favoritosIds = this.leerFavoritos();
    this.cargarNoticias();
  }

  cargarNoticias(): void {
    this.cargando = true;
    this.errorCarga = false;

    this.noticiasService.obtenerNoticias().subscribe({
      next: (datos: Noticia[]) => {
        this.noticias = datos;
        this.cargando = false;

        // Actualiza la vista después de recibir los datos.
        this.cdr.detectChanges();
      },

      error: (error: unknown) => {
        console.error('Error al cargar noticias:', error);

        this.errorCarga = true;
        this.cargando = false;

        this.cdr.detectChanges();
      }
    });
  }

  reintentar(): void {
    this.cargarNoticias();
  }

  get categorias(): string[] {
    return [
      'Todas',
      ...new Set(
        this.noticias.map(noticia => noticia.categoria)
      )
    ];
  }

  get noticiasFiltradas(): Noticia[] {
    const texto = this.normalizar(this.busqueda);

    return this.noticias.filter(noticia => {
      const coincideCategoria =
        this.categoriaSeleccionada === 'Todas' ||
        this.normalizar(noticia.categoria) ===
          this.normalizar(this.categoriaSeleccionada);

      const contenido = this.normalizar([
        noticia.titulo,
        noticia.descripcion,
        noticia.categoria
      ].join(' '));

      const coincideBusqueda =
        texto === '' || contenido.includes(texto);

      return coincideCategoria && coincideBusqueda;
    });
  }

  get totalPaginas(): number {
    return Math.max(
      1,
      Math.ceil(
        this.noticiasFiltradas.length / this.noticiasPorPagina
      )
    );
  }

  get paginas(): number[] {
    return Array.from(
      { length: this.totalPaginas },
      (_, indice) => indice + 1
    );
  }

  get noticiasPaginadas(): Noticia[] {
    const inicio =
      (this.paginaActual - 1) * this.noticiasPorPagina;

    return this.noticiasFiltradas.slice(
      inicio,
      inicio + this.noticiasPorPagina
    );
  }

  seleccionarCategoria(categoria: string): void {
    this.categoriaSeleccionada = categoria;
    this.paginaActual = 1;
  }

  reiniciarPagina(): void {
    this.paginaActual = 1;
  }

  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
    }
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

  private normalizar(texto: string): string {
    return texto
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toLocaleLowerCase();
  }
}
