import React, { FC, ReactElement, useEffect } from "react";
import { Form } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { LockOutlined, MailOutlined, UserAddOutlined, UserOutlined } from "@ant-design/icons";

import { selectErrors, selectIsAuthLoading, selectIsRegistered } from "../../redux-toolkit/auth/auth-selector"; // ✅ FIXED
import { registration } from "../../redux-toolkit/auth/auth-thunks";
import FormInput from "../../components/FormInput/FormInput";
import IconButton from "../../components/IconButton/IconButton";
import { resetAuthState, setAuthLoadingState } from "../../redux-toolkit/auth/auth-slice";
import { LoadingStatus, UserRegistration } from "../../types/types";

import "./Auth.css";

const Registration: FC = (): ReactElement => {
    const dispatch = useDispatch();
    const history = useHistory();

    const isRegistered = useSelector(selectIsRegistered);
    const isLoading = useSelector(selectIsAuthLoading);
    const errors = useSelector(selectErrors);

    useEffect(() => {
        dispatch(setAuthLoadingState(LoadingStatus.LOADED));
        return () => {
            dispatch(resetAuthState());
        };
    }, [dispatch]);

    useEffect(() => {
        if (isRegistered) {
            history.push("/login");
        }
    }, [isRegistered, history]);

    const onSubmit = (userData: UserRegistration): void => {
        dispatch(registration({ ...userData, captcha: "test" }));
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2 className="auth-title">Create Account</h2>

                <Form layout="vertical" onFinish={onSubmit}>
                    <FormInput
                        title="Email"
                        titleSpan={24}
                        wrapperSpan={24}
                        icon={<MailOutlined />}
                        name="email"
                        error={errors.emailError}
                        placeholder="Enter your email"
                    />

                    <FormInput
                        title="First Name"
                        titleSpan={24}
                        wrapperSpan={24}
                        icon={<UserOutlined />}
                        name="firstName"
                        error={errors.firstNameError}
                        placeholder="First name"
                    />

                    <FormInput
                        title="Last Name"
                        titleSpan={24}
                        wrapperSpan={24}
                        icon={<UserOutlined />}
                        name="lastName"
                        error={errors.lastNameError}
                        placeholder="Last name"
                    />

                    <FormInput
                        title="Password"
                        titleSpan={24}
                        wrapperSpan={24}
                        icon={<LockOutlined />}
                        name="password"
                        error={errors.passwordError}
                        placeholder="Password"
                        inputPassword
                    />

                    <FormInput
                        title="Confirm Password"
                        titleSpan={24}
                        wrapperSpan={24}
                        icon={<LockOutlined />}
                        name="password2"
                        error={errors.password2Error}
                        placeholder="Confirm password"
                        inputPassword
                    />

                    <IconButton disabled={isLoading} title="Sign Up" icon={<UserAddOutlined />} />
                </Form>
            </div>
        </div>
    );
};

export default Registration;
