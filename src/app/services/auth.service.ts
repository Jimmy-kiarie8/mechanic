import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  firstTime = false;
  user = null;
  centralUrl = environment.centralUrl + '/api/mobile';
  httpType = environment.httpType;

  httpOptions = {
    headers: new HttpHeaders({
      Accept:  'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token')
    })
  };
  domain = localStorage.getItem('domain');
  constructor(private http: HttpClient) {
    // this.user = JSON.parse(localStorage.getItem('user'));

    // const domain = localStorage.getItem('authenticated');
  }


  auth(data:any, domain:any): Observable<any> {
    return this.http.post(`${this.httpType}${domain}.${this.centralUrl}/sanctum/token`, data, this.httpOptions);
  }

  logout(): Observable<any> {
    return this.http.get(`${this.httpType}${this.domain}.${this.centralUrl}/logout`, this.httpOptions);
  }

  org(data:any): Observable<any> {
    return this.http.get(`${this.httpType}${data.domain}.${this.centralUrl}/tenant_exists/${data.domain}`, this.httpOptions);
  }

  getUser(): Observable<any> {
    return this.http.get(`${this.httpType}${this.domain}.${this.centralUrl}/user`, this.httpOptions);
  }

  storeUser(domain:any, token:any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        Accept:  'application/json',
        // Authorization: environment.token
        Authorization: 'Bearer ' + token
      })
    };
    return this.http.get(`${this.httpType}${domain}.${this.centralUrl}/user`, httpOptions);
  }


  store_User(user:any) {
    localStorage.setItem('user', JSON.stringify(user));

    setTimeout(() => {
      // this.user = JSON.parse(localStorage.getItem('user'));
    }, 300);
  }

  async isFirstTimeLoad() {
    const result = await localStorage.getItem('firstTime');
    if (result) {
      this.firstTime = false;
    }
    else {
      this.firstTime = true;
    }

  }
}
