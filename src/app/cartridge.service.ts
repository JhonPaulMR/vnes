import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Cartridge } from './cartridge.model';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartridgeService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getCartridges(): Observable<Cartridge[]> {
    if (environment.production) {
      // Em PRODUÇÃO: busca do arquivo estático e extrai a chave "cartridges"
      return this.http.get<{ cartridges: Cartridge[] }>(this.apiUrl).pipe(
        map(response => response.cartridges || [])
      );
    } else {
      // Em DESENVOLVIMENTO: continua usando a API do json-server
      return this.http.get<Cartridge[]>(`${this.apiUrl}/cartridges`);
    }
  }

  getCartridgeById(id: number): Observable<Cartridge> {
    if (environment.production) {
      // Em PRODUÇÃO: busca todos os dados e filtra pelo ID no lado do cliente
      return this.http.get<{ cartridges: Cartridge[] }>(this.apiUrl).pipe(
        map(response => {
          const cartridge = response.cartridges.find(c => c.id === id);
          if (!cartridge) {
            throw new Error(`Cartucho com id ${id} não encontrado`);
          }
          return cartridge;
        })
      );
    } else {
      // Em DESENVOLVIMENTO: busca o ID diretamente do json-server
      return this.http.get<Cartridge>(`${this.apiUrl}/cartridges/${id}`);
    }
  }
}