import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  

  cartItems: CartItem[] = [];
  totalPrice : Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity : Subject<number> = new BehaviorSubject<number>(0);
  
  // storage: Storage = sessionStorage;
  storage: Storage = localStorage;
  

  constructor() {

    // read data from storage
    let data = this.storage.getItem('cartItems');

    if (data) {
      // if data is not null, parse it
      let parsedData = JSON.parse(data);

      if (parsedData != null) {
        this.cartItems = parsedData;

        // Compute totals based on the data that is read from storage
        this.computeCartTotals()
      }
    }

    
   }
  
  addToCart(theCartItem: CartItem) {
    // Check if we already have the item in our cart
    let alreayExistsInCart : boolean = false;
    let existingCartItem : CartItem |  undefined = undefined;

    if (this.cartItems.length > 0) {    
      // find the item in the cart based on item id 
      for (let tempCartItem of this.cartItems) {
        if (tempCartItem.id === theCartItem.id) {
          existingCartItem = tempCartItem;
          break;
        }
      }
      // check if we found it
      alreayExistsInCart = (existingCartItem != undefined); 
    }

    if (alreayExistsInCart) {
      // increment the quantity
      if (existingCartItem) {
        existingCartItem.quantity++;
      }
    } else{
      // just add theitem to the array
      this.cartItems.push(theCartItem)
    }

    // compute cart total price and total quantity
    this.computeCartTotals();
    

  }

  computeCartTotals() {
    let totalPriceValue : number = 0;
    let totalQuantityValue : number = 0;
    
    for (let currentCartItem of this.cartItems) {
      totalPriceValue += currentCartItem.quantity  * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }
    // publish the new values ... all subscribers will receive the new data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    // debugging
    this.logCartData(totalPriceValue, totalQuantityValue);

    // persist cart data
    this.persistCartItems();
  }

  persistCartItems() {
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems));  
  }

  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log('Contents of the cart');
    for (let tempCartItem of this.cartItems) {
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(`name: ${tempCartItem.name}, quantity = ${tempCartItem.quantity}, unitPrice = ${tempCartItem.unitPrice}, subTotalPrice= ${subTotalPrice} `);
      
    }
    console.log(`totalPrice: ${totalPriceValue.toFixed(2)}, totalQuantity: ${totalQuantityValue}`);
    console.log('----------------------------');
    
    
    
  }

  decrementQuantity(theCartItem: CartItem) {
    theCartItem.quantity--;
    if (theCartItem.quantity == 0) {
      this.remove(theCartItem);
    } else{
      this.computeCartTotals();
    }
  }

  remove(theCartItem: CartItem) {
    // get index of item in the array
    const itemIndex = this.cartItems.findIndex(tempCartItem => tempCartItem.id === theCartItem.id);
    // if found, remove the item from the array of the given index
    if (itemIndex > -1) {
      this.cartItems.splice(itemIndex, 1);

      this.computeCartTotals();
    }
  }
  

   
}
