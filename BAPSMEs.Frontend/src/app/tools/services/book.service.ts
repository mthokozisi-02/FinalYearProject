import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseHandler } from '../../../models/response-handler';
import { AlertService } from './alert.service';

const url = 'http://127.0.0.1:8000/api/v1';
const headers: HttpHeaders = new HttpHeaders().set(
  'Content-Type',
  'application/json, charset=utf-8'
);

@Injectable({
  providedIn: 'root'
})
export class BookService extends AlertService {

  constructor(private http: HttpClient) {
    super()
  }

  getSellerBookings() {
    return this.http.get<ResponseHandler>(`${url}/bookings/seller`);
  }

  getBuyerBookings() {
    return this.http.get<ResponseHandler>(`${url}/bookings/buyer`);
  }

  getAllList() {
    return this.http.get<ResponseHandler>(`${url}/bookings/`);
  }

  book(itemDto: any) {
    var body = JSON.stringify(itemDto);
    console.log(body);
    return this.http.post<ResponseHandler>(`${url}/bookings/book`, body, {
      headers,
    });
  }

  updateStatus(id: number) {
    var body = JSON.stringify(id);
    return this.http.put<ResponseHandler>(`${url}/bookings/${id}`, {
      headers,
    });
  }
}
