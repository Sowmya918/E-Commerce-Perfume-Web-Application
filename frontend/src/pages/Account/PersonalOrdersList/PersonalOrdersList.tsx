import React, { FC, ReactElement, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ShoppingOutlined } from "@ant-design/icons";

import { selectIsOrdersLoading, selectOrders } from "../../../redux-toolkit/orders/orders-selector";

import { fetchUserOrders } from "../../../redux-toolkit/orders/orders-thunks";

import ContentTitle from "../../../components/ContentTitle/ContentTitle";
import Spinner from "../../../components/Spinner/Spinner";
import { resetOrders } from "../../../redux-toolkit/orders/orders-slice";
import OrdersTable from "../../../components/OrdersTable/OrdersTable";

const PersonalOrdersList: FC = (): ReactElement => {
    const dispatch = useDispatch<any>();

    const orders = useSelector(selectOrders);
    const isOrdersLoading = useSelector(selectIsOrdersLoading);

    useEffect(() => {
        // 🔥 ALWAYS REFRESH USER ORDERS
        dispatch(fetchUserOrders(0));

        return () => {
            dispatch(resetOrders());
        };
    }, [dispatch]);

    return (
        <>
            {isOrdersLoading ? (
                <Spinner />
            ) : (
                <>
                    {orders && orders.length > 0 ? (
                        <>
                            <div style={{ marginBottom: 20 }}>
                                <ContentTitle title={"My Orders"} titleLevel={4} icon={<ShoppingOutlined />} />
                            </div>

                            <OrdersTable loading={isOrdersLoading} orders={orders} fetchOrders={fetchUserOrders} />
                        </>
                    ) : (
                        <div style={{ textAlign: "center", marginTop: 40 }}>
                            <ContentTitle title={"You have no orders"} titleLevel={4} icon={<ShoppingOutlined />} />
                        </div>
                    )}
                </>
            )}
        </>
    );
};

export default PersonalOrdersList;
