package com.example.springbootecommerce.service;

import com.example.springbootecommerce.dto.Purchase;
import com.example.springbootecommerce.dto.PurchaseResponse;

public interface CheckoutService {
    PurchaseResponse placeOrder(Purchase purchase);
}
