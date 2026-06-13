import React, { FC, ReactElement, useEffect, useState } from "react";
import { Card, Col, InputNumber, Row, Typography } from "antd";

import { PerfumeResponse } from "../../../types/types";
import RemoveButton from "./RemoveButton";
import CartItemInfo from "./CartItemInfo";

type PropsType = {
    perfume: PerfumeResponse;
    perfumeInCart: number;
    onChangePerfumeItemCount: (perfumeId: number, inputValue: number) => void;
    deleteFromCart: (perfumeId: number) => void;
};

const CartItem: FC<PropsType> = ({
    perfume,
    perfumeInCart,
    onChangePerfumeItemCount,
    deleteFromCart
}): ReactElement => {
    const [perfumeCount, setPerfumeCount] = useState(1);

    useEffect(() => {
        setPerfumeCount(perfumeInCart);
    }, [perfumeInCart]);

    const handlePerfumesCount = (value: number | null): void => {
        if (!value) return;

        setPerfumeCount(value);
        onChangePerfumeItemCount(perfume.id, value);
    };

    return (
        <Card className="cart-item" style={{ marginBottom: 16 }}>
            <Row gutter={[16, 16]} align="middle">
                {/* LEFT SIDE (IMAGE + INFO) */}
                <CartItemInfo perfume={perfume} />

                {/* RIGHT SIDE */}
                <Col xs={24} md={8}>
                    {/* CONTROLS */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            flexWrap: "wrap"
                        }}
                    >
                        <InputNumber
                            min={1}
                            max={99}
                            value={perfumeCount}
                            onChange={handlePerfumesCount}
                            style={{ width: 70 }}
                        />

                        <RemoveButton perfumeId={perfume.id} deleteFromCart={deleteFromCart} />
                    </div>

                    {/* PRICE */}
                    <div style={{ marginTop: 12 }}>
                        <Typography.Title level={4} style={{ margin: 0 }}>
                            ₹{perfume.price * perfumeCount}
                        </Typography.Title>
                    </div>
                </Col>
            </Row>
        </Card>
    );
};

export default CartItem;
