package com.gmail.ecommerce.mapper;

import com.gmail.ecommerce.domain.Order;
import com.gmail.ecommerce.dto.HeaderResponse;
import com.gmail.ecommerce.dto.order.OrderItemResponse;
import com.gmail.ecommerce.dto.order.OrderRequest;
import com.gmail.ecommerce.dto.order.OrderResponse;
import com.gmail.ecommerce.exception.InputFieldException;
import com.gmail.ecommerce.service.OrderService;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.validation.BindingResult;

import java.util.List;

@Component
@RequiredArgsConstructor
public class OrderMapper {

    private final CommonMapper commonMapper;
    private final OrderService orderService;
    
    public OrderResponse getOrderById(Long orderId) {
        return commonMapper.convertToResponse(orderService.getOrderById(orderId), OrderResponse.class);
    }
    
    public List<OrderItemResponse> getOrderItemsByOrderId(Long orderId) {
        return commonMapper.convertToResponseList(orderService.getOrderItemsByOrderId(orderId), OrderItemResponse.class);
    }

    public HeaderResponse<OrderResponse> getAllOrders(Pageable pageable) {
        Page<Order> orders = orderService.getAllOrders(pageable);
        return commonMapper.getHeaderResponse(orders.getContent(), orders.getTotalPages(), orders.getTotalElements(), OrderResponse.class);
    }

    public HeaderResponse<OrderResponse> getUserOrders(String email, Pageable pageable) {
        Page<Order> orders = orderService.getUserOrders(email, pageable);
        return commonMapper.getHeaderResponse(orders.getContent(), orders.getTotalPages(), orders.getTotalElements(), OrderResponse.class);
    }

    public String deleteOrder(Long orderId) {
        return orderService.deleteOrder(orderId);
    }

    public OrderResponse postOrder(OrderRequest orderRequest, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            throw new InputFieldException(bindingResult);
        }
        Order order = orderService.postOrder(commonMapper.convertToEntity(orderRequest, Order.class), orderRequest.getPerfumesId());
        return commonMapper.convertToResponse(order, OrderResponse.class);
    }

//    public OrderResponse postOrder(OrderRequest orderRequest, BindingResult bindingResult, String email) {
//
//        // 1. Validate input
//        if (bindingResult.hasErrors()) {
//            throw new InputFieldException(bindingResult);
//        }
//
//        // 2. Convert request → entity
//        Order orderEntity = commonMapper.convertToEntity(orderRequest, Order.class);
//
//        // 3. Pass logged-in user email
//        Order order = orderService.postOrder(
//                orderEntity,
//                orderRequest.getPerfumesId(),
//                email
//        );
//
//        // 4. Convert to response
//        return commonMapper.convertToResponse(order, OrderResponse.class);
//    }

}
