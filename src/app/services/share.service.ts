import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShareService {

  constructor() { }

  public static parseObject(object: any){
    return JSON.parse(JSON.stringify(object))
  }
}
