import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  baseUrl: string = `https://ecommerce.routemisr.com/api/v1/orders/`;
  constructor(private _HttpClient: HttpClient) {}
  userInfo: any;
  userId: any;
  myToken: any = { token: localStorage.getItem('etoken') };

  decodeUserData(): void {
    const encodeData = localStorage.getItem('etoken');
    if (encodeData != null) {
      const decodeData = jwtDecode(encodeData);
      this.userInfo = decodeData;
      this.userId = this.userInfo.id;
      console.log(this.userId);
      console.log(this.userInfo);
    }
  }

  getUserOrder(userId: any): Observable<any> {
    return this._HttpClient.get(this.baseUrl + `user/${userId}`);
  }
}
