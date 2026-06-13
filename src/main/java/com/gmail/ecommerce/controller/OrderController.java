package com.gmail.ecommerce.controller;

import com.gmail.ecommerce.dto.GraphQLRequest;
import com.gmail.ecommerce.dto.HeaderResponse;
import com.gmail.ecommerce.dto.order.OrderItemResponse;
import com.gmail.ecommerce.dto.order.OrderRequest;
import com.gmail.ecommerce.dto.order.OrderResponse;
import com.gmail.ecommerce.mapper.OrderMapper;
import com.gmail.ecommerce.security.UserPrincipal;
import com.gmail.ecommerce.service.graphql.GraphQLProvider;
import graphql.ExecutionResult;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

import static com.gmail.ecommerce.constants.PathConstants.*;

@RestController
@RequiredArgsConstructor
@RequestMapping(API_V1_ORDER)
public class OrderController {

    private final OrderMapper orderMapper;
    private final GraphQLProvider graphQLProvider;

    @GetMapping(ORDER_ID)
    public ResponseEntity<OrderResponse> getOrderById(
            @PathVariable Long orderId) {

        return ResponseEntity.ok(
                orderMapper.getOrderById(orderId)
        );
    }

    @GetMapping(ORDER_ID_ITEMS)
    public ResponseEntity<List<OrderItemResponse>> getOrderItemsByOrderId(
            @PathVariable Long orderId) {

        return ResponseEntity.ok(
                orderMapper.getOrderItemsByOrderId(orderId)
        );
    }

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getUserOrders(
            @AuthenticationPrincipal UserPrincipal user,
            @PageableDefault(size = 10) Pageable pageable) {

        if (user == null) {
            return ResponseEntity.badRequest().build();
        }

        HeaderResponse<OrderResponse> response =
                orderMapper.getUserOrders(
                        user.getEmail(),
                        pageable
                );

        return ResponseEntity.ok()
                .headers(response.getHeaders())
                .body(response.getItems());
    }

    @PostMapping
    public ResponseEntity<OrderResponse> postOrder(
            @Valid @RequestBody OrderRequest order,
            BindingResult bindingResult) {

        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(
                orderMapper.postOrder(
                        order,
                        bindingResult
                )
        );
    }

    @PostMapping(GRAPHQL)
    public ResponseEntity<ExecutionResult> getUserOrdersByQuery(
            @RequestBody GraphQLRequest request) {

        return ResponseEntity.ok(
                graphQLProvider
                        .getGraphQL()
                        .execute(request.getQuery())
        );
    }
}