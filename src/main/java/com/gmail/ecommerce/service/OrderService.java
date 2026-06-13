package com.gmail.ecommerce.service;

import com.gmail.ecommerce.domain.Order;
import com.gmail.ecommerce.domain.OrderItem;
import graphql.schema.DataFetcher;

import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface OrderService {

    Order getOrderById(Long orderId);

    List<OrderItem> getOrderItemsByOrderId(Long orderId);
    
    Page<Order> getAllOrders(Pageable pageable);

    Page<Order> getUserOrders(String email, Pageable pageable);

    Order postOrder(Order validOrder, Map<Long, Long> perfumesId);

//    Order postOrder(Order validOrder, Map<Long, Long> perfumesId,String email);
    String deleteOrder(Long orderId);

    DataFetcher<List<Order>> getAllOrdersByQuery();

    DataFetcher<List<Order>> getUserOrdersByEmailQuery();
}
