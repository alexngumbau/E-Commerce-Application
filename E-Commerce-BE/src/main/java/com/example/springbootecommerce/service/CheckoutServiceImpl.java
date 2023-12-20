package com.example.springbootecommerce.service;

import com.example.springbootecommerce.dao.CustomerRepository;
import com.example.springbootecommerce.dto.Purchase;
import com.example.springbootecommerce.dto.PurchaseResponse;
import com.example.springbootecommerce.entity.Customer;
import com.example.springbootecommerce.entity.Order;
import com.example.springbootecommerce.entity.OrderItem;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CheckoutServiceImpl implements  CheckoutService{
    private CustomerRepository customerRepository;
    @Override
    @Transactional
    public PurchaseResponse placeOrder(Purchase purchase) {
        //Retrieve the order info from DTO
        Order order = purchase.getOrder();
        // Generate tracking number
        String orderTrackingNumber = generateOrderTrackingNumber();
        order.setOrderTrackingNumber(orderTrackingNumber);
        // Populate order with orderItems
        Set<OrderItem> orderItems = purchase.getOrderItems();
        orderItems.forEach(item -> order.add(item));
        // Populate order with billingAddress and shippingAddress
        order.setBillingAddress(purchase.getBillingAddress());
        order.setShippingAddress(purchase.getShippingAddress());
        // Populate customer with order
        Customer customer = purchase.getCustomer();
        customer.add(order);
        // Save to the database
    customerRepository.save(customer);
        // Return a response
        return new PurchaseResponse(orderTrackingNumber);
    }

    private String generateOrderTrackingNumber() {
        // Generate a random UUID number(UUID version-4
        return UUID.randomUUID().toString();
    }
}
