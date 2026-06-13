import React, { FC, ReactElement, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, Route } from "react-router-dom";
import { Col, Row } from "antd";
import { UserOutlined } from "@ant-design/icons";

import ContentWrapper from "../../components/ContentWrapper/ContentWrapper";
import { selectUserFromUserState } from "../../redux-toolkit/user/user-selector";
import { resetAuthState } from "../../redux-toolkit/auth/auth-slice";
import { fetchUserInfo } from "../../redux-toolkit/user/user-thunks";
import { UserRoles } from "../../types/types";

import {
    ACCOUNT,
    ACCOUNT_ADMIN_ADD,
    ACCOUNT_ADMIN_ORDERS,
    ACCOUNT_ADMIN_PERFUMES,
    ACCOUNT_ADMIN_USERS,
    ACCOUNT_USER_EDIT,
    ACCOUNT_USER_INFO,
    ACCOUNT_USER_ORDERS
} from "../../constants/routeConstants";

import AccountLink from "./AccountLink/AccountLink";
import AccountItem from "./AccountItem/AccountItem";
import PersonalData from "./PersonalData/PersonalData";
import AddPerfume from "./AddPerfume/AddPerfume";
import PerfumeList from "./PerfumeList/PerfumeList";
import EditPerfume from "./EditPerfume/EditPerfume";
import OrdersList from "./OrdersList/OrdersList";
import ManageUserOrder from "./ManageUserOrder/ManageUserOrder";
import UsersList from "./UsersList/UsersList";
import ManageUser from "./ManageUser/ManageUser";
import ChangePassword from "./ChangePassword/ChangePassword";
import PersonalOrdersList from "./PersonalOrdersList/PersonalOrdersList";

const Account: FC = (): ReactElement => {
    const dispatch = useDispatch<any>();
    const usersData = useSelector(selectUserFromUserState);

    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        dispatch(resetAuthState());
        dispatch(fetchUserInfo());
    }, [dispatch]);

    useEffect(() => {
        if (usersData?.roles) {
            setIsAdmin(usersData.roles.includes(UserRoles.ADMIN));
        }
    }, [usersData]);

    return (
        <ContentWrapper>
            <Row gutter={[24, 24]}>

                {/* ✅ SIDEBAR (FIXED WIDTH PROPERLY) */}
                <Col xs={24} sm={24} md={10} lg={8}>
                    <div className="account-sidebar">

                        <div className="profile-header">
                            <div className="avatar">
                                <UserOutlined />
                            </div>

                            <div>
                                <div className="title">My Account</div>
                                <div className="subtitle">Manage your profile</div>
                            </div>
                        </div>

                        <AccountLink link={ACCOUNT_USER_INFO} title="Personal data" />

                        {isAdmin ? (
                            <>
                                <AccountLink link={ACCOUNT_ADMIN_ADD} title="Add perfume" />
                                <AccountLink link={ACCOUNT_ADMIN_PERFUMES} title="List of perfumes" />
                                <AccountLink link={ACCOUNT_ADMIN_ORDERS} title="Orders" />
                                <AccountLink link={ACCOUNT_ADMIN_USERS} title="Users" />
                            </>
                        ) : (
                            <>
                                <AccountLink link={ACCOUNT_USER_EDIT} title="Change password" />
                                <AccountLink link={ACCOUNT_USER_ORDERS} title="My orders" />
                            </>
                        )}
                    </div>
                </Col>

                {/* ✅ CONTENT (NO SQUEEZE) */}
                <Col xs={24} sm={24} md={14} lg={16}>
                    <div className="account-content">

                        <Route exact path={ACCOUNT} component={AccountItem} />
                        <Route path={ACCOUNT_USER_INFO} component={PersonalData} />
                        <Route path={ACCOUNT_USER_EDIT} component={ChangePassword} />
                        <Route exact path={ACCOUNT_USER_ORDERS} component={PersonalOrdersList} />
                        <Route exact path={`${ACCOUNT_USER_ORDERS}/:id`} component={ManageUserOrder} />

                        {isAdmin && (
                            <>
                                <Route path={ACCOUNT_ADMIN_ADD} component={AddPerfume} />
                                <Route exact path={ACCOUNT_ADMIN_PERFUMES} component={PerfumeList} />
                                <Route exact path={`${ACCOUNT_ADMIN_PERFUMES}/:id`} component={EditPerfume} />
                                <Route exact path={ACCOUNT_ADMIN_ORDERS} component={OrdersList} />
                                <Route exact path={ACCOUNT_ADMIN_USERS} component={UsersList} />
                                <Route exact path={`${ACCOUNT_ADMIN_USERS}/:id`} component={ManageUser} />
                            </>
                        )}
                    </div>
                </Col>

            </Row>
        </ContentWrapper>
    );
};

export default Account;