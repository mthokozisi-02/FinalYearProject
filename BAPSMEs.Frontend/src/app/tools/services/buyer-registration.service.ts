import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseHandler } from '../../../models/response-handler';
import { AlertService } from './alert.service';

// const url = 'http://localhost:8000/api/v1';
const url = 'https://orezon.co.zw/api/v1';
const headers: HttpHeaders = new HttpHeaders().set(
  'Content-Type',
  'application/json, charset=utf-8'
);

@Injectable({
  providedIn: 'root',
})
export class BuyerRegistrationService extends AlertService {
  constructor(private http: HttpClient) {
    super()
  }

  create(itemDto: any) {
    var body = JSON.stringify(itemDto);
    console.log('item dto ', body);
    return this.http.post<ResponseHandler>(`${url}/buyers/buyer`, itemDto, {
      headers,
    });
  }

  update(itemDto: any, id: number) {
    var body = JSON.stringify(itemDto);
    console.log('body', body);
    return this.http.put<ResponseHandler>(`${url}/buyers/buyer/${id}`, body, {
      headers,
    });
  }

  delete(id: number) {
    return this.http.delete<ResponseHandler>(`${url}/buyers/buyer/${id}`);
  }

  get(id: number) {
    return this.http.get<ResponseHandler>(`${url}/buyers/buyer/${id}`);
  }

  getAllList() {
    return this.http.get<ResponseHandler>(`${url}/buyers/buyer`);
  }
}
