import { Injectable } from '@angular/core';
import * as Notiflix from 'notiflix';
import { LoaderService } from '.';

@Injectable()
export class AlertService {


  error(text: string, callback?: any) {
    Notiflix.Notify.failure(text || 'Server Error', callback, {
      position: 'right-top',
      cssAnimation:true,
      cssAnimationStyle:  'from-bottom',
      useIcon:true,
      fontSize:'20px',
      borderRadius:'20px',
      width:'500px'
    });
  }

  success(text: string, callback?: any) {
    Notiflix.Notify.success(text, callback, {
      position: 'right-top',
      cssAnimation:true,
      cssAnimationStyle:  'from-bottom',
      useIcon:true,
      fontSize:'20px',
      borderRadius:'20px',
      width:'500px'
    });
  }

    report(text:string ,message ,callback?:any){
    Notiflix.Report.success(text ,message,'Ok',{

    })

  }

  reportError(text:string ,message ,callback?:any){
    Notiflix.Report.failure(text ,message,'Ok',{

    })

  }



  loader(callback?: any) {

    Notiflix.Loading.pulse('Processing, Please Wait',{
      cssAnimation: true,
      backgroundColor: 'rgba(145, 185, 224, 0.8)',

    });

  }


  closeLoader (){
    Notiflix.Loading.remove();
  }

  loaderInfo(text:any ,callback?: any) {
    Notiflix.Notify.success(text, callback, {
      position: 'center-center',
      cssAnimation:true,
      cssAnimationStyle:  'from-bottom',
      clickToClose:true,
      closeButton:true,
      useIcon:true,
      fontSize:'20px',
      borderRadius:'20px',
      width:'500px'

    });
  }
}
