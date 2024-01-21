import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { Observable, from, lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(
    @Inject(OKTA_AUTH) private oktaAuth : OktaAuth
  ) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.handleAccess(req, next))
  }

  private async handleAccess(request: HttpRequest<any>, next : HttpHandler): Promise<HttpEvent<any>> {
    
    // Only add an access token for secured endpoints
    const theEndPoint = environment.luv2shopApiUrl + '/orders';
    const securedEndpoints = [theEndPoint];

    if (securedEndpoints.some(url => request.urlWithParams.includes(url))) {

      // get the access token
      const accessToken = this.oktaAuth.getAccessToken();

      // Clone the request and add new header with access token
      // We clone because the request is immutable -- you can't change it directly-- you have to make a copy of it
      request = request.clone({
        setHeaders: {
          Authorization : 'Bearer ' + accessToken
        }
      });
    }

    return await lastValueFrom(next.handle(request));
  }


}
