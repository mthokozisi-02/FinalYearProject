import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { ResponseHandler } from '../../../models/response-handler';
import { AlertService } from './alert.service';



@Injectable({
  providedIn: 'root'
})
export class PaypalService  extends AlertService{

  url = environment.url;
  headers: HttpHeaders = new HttpHeaders().set(
    'Content-Type',
    'application/json, charset=utf-8'
  );


  constructor(private http: HttpClient) {

    super()
   }

  postOrder(itemDto: any) {
    var body = JSON.stringify(itemDto);
    return this.http.post<ResponseHandler>(`${this.url}/orders`, itemDto, {
      ...this.headers,
    });
  }


  subscribeOrder(itemDto: any) {
    return this.http.post<ResponseHandler>(`${this.url}/subscriptions/subscribe`, itemDto, {
      ...this.headers,
    });
  }



}
