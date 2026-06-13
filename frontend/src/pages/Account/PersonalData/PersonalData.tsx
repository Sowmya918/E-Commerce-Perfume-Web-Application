import React, { FC, ReactElement, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Col, Form, Row } from "antd";
import { CheckOutlined, EditOutlined, EyeInvisibleOutlined, ProfileOutlined } from "@ant-design/icons";

import { selectUserEditErrors, selectUserFromUserState } from "../../../redux-toolkit/user/user-selector";
import ContentTitle from "../../../components/ContentTitle/ContentTitle";
import AccountDataItem from "../../../components/AccountDataItem/AccountDataItem";
import FormInput from "../../../components/FormInput/FormInput";
import IconButton from "../../../components/IconButton/IconButton";
import { updateUserInfo } from "../../../redux-toolkit/user/user-thunks";
import { resetInputForm } from "../../../redux-toolkit/user/user-slice";

interface PersonalDataType {
    firstName: string;
    lastName: string;
    city: string;
    address: string;
    phoneNumber: string;
    postIndex: string;
}

const PersonalData: FC = (): ReactElement => {
    const dispatch = useDispatch<any>();
    const [form] = Form.useForm();

    const usersData = useSelector(selectUserFromUserState);
    const errors = useSelector(selectUserEditErrors);

    const [showUserData, setShowUserData] = useState(false);
    const { firstNameError, lastNameError } = errors;

    useEffect(() => {
        dispatch(resetInputForm());

        if (usersData) {
            form.setFieldsValue(usersData);
        }
    }, [dispatch, usersData, form]);

    const onFormSubmit = (data: PersonalDataType): void => {
        dispatch(updateUserInfo({ id: usersData?.id, ...data }));
    };

    const onClickShowUserData = (): void => {
        setShowUserData((prev) => !prev);
    };

    return (
        <>
            <ContentTitle title={"My Account"} titleLevel={4} icon={<ProfileOutlined />} />

            <Row gutter={[32, 24]}>
                {/* LEFT SIDE */}
                <Col xs={24} md={14}>
                    <div style={{ maxWidth: 500 }}>
                        <AccountDataItem title="Email" text={usersData?.email || "-"} />
                        <AccountDataItem title="First name" text={usersData?.firstName || "-"} />
                        <AccountDataItem title="Last name" text={usersData?.lastName || "-"} />
                        <AccountDataItem title="City" text={usersData?.city || "-"} />
                        <AccountDataItem title="Address" text={usersData?.address || "-"} />
                        <AccountDataItem title="Phone number" text={usersData?.phoneNumber || "-"} />
                        <AccountDataItem title="Post index" text={usersData?.postIndex || "-"} />

                        <Button
                            type="primary"
                            onClick={onClickShowUserData}
                            icon={showUserData ? <EyeInvisibleOutlined /> : <EditOutlined />}
                            style={{ marginTop: 20 }}
                        >
                            {showUserData ? "Hide" : "Edit"}
                        </Button>
                    </div>
                </Col>

                {/* RIGHT SIDE */}
                <Col xs={24} md={10}>
                    {showUserData && (
                        <Form form={form} onFinish={onFormSubmit}>
                            <FormInput
                                title="First name:"
                                titleSpan={8}
                                wrapperSpan={16}
                                name="firstName"
                                error={firstNameError}
                                placeholder="First name"
                            />
                            <FormInput
                                title="Last name:"
                                titleSpan={8}
                                wrapperSpan={16}
                                name="lastName"
                                error={lastNameError}
                                placeholder="Last name"
                            />
                            <FormInput title="City:" titleSpan={8} wrapperSpan={16} name="city" placeholder="City" />
                            <FormInput
                                title="Address:"
                                titleSpan={8}
                                wrapperSpan={16}
                                name="address"
                                placeholder="Address"
                            />
                            <FormInput
                                title="Phone number:"
                                titleSpan={8}
                                wrapperSpan={16}
                                name="phoneNumber"
                                placeholder="Phone number"
                            />
                            <FormInput
                                title="Post index:"
                                titleSpan={8}
                                wrapperSpan={16}
                                name="postIndex"
                                placeholder="Post index"
                            />

                            <IconButton title="Save" icon={<CheckOutlined />} />
                        </Form>
                    )}
                </Col>
            </Row>
        </>
    );
};

export default PersonalData;
