import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { ResponseHandler } from '../../../models/response-handler';
import { AlertService } from './alert.service';

const url = environment.url;
const headers: HttpHeaders = new HttpHeaders().set(
  'Content-Type',

  'application/json, charset=utf-8'
);

@Injectable({
  providedIn: 'root',
})
export class PackagesService extends AlertService {
  constructor(private http: HttpClient) {
    super()
  }

  create(itemDto: any) {
    var body = JSON.stringify(itemDto);
    console.log(body);
    return this.http.post<ResponseHandler>(`${url}/packages/register`, body, {
      headers,
    });
  }

  update(itemDto: any, id: number) {
    var body = JSON.stringify(itemDto);
    console.log(body);
    return this.http.put<ResponseHandler>(
      `${url}/packages/update/${id}`,
      body,
      { headers }
    );
  }

  delete(id: number) {
    return this.http.delete<ResponseHandler>(`${url}/packages/delete/${id}`);
  }

  getAllList() {
    return this.http.get<ResponseHandler>(`${url}/packages`);
  }

  selectPackage(itemDto: any) {
    var body = JSON.stringify(itemDto);
    console.log(body);
    return this.http.post<ResponseHandler>(
      `${url}/seller/select-package`,
      body,
      { headers }
    );
  }
}
