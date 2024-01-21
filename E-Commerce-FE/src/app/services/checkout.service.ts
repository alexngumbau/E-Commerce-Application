import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Purchase } from '../common/purchase';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  private purchaseUrl = environment.luv2shopApiUrl +  '/checkout/purchase';

  constructor(
    private httpClient : HttpClient
  ) { }

  placeorder(purchase: Purchase) : Observable<any> {
    return this.httpClient.post<Purchase>(this.purchaseUrl, purchase);
  }
}
