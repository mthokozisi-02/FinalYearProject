import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseHandler } from '../../../models/response-handler';
import { AlertService } from './alert.service';

const url = 'https://orezon.co.zw/api/v1';
const headers: HttpHeaders = new HttpHeaders().set(
  'Content-Type',
  'application/json, charset=utf-8'
);

@Injectable({
  providedIn: 'root',
})
export class ProductCategoryService extends AlertService {
  constructor(private http: HttpClient) {

    super()
  }

  create(itemDto: any) {
    var body = JSON.stringify(itemDto);
    console.log(body);
    return this.http.post<ResponseHandler>(`${url}/categories`, body, {
      headers,
    });
  }

  update(itemDto: any, id: number) {
    var body = JSON.stringify(itemDto);
    console.log(body);
    return this.http.put<ResponseHandler>(`${url}/categories/${id}`, body, {
      headers,
    });
  }

  delete(id: number) {
    return this.http.delete<ResponseHandler>(`${url}/categories/delete/${id}`);
  }

  getAllList() {
    return this.http.get<ResponseHandler>(`${url}/categories`);
  }
}
