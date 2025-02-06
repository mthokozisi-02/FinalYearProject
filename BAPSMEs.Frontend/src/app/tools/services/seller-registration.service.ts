import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertService } from '.';
import { ResponseHandler } from '../../../models/response-handler';

const url = 'https://orezon.co.zw/api/v1';
const headers: HttpHeaders = new HttpHeaders().set(
  'Content-Type',
  'application/json, charset=utf-8'
);

@Injectable({
  providedIn: 'root',
})
export class SellerRegistrationService extends AlertService {
  constructor(private http: HttpClient) {
    super()
  }

  create(itemDto: any) {
    var body = JSON.stringify(itemDto);
    console.log(body);
    return this.http.post<ResponseHandler>(`${url}/sellers/register`, body, {
      headers,
    });
  }

  update(itemDto: any, id: number) {
    var body = JSON.stringify(itemDto);
    console.log(body);
    return this.http.put<ResponseHandler>(`${url}/sellers/update/${id}`, body, {
      headers,
    });
  }

  delete(id: number) {
    return this.http.delete<ResponseHandler>(`${url}/sellers/delete/${id}`);
  }

  get(id: number) {
    return this.http.get<ResponseHandler>(`${url}/sellers/${id}`);
  }

  getAllList() {
    return this.http.get<ResponseHandler>(`${url}/sellers`);
  }
}
