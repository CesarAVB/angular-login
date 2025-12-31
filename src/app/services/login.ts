import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';                // Importa o HttpClient para fazer requisições HTTP
import { environment } from './../../environments/environment';   // Importa o ambiente para obter a URL da API

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }   // Injeta o HttpClient no serviço

  realizarLogin(email: string, password: string) {
    const url = environment.apiUrl;         // Usa a URL da API definida no ambiente
    const body = { email, password };            // Corpo da requisição com email e senha
    return this.http.post(url, body);         // Retorna o Observable da requisição POST
  }

}
