import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    //Retrieve accesstoken from local storage
    const accessToken = sessionStorage.getItem('token');
    console.log('token', accessToken);

    //Check if accesToken exists, else send request without bearer token
    if (accessToken) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + accessToken),
      });

      console.log('Token added to HTTP request');

      return next.handle(cloned);
    } else {
      //No token; proceed request without bearer token
      console.log('No token added to HTTP request');
      const modifiedRequest = req.clone({
        headers: req.headers.append('enctype', 'multipart/form-data'),
      });
      return next.handle(modifiedRequest);
    }
  }
}
