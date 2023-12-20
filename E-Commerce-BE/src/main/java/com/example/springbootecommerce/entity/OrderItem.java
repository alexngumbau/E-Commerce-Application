package com.example.springbootecommerce.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "orderItem")
@Getter
@Setter
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private  String imageUrl;
    private BigDecimal unitPrice;
    private int quantity;
    private  Long productId;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;
}
