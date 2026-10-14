
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
  selector: 'app-categorias',
  imports: [RouterLink, Header, Footer],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.css'
})
export class Categorias implements OnInit {

  noticias: Noticia[] = [];
  categoriaSeleccionada = 'Todas';
  categoriaSolicitada: string | null = null;

  cargando = true;
  errorCarga = false;

  constructor(
    private noticiasService: NoticiasService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.categoriaSolicitada = params.get('categoria');
      this.aplicarCategoriaSolicitada();
      this.cdr.detectChanges();
    });

    this.cargarNoticias();
  }

  cargarNoticias(): void {
    this.cargando = true;
    this.errorCarga = false;

    this.noticiasService.obtenerNoticias().subscribe({
      next: (datos: Noticia[]) => {
        this.noticias = datos;
        this.aplicarCategoriaSolicitada();
        this.cargando = false;
        this.cdr.detectChanges();
      },

      error: (error: unknown) => {
        console.error('Error al cargar las categorías:', error);
        this.errorCarga = true;
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
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
    if (this.categoriaSeleccionada === 'Todas') {
      return this.noticias;
    }

    return this.noticias.filter(
      noticia =>
        this.normalizar(noticia.categoria) ===
        this.normalizar(this.categoriaSeleccionada)
    );
  }

  seleccionarCategoria(categoria: string): void {
    this.categoriaSeleccionada = categoria;
  }

  reintentar(): void {
    this.cargarNoticias();
  }

  private aplicarCategoriaSolicitada(): void {
    if (!this.categoriaSolicitada) {
      this.categoriaSeleccionada = 'Todas';
      return;
    }

    const encontrada = this.noticias
      .map(noticia => noticia.categoria)
      .find(
        categoria =>
          this.normalizar(categoria) ===
          this.normalizar(this.categoriaSolicitada!)
      );

    this.categoriaSeleccionada = encontrada ?? 'Todas';
  }

  private normalizar(texto: string): string {
    return texto
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toLocaleLowerCase();
  }
}
