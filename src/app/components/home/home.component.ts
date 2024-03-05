import { Component, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from 'src/app/core/services/product.service';
import { Product } from 'src/app/core/interface/product';
import { CuttextPipe } from 'src/app/core/pipe/cuttext.pipe';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { Category } from 'src/app/core/interface/category';
import { RouterLink } from '@angular/router';
import { CartService } from 'src/app/core/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { SearchPipe } from 'src/app/core/pipe/search.pipe';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { WishlistService } from 'src/app/core/services/wishlist.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    CuttextPipe,
    CarouselModule,
    RouterLink,
    SearchPipe,
    FormsModule,
    NgxPaginationModule,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(
    private _ProductService: ProductService,
    private _CartService: CartService,
    private _ToastrService: ToastrService,
    private _Renderer2: Renderer2,
    private _WishlistService: WishlistService
  ) {}

  products: Product[] = [];
  categories: Category[] = [];
  wishListData: string[] = [];
  term: string = '';
  pageSize: number = 0;
  currentPage: number = 1;
  total: number = 0;

  ngOnInit(): void {
    this._ProductService.getProducts().subscribe({
      next: (response) => {
        // console.log('products', response.data);
        this.products = response.data;

        this.pageSize = response.metadata.limit;
        this.currentPage = response.metadata.currentPage;
        this.total = response.results;
      },
    });

    this._ProductService.getCategories().subscribe({
      next: (response) => {
        // console.log('Categories', response);
        this.categories = response.data;
      },
    });

    this._WishlistService.getWishList().subscribe({
      next: (response) => {
        // console.log(response);

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
        // console.log('products', response.data);
        this.currentPage = event.page;

        this.pageSize = response.metadata.limit;
        this.currentPage = response.metadata.currentPage;
        this.total = response.results;
      },
    });
  }

  categoryOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    margin: 10,
    navSpeed: 700,
    navText: ['', ''],
    autoplay: true,
    autoplayTimeout: 4000,
    autoplaySpeed: 1000,
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 2,
      },
      740: {
        items: 3,
      },
      940: {
        items: 4,
      },
      980: {
        items: 8,
      },
    },
    nav: true,
  };

  mainSlideOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    autoplay: true,
    autoplayTimeout: 4000,
    autoplaySpeed: 1000,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1,
      },
    },
    nav: true,
  };
  productOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    items: 1,
    nav: true,
  };
}
