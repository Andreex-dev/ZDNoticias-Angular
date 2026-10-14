import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Noticia } from '../models/noticia';

@Injectable({
  providedIn: 'root'
})
export class NoticiasService {

  private readonly url = '/data/noticias.json';

  constructor(private http: HttpClient) {}

  obtenerNoticias(): Observable<Noticia[]> {
    return this.http.get<Noticia[]>(this.url);
  }
}