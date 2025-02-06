import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertService } from '.';
import { ResponseHandler } from '../../../models/response-handler';

const url = 'https://orezon.co.zw/api/v1';
let headers: HttpHeaders = new HttpHeaders();
headers.append('Content-Type', 'multipart/form-data');
headers.append('enctype', 'multipart/form-data');

@Injectable({
  providedIn: 'root',
})
export class ProductsService extends AlertService {
  constructor(private http: HttpClient) {
    super()
  }

  create(itemDto: any) {
    return this.http.post<ResponseHandler>(`${url}/products/create`, itemDto, {
      headers,
    });
  }

  update(itemDto: any, id: number) {
    return this.http.put<ResponseHandler>(`${url}/products/update/${id}`, itemDto, {
      headers,
    });
  }

  delete(id: number) {
    return this.http.delete<ResponseHandler>(`${url}/products/${id}`);
  }

  get(id: number) {
    return this.http.delete<ResponseHandler>(`${url}/products/${id}`);
  }

  getSellerProducts(id: number) {
    return this.http.get<ResponseHandler>(`${url}/products/seller/${id}`);
  }

  getAllList() {
    return this.http.get<ResponseHandler>(`${url}/products`);
  }
}
