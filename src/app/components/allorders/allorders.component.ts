import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from 'src/app/core/services/order.service';
import { Orders } from 'src/app/core/interface/orders';
import { CartService } from 'src/app/core/services/cart.service';
import { Product } from 'src/app/core/interface/product';

@Component({
  selector: 'app-allorders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './allorders.component.html',
  styleUrls: ['./allorders.component.scss'],
})
export class AllordersComponent implements OnInit {
  userDataId: any;
  Orders: [] = [];
  cartItems: [] = [];
  allOrders: Orders[] = [];
  productId: string = '';
  product: Product[] = [];

  constructor(
    private _OrderService: OrderService,
    private _CartService: CartService
  ) {}
  ngOnInit(): void {
    this._OrderService.decodeUserData();
    this.userDataId = this._OrderService.userId;
    console.log(this.userDataId);
    this._OrderService.getUserOrder(this.userDataId).subscribe({
      next: (response) => {
        this.Orders = response;
        this.cartItems = response[''];
        console.log(this.cartItems);
        console.log(this.Orders);
      },
    });

    this._CartService.addToCart(this.productId).subscribe({
      next: (response) => {
        console.log(response);
      },
    });
  }
}
