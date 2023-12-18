import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { Luv2ShopFormService } from 'src/app/services/luv2-shop-form.service';
import { Luv2ShopValidators } from 'src/app/validators/luv2-shop-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {


  checkoutFormGroup : FormGroup;
  totalPrice: number = 0;
  totalQuantity: number = 0;

  // Properties for months and years
  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  // Properties for countries and states
  countries : Country[] = [];

  // Properties for shipping and billing address
  shippingAddressStates: State[] = [];
  billingAddressStates: State[]=[];


  constructor(
    private formBuilder : FormBuilder,
    private luv2ShopService: Luv2ShopFormService
  ) { }

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({

      customer: this.formBuilder.group({
        firstName: new FormControl('', 
                                      [Validators.required, 
                                        Validators.minLength(2), 
                                        Luv2ShopValidators.notOnlyWhitespace]),
        lastName:  new FormControl('', 
                                      [Validators.required, 
                                        Validators.minLength(2), 
                                        Luv2ShopValidators.notOnlyWhitespace]),
        email: new FormControl('', 
                              [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),

      shippingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: [''],
      }),

      billingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: [''],
      }),

      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: [''],
      })
    });

    // Populate credit card months
    const startMonth : number = new Date().getMonth() + 1;
    console.log("startMonth: " +startMonth);
    
    this.luv2ShopService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
        
      }
    );
    // populate credit card years
    this.luv2ShopService.getCreditCardYears().subscribe(
      data => {
        console.log("Retrieving credit card years: " + JSON.stringify(data));
        this.creditCardYears = data;
      }
    );

    // populate countries
    this.luv2ShopService.getCountries().subscribe(
      data => {
        console.log("Retrieved countries: " + JSON.stringify(data));
        this.countries = data;
      }
    );

    

  }

  get firstName() {return this.checkoutFormGroup.get('customer.firstName');}
  get lastName() {return this.checkoutFormGroup.get('customer.lastName');}
  get email() {return this.checkoutFormGroup.get('customer.email');}

  

  copyShippingAddressToBillingAddress(event : any) {
    if (event.target.checked) {
      this.checkoutFormGroup.controls['billingAddress']
        .setValue(this.checkoutFormGroup.controls['shippingAddress'].value);

      // bug fix for states
      this.billingAddressStates = this.shippingAddressStates;
    }else {
      this.checkoutFormGroup.controls['billingAddress'].reset();

      // bug fix for states
      this.billingAddressStates = [];
    }

  }

  handleMonthsAndYears() {
    const creditCadFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCadFormGroup?.value.expirationYear);

    // if the current year equals the selected year, then start with the current month

    let startMonth: number;

    if(currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }

    this.luv2ShopService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );
  }

  
  onSubmit() {
    console.log("Handling the submit button");

    if  (this.checkoutFormGroup.invalid) {
      // Touching all fields triggers the display of the error messages
      this.checkoutFormGroup.markAllAsTouched();
    }
    console.log(this.checkoutFormGroup.get('customer')?.value);
    console.log("The email address is: " +  this.checkoutFormGroup.get('customer')?.value.email);

    console.log("The shipping adress country is : " +  this.checkoutFormGroup.get('shippingAddress')?.value.country.name);
    console.log("The shipping adress state is : " +  this.checkoutFormGroup.get('shippingAddress')?.value.state.name);
    
    
  }

  getStates(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup?.value.country.code;
    const countryName = formGroup?.value.country.name;

    console.log(`${formGroupName} country code : ${countryCode}`);
    console.log(`${formGroupName} country name : ${countryName}`);

    this.luv2ShopService.getStates(countryCode).subscribe(
      data => {
        if (formGroupName === 'shippingAddress') {
          this.shippingAddressStates = data;
        } else {
          this.billingAddressStates = data;
        }

        // select first item by default
        formGroup?.get('state')?.setValue(data[0]);
      }
    );
    
  }



  

}
