import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from 'src/app/core/services/product.service';
import { ActivatedRoute } from '@angular/router';
import { Category } from 'src/app/core/interface/category';

@Component({
  selector: 'app-brandsdetails',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './brandsdetails.component.html',
  styleUrls: ['./brandsdetails.component.scss'],
})
export class BrandsdetailsComponent implements OnInit {
  constructor(
    private _ProductService: ProductService,
    private _ActivatedRoute: ActivatedRoute
  ) {}

  BrandsId: string | null = '';
  brandsDetails: Category = {} as Category;
  ngOnInit(): void {
    this._ActivatedRoute.paramMap.subscribe({
      next: (params) => {
        this.BrandsId = params.get('id');
      },
    });

    this._ProductService.getSpecificBrand(this.BrandsId).subscribe({
      next: (response) => {
        this.brandsDetails = response.data;
      },
    });
  }
}
