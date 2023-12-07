import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  product!: Product;

  constructor(
    private productService : ProductService,
    private route : ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.handleProductDetails();
    })
  }
  handleProductDetails() {
    // get the "id" param string.
    const idParam : string | null = this.route.snapshot.paramMap.get('id');

    // check if idParam is not null before trying to convert to a number
    if (idParam !== null) {
      const theProductId: number= +idParam;

      this.productService.getProduct(theProductId).subscribe(
        data => {
          this.product = data;
        }
      )
    }
   
  }

}
