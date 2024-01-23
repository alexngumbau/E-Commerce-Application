import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Purchase } from '../common/purchase';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PaymentInfo } from '../common/payment-info';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  private purchaseUrl = environment.luv2shopApiUrl +  '/checkout/purchase';

  private paymentIntentUrl = environment.luv2shopApiUrl + '/checkout/payment-intent';
  constructor(
    private httpClient : HttpClient
  ) { }

  placeorder(purchase: Purchase) : Observable<any> {
    return this.httpClient.post<Purchase>(this.purchaseUrl, purchase);
  }

  createPaymentIntent (paymentInfo : PaymentInfo) : Observable <any> {
    return this.httpClient.post<PaymentInfo>(this.paymentIntentUrl, paymentInfo);
  }
}
