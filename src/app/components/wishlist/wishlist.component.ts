import { Component, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WishlistService } from 'src/app/core/services/wishlist.service';
import { Product } from 'src/app/core/interface/product';
import { ToastrService } from 'ngx-toastr';
import { CartService } from 'src/app/core/services/cart.service';
import { RouterLink } from '@angular/router';
import { CuttextPipe } from 'src/app/core/pipe/cuttext.pipe';
@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterLink, CuttextPipe],
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss'],
})
export class WishlistComponent implements OnInit {
  constructor(
    private _WishlistService: WishlistService,
    private _ToastrService: ToastrService,
    private _Renderer2: Renderer2,
    private _CartService: CartService
  ) {}

  products: Product[] = [];
  wishListData: string[] = [];
  ngOnInit(): void {
    this._WishlistService.getWishList().subscribe({
      next: (response) => {
        this.products = response.data;

        const newData = response.data.map((item: any) => item._id);

        this.wishListData = newData;
      },
    });
  }

  addProduct(id: any, element: HTMLButtonElement): void {
    this._Renderer2.setAttribute(element, 'disabled', 'true');

    this._CartService.addToCart(id).subscribe({
      next: (response) => {
        this._ToastrService.success(response.message);
        this._Renderer2.removeAttribute(element, 'disabled');

        this._CartService.cartNumber.next(response.numOfCartItems);
      },
      error: (err) => {
        this._Renderer2.removeAttribute(element, 'disabled');
      },
    });
  }

  addFav(productId: string | undefined): void {
    this._WishlistService.addToWishList(productId).subscribe({
      next: (response) => {
        console.log(response);
        this._ToastrService.success(response.message);
        this.wishListData = response.data;
      },
    });
  }

  removeFav(productId: string | undefined): void {
    this._WishlistService.removeWishList(productId).subscribe({
      next: (response) => {
        console.log(response);
        this._ToastrService.error(response.message);
        this.wishListData = response.data;

        const newProductsData = this.products.filter((item: any) =>
          this.wishListData.includes(item._id)
        );

        this.products = newProductsData;

        this._WishlistService.favNumber.next(response.data.length);
      },
    });
  }
}
