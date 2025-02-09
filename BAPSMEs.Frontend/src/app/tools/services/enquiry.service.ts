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
export class EnquiryService extends AlertService {

  constructor(private http: HttpClient) {
    super()
  }

  getSellerEnquiries() {
    return this.http.get<ResponseHandler>(`${url}/enquiries/seller`);
  }

  getBuyerEnquiries() {
    return this.http.get<ResponseHandler>(`${url}/enquiries/buyer`);
  }

  getAllList() {
    return this.http.get<ResponseHandler>(`${url}/enquiries/`);
  }

  enquire(itemDto: any) {
    var body = JSON.stringify(itemDto);
    console.log(body);
    return this.http.post<ResponseHandler>(`${url}/enquiries/enquire`, body, {
      headers,
    });
  }

  updateStatus(id: number) {
    var body = JSON.stringify(id);
    return this.http.put<ResponseHandler>(`${url}/enquiries/${id}`, {
      headers,
    });
  }
}
