import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertService } from '.';
import { ResponseHandler } from '../../../models/response-handler';

const url = 'http://127.0.0.1:8000/api/v1';
let headers: HttpHeaders = new HttpHeaders();
headers.append('Content-Type', 'multipart/form-data');
headers.append('enctype', 'multipart/form-data');

@Injectable({
  providedIn: 'root'
})
export class RatingService extends AlertService {

  constructor(private http: HttpClient) {
    super()
  }

  create(itemDto: any) {
    var body = JSON.stringify(itemDto);
    console.log(body);
    return this.http.post<ResponseHandler>(`${url}/ratings/rating`, itemDto, {
      headers,
    });
  }

  getAllList() {
    return this.http.get<ResponseHandler>(`${url}/ratings`);
  }
}
