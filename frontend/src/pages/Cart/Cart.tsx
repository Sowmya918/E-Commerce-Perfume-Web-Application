import React, { FC, ReactElement, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ShoppingCartOutlined, ShoppingOutlined } from "@ant-design/icons";
import { Button, Col, Row, Typography } from "antd";
import { Link } from "react-router-dom";

import ContentTitle from "../../components/ContentTitle/ContentTitle";
import ContentWrapper from "../../components/ContentWrapper/ContentWrapper";
import { selectCartItems, selectIsCartLoading } from "../../redux-toolkit/cart/cart-selector";
import { fetchCart } from "../../redux-toolkit/cart/cart-thunks";
import {
    calculateCartPrice,
    removePerfumeById,
    resetCartState,
    setCartItemsCount
} from "../../redux-toolkit/cart/cart-slice";
import CartItem from "./CartItem/CartItem";
import Spinner from "../../components/Spinner/Spinner";
import CartTotalPrice from "./CartTotalPrice";
import { ORDER } from "../../constants/routeConstants";
import "./Cart.css";

const Cart: FC = (): ReactElement => {
    const dispatch = useDispatch();
    const perfumes = useSelector(selectCartItems);
    const isCartLoading = useSelector(selectIsCartLoading);
    const [perfumeInCart, setPerfumeInCart] = useState(() => new Map());

    useEffect(() => {
        window.scrollTo(0, 0);

        const perfumesFromLocalStorage: Map<number, number> = new Map(
            JSON.parse(localStorage.getItem("perfumes") as string)
        );

        dispatch(fetchCart(Array.from(perfumesFromLocalStorage.keys())));

        perfumesFromLocalStorage.forEach((value: number, key: number) => {
            setPerfumeInCart(new Map(perfumeInCart.set(key, value)));
        });

        return () => {
            dispatch(resetCartState());
        };
    }, []);

    const deleteFromCart = (perfumeId: number): void => {
        perfumeInCart.delete(perfumeId);

        if (perfumeInCart.size === 0) {
            localStorage.removeItem("perfumes");
            setPerfumeInCart(new Map());
        } else {
            localStorage.setItem("perfumes", JSON.stringify(Array.from(perfumeInCart.entries())));
        }

        dispatch(removePerfumeById(perfumeId));
        dispatch(setCartItemsCount(perfumeInCart.size));
    };

    const onChangePerfumeItemCount = (perfumeId: number, inputValue: number): void => {
        setPerfumes(perfumeId, inputValue);
        dispatch(calculateCartPrice(perfumes));
    };

    const setPerfumes = (perfumeId: number, perfumeCount: number): void => {
        setPerfumeInCart(new Map(perfumeInCart.set(perfumeId, perfumeCount)));
        localStorage.setItem("perfumes", JSON.stringify(Array.from(perfumeInCart.entries())));
    };

    return (
        <ContentWrapper>
            {isCartLoading ? (
                <Spinner />
            ) : (
                <>
                    <div style={{ textAlign: "center", marginBottom: 20 }}>
                        <ContentTitle icon={<ShoppingCartOutlined />} title={"Cart"} />
                    </div>

                    <Row gutter={[24, 24]}>
                        {perfumes.length === 0 ? (
                            <Col span={24}>
                                <Typography.Title level={3} style={{ textAlign: "center" }}>
                                    Cart is empty
                                </Typography.Title>
                            </Col>
                        ) : (
                            <>
                                {/* LEFT: CART ITEMS */}
                                <Col xs={24} md={16}>
                                    {perfumes.map((perfume) => (
                                        <CartItem
                                            key={perfume.id}
                                            perfume={perfume}
                                            perfumeInCart={perfumeInCart.get(perfume.id)}
                                            onChangePerfumeItemCount={onChangePerfumeItemCount}
                                            deleteFromCart={deleteFromCart}
                                        />
                                    ))}
                                </Col>

                                {/* RIGHT: TOTAL + BUTTON */}
                                <Col xs={24} md={8}>
                                    <Row gutter={[16, 16]}>
                                        <Col xs={24}>
                                            <CartTotalPrice />
                                        </Col>

                                        <Col xs={24}>
                                            <Link to={ORDER}>
                                                <Button type="primary" icon={<ShoppingOutlined />} size="large" block>
                                                    Checkout
                                                </Button>
                                            </Link>
                                        </Col>
                                    </Row>
                                </Col>
                            </>
                        )}
                    </Row>
                </>
            )}
        </ContentWrapper>
    );
};

export default Cart;
