import { Component, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from 'src/app/core/services/product.service';
import { Product } from 'src/app/core/interface/product';
import { RouterLink } from '@angular/router';
import { CuttextPipe } from 'src/app/core/pipe/cuttext.pipe';
import { ToastrService } from 'ngx-toastr';
import { CartService } from 'src/app/core/services/cart.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { SearchPipe } from 'src/app/core/pipe/search.pipe';
import { FormsModule } from '@angular/forms';
import { WishlistService } from 'src/app/core/services/wishlist.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CuttextPipe,
    NgxPaginationModule,
    SearchPipe,
    FormsModule,
  ],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  constructor(
    private _ProductService: ProductService,
    private _CartService: CartService,
    private _ToastrService: ToastrService,
    private _Renderer2: Renderer2,
    private _WishlistService: WishlistService
  ) {}

  products: Product[] = [];
  pageSize: number = 0;
  currentPage: number = 1;
  total: number = 0;
  term: string = '';
  wishListData: string[] = [];

  ngOnInit(): void {
    this._ProductService.getProducts().subscribe({
      next: (response) => {
        console.log('products', response.data);
        this.products = response.data;
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
        console.log('home', response);
        this._ToastrService.success(response.message);
        this.wishListData = response.data;

        this._WishlistService.favNumber.next(response.data.length);
      },
    });
  }

  removeFav(productId: string | undefined): void {
    this._WishlistService.removeWishList(productId).subscribe({
      next: (response) => {
        console.log(response);
        this._ToastrService.error(response.message);
        this.wishListData = response.data;
      },
    });
  }

  pageChanged(event: any): void {
    this._ProductService.getProducts(event).subscribe({
      next: (response) => {
        console.log('products', response.data);
        this.products = response.data;
        this.pageSize = response.metadata.limit;
        this.currentPage = response.metadata.currentPage;
        this.total = response.results;
      },
    });
  }
}
