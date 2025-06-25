import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Cartridge } from './cartridge.model';

@Injectable({
  providedIn: 'root'
})
export class CartridgeService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/cartridges';

  /**
   * Busca todos os cartuchos da API.
   * Retorna um Observable com um array de Cartridge.
   */
  getCartridges(): Observable<Cartridge[]> {
    return this.http.get<Cartridge[]>(this.apiUrl).pipe(
      tap(data => console.log('Cartuchos recebidos:', data)),
      catchError(this.handleError)
    );
  }

  /**
   * Busca um cartucho específico pelo seu ID.
   * Retorna um Observable com o Cartridge encontrado.
   */
  getCartridge(id: number): Observable<Cartridge> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Cartridge>(url).pipe(
      tap(data => console.log('Cartucho recebido:', data)),
      catchError(this.handleError)
    );
  }

  /**
   * Adiciona um novo cartucho. (Exemplo de operação POST)
   */
  addCartridge(cartridge: Omit<Cartridge, 'id'>): Observable<Cartridge> {
    return this.http.post<Cartridge>(this.apiUrl, cartridge).pipe(
      tap(data => console.log('Cartucho adicionado:', data)),
      catchError(this.handleError)
    );
  }

  /**
   * Atualiza um cartucho existente. (Exemplo de operação PUT)
   */
  updateCartridge(cartridge: Cartridge): Observable<void> {
    const url = `${this.apiUrl}/${cartridge.id}`;
    return this.http.put<void>(url, cartridge).pipe(
      tap(() => console.log(`Cartucho ${cartridge.id} atualizado`)),
      catchError(this.handleError)
    );
  }

  /**
   * Remove um cartucho. (Exemplo de operação DELETE)
   */
  deleteCartridge(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url).pipe(
      tap(() => console.log(`Cartucho ${id} removido`)),
      catchError(this.handleError)
    );
  }

  /**
   * Trata erros de requisições HTTP.
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocorreu um erro desconhecido!';
    if (error.error instanceof ErrorEvent) {
      // Erro do lado do cliente
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      // Erro do lado do servidor
      errorMessage = `Código do erro: ${error.status}\nMensagem: ${error.message}`;
    }
    console.error(errorMessage);
    // Retorna um observable com uma mensagem de erro amigável para o usuário
    return throwError(() => new Error('Algo deu errado; por favor, tente novamente mais tarde.'));
  }
}