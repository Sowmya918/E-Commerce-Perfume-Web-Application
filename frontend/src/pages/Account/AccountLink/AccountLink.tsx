import React, { FC, ReactElement } from "react";
import { NavLink } from "react-router-dom";
import { RightOutlined } from "@ant-design/icons";
import "./AccountLink.scss";

type PropsType = {
    link: string;
    title: string;
    icon?: ReactElement;
};

const AccountLink: FC<PropsType> = ({ link, title, icon }): ReactElement => {
    return (
        <NavLink to={link} className="account-sidebar-link" activeClassName="is-active">
            <div className="link-content">
                <span className="icon">{icon}</span>
                <span className="title">{title}</span>
            </div>

            <RightOutlined className="arrow" />
        </NavLink>
    );
};

export default AccountLink;
