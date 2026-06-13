import React, { FC, ReactElement } from "react";
import { Button, Card, Col, Rate, Typography } from "antd";
import { Link } from "react-router-dom";
import { DeleteOutlined, EditOutlined, ShoppingCartOutlined } from "@ant-design/icons";

import { PerfumeResponse } from "../../types/types";
import { ACCOUNT_ADMIN_PERFUMES, PRODUCT } from "../../constants/routeConstants";
import { useCart } from "../../hooks/useCart";
import "./PerfumeCard.css";

const { Title, Text } = Typography;

type PropsType = {
    perfume: PerfumeResponse;
    colSpan: number;
    edit?: boolean;
    onOpenDelete?: (perfume: PerfumeResponse) => void;
};

const PerfumeCard: FC<PropsType> = ({ perfume, colSpan, edit, onOpenDelete }): ReactElement => {
    const { addToCart } = useCart(perfume.id);

    const onClickAddToCart = (event: any) => {
        event.preventDefault();
        addToCart();
    };

    return (
        <Col span={colSpan}>
            <Link to={`${PRODUCT}/${perfume.id}`}>
                <Card
                    className="perfume-card"
                    hoverable
                    cover={
                        <div className="image-wrapper">
                            <img
                                src={
                                    perfume.filename.startsWith("http") || perfume.filename.startsWith("/img/")
                                        ? perfume.filename
                                        : `http://localhost:8080/uploads/${perfume.filename}`
                                }
                                alt={perfume.perfumeTitle}
                            />
                        </div>
                    }
                >
                    {/* ⭐ Rating */}
                    <div className="perfume-rating">
                        <Rate disabled defaultValue={perfume.perfumeRating || 5} />
                        <Text type="secondary">({perfume.reviewsCount})</Text>
                    </div>

                    {/* 🧴 Title */}
                    <Title level={5} className="perfume-title">
                        {perfume.perfumeTitle}
                    </Title>

                    {/* 🏷 Brand */}
                    <Text className="perfume-brand">{perfume.perfumer}</Text>

                    {/* 💰 Price */}
                    <Title level={4} className="perfume-price">
                        ₹{perfume.price}
                    </Title>

                    {/* 🛒 Button */}
                    {!edit ? (
                        <Button
                            type="primary"
                            block
                            icon={<ShoppingCartOutlined />}
                            onClick={onClickAddToCart}
                            className="add-btn"
                        >
                            Add to Cart
                        </Button>
                    ) : (
                        <div className="admin-actions">
                            <Link to={`${ACCOUNT_ADMIN_PERFUMES}/${perfume.id}`}>
                                <Button icon={<EditOutlined />}>Edit</Button>
                            </Link>
                            <Button danger icon={<DeleteOutlined />} onClick={() => onOpenDelete!(perfume)}>
                                Delete
                            </Button>
                        </div>
                    )}
                </Card>
            </Link>
        </Col>
    );
};

export default PerfumeCard;
