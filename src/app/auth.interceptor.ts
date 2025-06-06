import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Clona a requisição para adicionar os novos cabeçalhos
  const authReq = req.clone({
    setHeaders: {
      'X-RapidAPI-Key': environment.RAWG_API_KEY,
      'X-RapidAPI-Host': 'rawg-video-games-database.p.rapidapi.com'
    }
  });

  // Passa a requisição clonada com os cabeçalhos para o próximo handler
  return next(authReq);
};