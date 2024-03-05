import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

    centralUrl = environment.centralUrl + '/api/mobile/';
    domain = environment.httpType;
    httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        // Authorization: environment.token
        Authorization: 'Bearer ' + localStorage.getItem('token')
      })
    };
    constructor(private http: HttpClient) { }

    getItem(model: any): Observable<any> {
      let url = this.centralUrl + model
      return this.http.get<any>(`${url}`, this.httpOptions);
    }

    postItem(data: any, model: String): Observable<any> {
      // let url = this.centralUrl + model
      let url = this.centralUrl + model
      return this.http.post(`${url}`, data, this.httpOptions);
    }

    patchItem(data: any,model: String, id: any): Observable<any> {
      // let url = this.centralUrl + model
      let url = '';
      return this.http.patch(`${url}/${id}`, data, this.httpOptions);
    }

    sms(data:any, id:number): Observable<any> {
      // console.log(data);
      return this.http.post(`${this.domain}${this.domain}.${this.centralUrl}/sms/${id}`, data, this.httpOptions);
    }
  }
