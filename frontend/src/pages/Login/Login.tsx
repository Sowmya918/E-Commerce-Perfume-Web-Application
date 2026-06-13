import React, { FC, ReactElement, useEffect } from "react";
import { Form, Alert } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams, Link } from "react-router-dom";
import { LockOutlined, LoginOutlined, MailOutlined } from "@ant-design/icons";

import { selectErrorMessage } from "../../redux-toolkit/auth/auth-selector";
import { selectSuccessMessage } from "../../redux-toolkit/user/user-selector";
import { activateAccount, login } from "../../redux-toolkit/auth/auth-thunks";
import { resetAuthState } from "../../redux-toolkit/auth/auth-slice";
import { FORGOT } from "../../constants/routeConstants";

import FormInput from "../../components/FormInput/FormInput";
import IconButton from "../../components/IconButton/IconButton";

import "../Registration/Auth.css"; // ✅ reuse same premium CSS

const Login: FC = (): ReactElement => {
    const dispatch = useDispatch<any>();
    const history = useHistory();
    const params = useParams<{ code: string }>();

    const errorMessage = useSelector(selectErrorMessage);
    const successMessage = useSelector(selectSuccessMessage);

    useEffect(() => {
        if (params.code) {
            dispatch(activateAccount(params.code));
        }

        return () => {
            dispatch(resetAuthState());
        };
    }, [dispatch, params.code]);

    const onSubmit = (userData: { email: string; password: string }): void => {
        dispatch(login({ userData, history }));
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2 className="auth-title">Welcome Back</h2>

                {errorMessage && <Alert type="error" message={errorMessage} />}
                {successMessage && <Alert type="success" message={successMessage} />}

                <Form layout="vertical" onFinish={onSubmit}>
                    <FormInput
                        title="Email"
                        titleSpan={24}
                        wrapperSpan={24}
                        icon={<MailOutlined />}
                        name="email"
                        placeholder="Enter your email"
                    />

                    <FormInput
                        title="Password"
                        titleSpan={24}
                        wrapperSpan={24}
                        icon={<LockOutlined />}
                        name="password"
                        placeholder="Password"
                        inputPassword
                    />

                    <div style={{ marginBottom: 10 }}>
                        <Link to={FORGOT}>Forgot password?</Link>
                    </div>

                    <IconButton title="Sign In" icon={<LoginOutlined />} />

                    <div style={{ marginTop: 15, textAlign: "center" }}>
                        Don’t have an account? <Link to="/registration">Sign up</Link>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default Login;