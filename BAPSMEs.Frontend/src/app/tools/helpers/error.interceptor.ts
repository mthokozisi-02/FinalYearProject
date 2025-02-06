import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { delay, mergeMap, Observable, of, retry, retryWhen } from 'rxjs';
import { AlertService } from '../services';

export const maxRetries = 2;
export const delayMs = 2000;

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor( public alertService: AlertService){}
  intercept(req: HttpRequest<any>, next: HttpHandler,): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      retryWhen((error) =>{
        return error.pipe(
       mergeMap((error ,index) =>{
            if(index < maxRetries && error.status  == 500){
              this.alertService.error(error.error.message)
              return of(error).pipe(delay(delayMs))
            }{
              this.alertService.error(error.error.message)
              return '';
            }

          })
        )

      })
    )
  }


}