package com.example.springbootecommerce.dto;

import com.example.springbootecommerce.entity.Address;
import com.example.springbootecommerce.entity.Customer;
import com.example.springbootecommerce.entity.Order;
import com.example.springbootecommerce.entity.OrderItem;
import lombok.Data;

import java.util.Set;

@Data
public class Purchase {

    private Customer customer;
    private Address shippingAddress;
    private Address billingAddress;
    private Order order;
    private Set<OrderItem> orderItems;
}
