import React, { FC, ReactElement, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Col, Form, notification, Row, Upload } from "antd";
import { PlusSquareFilled, PlusSquareOutlined, UploadOutlined } from "@ant-design/icons";
import { UploadChangeParam } from "antd/lib/upload/interface";

import {
    selectAdminStateErrors,
    selectIsAdminStateLoading,
    selectIsPerfumeAdded
} from "../../../redux-toolkit/admin/admin-selector";

import {
    resetAdminState,
    setAdminLoadingState
} from "../../../redux-toolkit/admin/admin-slice";

import { LoadingStatus } from "../../../types/types";
import { addPerfume } from "../../../redux-toolkit/admin/admin-thunks";

import ContentTitle from "../../../components/ContentTitle/ContentTitle";
import AddFormInput from "./AddFormInput";
import AddFormSelect from "./AddFormSelect";
import IconButton from "../../../components/IconButton/IconButton";

type AddPerfumeData = {
    perfumeTitle: string;
    perfumer: string;
    year: string;
    country: string;
    type: string;
    volume: string;
    perfumeGender: string;
    fragranceTopNotes: string;
    fragranceMiddleNotes: string;
    fragranceBaseNotes: string;
    price: string;
};

const AddPerfume: FC = (): ReactElement => {
    const dispatch = useDispatch();

    const isPerfumeAdded = useSelector(selectIsPerfumeAdded);
    const ispPerfumeLoading = useSelector(selectIsAdminStateLoading);
    const perfumeErrors = useSelector(selectAdminStateErrors);

    const [file, setFile] = React.useState<any>(null);

    useEffect(() => {
        dispatch(setAdminLoadingState(LoadingStatus.LOADED));

        return () => {
            dispatch(resetAdminState(LoadingStatus.LOADING));
        };
    }, [dispatch]);

    useEffect(() => {
        if (isPerfumeAdded) {
            window.scrollTo(0, 0);

            notification.success({
                message: "Perfume added",
                description: "Perfume successfully added!"
            });

            dispatch(resetAdminState(LoadingStatus.SUCCESS));
        }
    }, [isPerfumeAdded, dispatch]);

    const handleUpload = (info: UploadChangeParam<any>): void => {
        if (info.fileList.length > 0) {
            setFile(info.fileList[0].originFileObj);
        }
    };

    const onFormSubmit = (data: AddPerfumeData): void => {
        console.log("FORM DATA =", data);
        console.log("FILE =", file);

        const formData = new FormData();

        if (file) {
            formData.append("file", file);
        }

        const perfumeBlob = new Blob(
            [
                JSON.stringify({
                    perfumeTitle: data.perfumeTitle,
                    perfumer: data.perfumer,
                    year: Number(data.year),
                    country: data.country,
                    type: data.type,
                    volume: data.volume,
                    perfumeGender: data.perfumeGender,
                    fragranceTopNotes: data.fragranceTopNotes,
                    fragranceMiddleNotes: data.fragranceMiddleNotes,
                    fragranceBaseNotes: data.fragranceBaseNotes,
                    price: Number(data.price),

                })
            ],
            {
                type: "application/json"
            }
        );

        formData.append("perfume", perfumeBlob);

        dispatch(addPerfume(formData as any));
    };

    return (
        <>
            <ContentTitle
                title={"Add perfume"}
                titleLevel={4}
                icon={<PlusSquareOutlined />}
            />

            <Form onFinish={onFormSubmit}>
                <Row gutter={32}>
                    <Col span={12}>
                        <AddFormInput
                            title={"Perfume title"}
                            name={"perfumeTitle"}
                            error={perfumeErrors.perfumeTitleError}
                            placeholder={"Enter perfume title"}
                            disabled={ispPerfumeLoading}
                        />

                        <AddFormInput
                            title={"Release year"}
                            name={"year"}
                            error={perfumeErrors.yearError}
                            placeholder={"Enter release year"}
                            disabled={ispPerfumeLoading}
                        />

                        <AddFormSelect
                            title={"Perfume type"}
                            name={"type"}
                            error={perfumeErrors.typeError}
                            placeholder={"Select perfume type"}
                            disabled={ispPerfumeLoading}
                            values={["Eau de Parfum", "Eau de Toilette"]}
                        />

                        <AddFormSelect
                            title={"Gender"}
                            name={"perfumeGender"}
                            error={perfumeErrors.perfumeGenderError}
                            placeholder={"Select gender"}
                            disabled={ispPerfumeLoading}
                            values={["male", "female"]}
                        />

                        <AddFormInput
                            title={"Heart notes"}
                            name={"fragranceMiddleNotes"}
                            error={perfumeErrors.fragranceMiddleNotesError}
                            placeholder={"Enter heart notes"}
                            disabled={ispPerfumeLoading}
                        />

                        <AddFormInput
                            title={"Price"}
                            name={"price"}
                            error={perfumeErrors.priceError}
                            placeholder={"Enter price"}
                            disabled={ispPerfumeLoading}
                        />
                    </Col>

                    <Col span={12}>
                        <AddFormInput
                            title={"Brand"}
                            name={"perfumer"}
                            error={perfumeErrors.perfumerError}
                            placeholder={"Enter brand"}
                            disabled={ispPerfumeLoading}
                        />

                        <AddFormInput
                            title={"Manufacturer country"}
                            name={"country"}
                            error={perfumeErrors.countryError}
                            placeholder={"Enter country"}
                            disabled={ispPerfumeLoading}
                        />

                        <AddFormInput
                            title={"Volume"}
                            name={"volume"}
                            error={perfumeErrors.volumeError}
                            placeholder={"Enter volume"}
                            disabled={ispPerfumeLoading}
                        />

                        <AddFormInput
                            title={"Top notes"}
                            name={"fragranceTopNotes"}
                            error={perfumeErrors.fragranceTopNotesError}
                            placeholder={"Enter top notes"}
                            disabled={ispPerfumeLoading}
                        />

                        <AddFormInput
                            title={"Base notes"}
                            name={"fragranceBaseNotes"}
                            error={perfumeErrors.fragranceBaseNotesError}
                            placeholder={"Enter base notes"}
                            disabled={ispPerfumeLoading}
                        />

                        <Upload
                            beforeUpload={() => false}
                            onChange={handleUpload}
                            maxCount={1}
                        >
                            <Button
                                icon={<UploadOutlined />}
                                style={{ marginTop: 22 }}
                            >
                                Upload Image
                            </Button>
                        </Upload>
                    </Col>
                </Row>

                <IconButton
                    title={"Add"}
                    icon={<PlusSquareFilled />}
                />
            </Form>
        </>
    );
};

export default AddPerfume;