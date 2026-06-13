import React, { FC, ReactElement } from "react";
import { Card, Typography } from "antd";
import { useSelector } from "react-redux";
import { selectUserFromUserState } from "../../../redux-toolkit/user/user-selector";

const AccountItem: FC = (): ReactElement => {
    const user = useSelector(selectUserFromUserState);

    return (
        <div style={{ display: "flex", justifyContent: "center", marginTop: 40 }}>
            <Card
                style={{
                    width: "100%",
                    maxWidth: 600,
                    textAlign: "center",
                    borderRadius: 16
                }}
            >
                <Typography.Title level={2} style={{ marginBottom: 10 }}>
                    Hello {user?.firstName} {user?.lastName}! 👋
                </Typography.Title>

                <Typography.Text type="secondary">Welcome to your account dashboard</Typography.Text>
            </Card>
        </div>
    );
};

export default AccountItem;
