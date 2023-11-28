package com.example.springbootecommerce.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "product_category")
//@Data -- known bug
@Getter
@Setter
public class ProductCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String categoryName;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "category")
    private Set<Product> products;
}
