import { Routes } from '@angular/router';

import { Home } from './pages/home/home.component';
import { Noticias } from './pages/noticias/noticias.component';
import { Detalle } from './pages/detalle/detalle.component';
import { Favoritos } from './pages/favoritos/favoritos.component';
import { Categorias } from './pages/categorias/categorias.component';
import { Contacto } from './pages/contacto/contacto.component';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'noticias', component: Noticias },
  { path: 'detalle/:id', component: Detalle },
  { path: 'favoritos', component: Favoritos },
  { path: 'categorias', component: Categorias },
  { path: 'contacto', component: Contacto },
  { path: '**', redirectTo: '' }
];