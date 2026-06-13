import React, { FC, ReactElement, ReactNode } from "react";
import { Typography } from "antd";

import "./ContentTitle.css";

type PropsType = {
    icon?: ReactNode;
    title: string;
    titleLevel?: 1 | 2 | 3 | 4 | 5;
};

const ContentTitle: FC<PropsType> = ({ icon, title, titleLevel }): ReactElement => {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                width: "100%"
            }}
        >
            {icon}

            <Typography.Title
                level={titleLevel}
                style={{
                    margin: 0,
                    fontSize: "18px",
                    lineHeight: "1.2",
                    wordBreak: "keep-all"   // ✅ prevents vertical breaking
                }}
            >
                {title}
            </Typography.Title>
        </div>
    );
};

export default ContentTitle;