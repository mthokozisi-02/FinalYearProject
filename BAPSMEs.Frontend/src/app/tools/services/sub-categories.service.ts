import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AlertService } from '.';
import { ResponseHandler } from '../../../models/response-handler';
import { SubCategory } from '../../../models/sub-category';
import { SubCategoryResponse } from '../../../models/sub-category-response';

const CACHE_SIZE = 1;

const url = 'http://127.0.0.1:8000/api/v1';
const headers: HttpHeaders = new HttpHeaders().set(
  'Content-Type',
  'application/json, charset=utf-8'
);

@Injectable({
  providedIn: 'root',
})
export class SubCategoriesService extends AlertService {
  private cache$: Observable<Array<SubCategory>>;

  constructor(private http: HttpClient) {
    super()
  }

  get subCategories() {
    if (!this.cache$) {
      this.cache$ = this.getAllList().pipe(
        shareReplay(CACHE_SIZE)
      );
    }

    return this.cache$;
  }

  create(itemDto: any) {
    var body = JSON.stringify(itemDto);
    console.log(body);
    return this.http.post<ResponseHandler>(`${url}/sub-categories`, body, {
      headers,
    });
  }

  createCategory(itemDto: any) {
    var body = JSON.stringify(itemDto);
    console.log(body);
    return this.http.post<ResponseHandler>(`${url}/categories`, body, {
      headers,
    });
  }

  update(itemDto: any, id: number) {
    var body = JSON.stringify(itemDto);
    console.log(body);
    return this.http.put<ResponseHandler>(`${url}/sub-categories/${id}`, body, {
      headers,
    });
  }

  delete(id: number) {
    return this.http.delete<ResponseHandler>(`${url}/sub-categories/${id}`);
  }

  getAllList() {
    return this.http.get<SubCategoryResponse>(`${url}/sub-categories`).pipe(
      map(response => response.data)
    );
    //return this.http.get<SubCategory>(`${url}/sub-categories`);
  }
}
