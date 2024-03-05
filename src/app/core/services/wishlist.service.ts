import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  baseUrl: string = `https://ecommerce.routemisr.com/api/v1/`;

  favNumber: BehaviorSubject<number> = new BehaviorSubject(0);

  constructor(private _HttpClient: HttpClient) {}

  addToWishList(productId: string | undefined): Observable<any> {
    return this._HttpClient.post(this.baseUrl + `wishlist`, {
      productId: productId,
    });
  }

  getWishList(): Observable<any> {
    return this._HttpClient.get(this.baseUrl + `wishlist`);
  }

  removeWishList(productId: string | undefined): Observable<any> {
    return this._HttpClient.delete(this.baseUrl + `wishlist/${productId}`);
  }
}
