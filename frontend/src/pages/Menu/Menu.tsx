import React, { FC, ReactElement, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Col, Layout, Pagination, RadioChangeEvent, Row, Typography } from "antd";
import { CheckboxValueType } from "antd/lib/checkbox/Group";
import { useLocation } from "react-router-dom";

import MenuCheckboxSection from "./MenuSection/MenuCheckboxSection";
import { selectIsPerfumesLoading, selectPerfumes } from "../../redux-toolkit/perfumes/perfumes-selector";
import { FilterParamsType } from "../../types/types";
import { fetchPerfumesByFilterParams, fetchPerfumesByInputText } from "../../redux-toolkit/perfumes/perfumes-thunks";
import { resetPerfumesState } from "../../redux-toolkit/perfumes/perfumes-slice";
import MenuRadioSection from "./MenuSection/MenuRadioSection";
import MenuSorter from "./MenuSorter/MenuSorter";
import PerfumeCard from "../../components/PerfumeCard/PerfumeCard";
import SelectSearchData from "../../components/SelectSearchData/SelectSearchData";
import InputSearch from "../../components/InputSearch/InputSearch";
import Spinner from "../../components/Spinner/Spinner";
import { MAX_PAGE_VALUE, usePagination } from "../../hooks/usePagination";
import { gender, perfumer, price } from "./MenuData";
import { useSearch } from "../../hooks/useSearch";
import "./Menu.css";

export enum CheckboxCategoryFilter {
    PERFUMERS = "PERFUMERS",
    GENDERS = "GENDERS"
}

const Menu: FC = (): ReactElement => {
    const dispatch = useDispatch();
    const perfumes = useSelector(selectPerfumes);
    const isPerfumesLoading = useSelector(selectIsPerfumesLoading);
    const location = useLocation<{ id: string }>();

    const [filterParams, setFilterParams] = useState<FilterParamsType>({
        perfumers: [],
        genders: [],
        prices: [1, 999]
    });

    const [sortByPrice, setSortByPrice] = useState<boolean>(false);
    const { currentPage, totalElements, handleChangePagination, resetPagination } = usePagination();
    const { searchValue, searchTypeValue, resetFields, form, onSearch, handleChangeSelect } = useSearch();

    useEffect(() => {
        dispatch(fetchPerfumesByFilterParams({ ...filterParams, sortByPrice, currentPage: 0 }));
        return () => {
            dispatch(resetPerfumesState());
        };
    }, []);

    const onChangeCheckbox = (checkedValues: CheckboxValueType[], category: CheckboxCategoryFilter): void => {
        const filter =
            category === CheckboxCategoryFilter.PERFUMERS
                ? { ...filterParams, perfumers: checkedValues as string[] }
                : { ...filterParams, genders: checkedValues as string[] };

        setFilterParams(filter);
        dispatch(fetchPerfumesByFilterParams({ ...filter, sortByPrice, currentPage: 0 }));
    };

    const onChangeRadio = (event: RadioChangeEvent): void => {
        const filter = { ...filterParams, prices: event.target.value };
        setFilterParams(filter);
        dispatch(fetchPerfumesByFilterParams({ ...filter, sortByPrice, currentPage: 0 }));
    };

    const handleChangeSortPrice = (event: RadioChangeEvent): void => {
        setSortByPrice(event.target.value);
        dispatch(fetchPerfumesByFilterParams({ ...filterParams, sortByPrice: event.target.value, currentPage: 0 }));
    };

    const changePagination = (page: number, pageSize: number): void => {
        dispatch(fetchPerfumesByFilterParams({ ...filterParams, sortByPrice, currentPage: page - 1 }));
        handleChangePagination(page, pageSize);
    };

    return (
        <Layout>
            <Layout.Content className="menu-container">
                {/* HEADER */}
                <div className="menu-header">
                    <Typography.Title level={1} className="menu-title">
                        Discover Your Signature Scent
                    </Typography.Title>
                    <Typography.Text className="menu-subtitle">
                        Explore premium fragrances curated for every personality.
                    </Typography.Text>
                </div>

                <Row gutter={40}>
                    {/* SIDEBAR */}
                    <Col span={6}>
                        <div className="filter-panel">
                            <MenuCheckboxSection
                                title="Brand"
                                onChange={onChangeCheckbox}
                                data={perfumer}
                                category={CheckboxCategoryFilter.PERFUMERS}
                                selectedValues={filterParams.perfumers}
                            />
                            <MenuCheckboxSection
                                title="Gender"
                                onChange={onChangeCheckbox}
                                data={gender}
                                category={CheckboxCategoryFilter.GENDERS}
                                selectedValues={filterParams.genders}
                            />
                            <MenuRadioSection title="Price" onChange={onChangeRadio} data={price} />
                        </div>
                    </Col>

                    {/* CONTENT */}
                    <Col span={18}>
                        {/* TOP BAR */}
                        <Row className="top-bar">
                            <Col span={10}>
                                <SelectSearchData handleChangeSelect={handleChangeSelect} />
                            </Col>
                            <Col span={10}>
                                <InputSearch onSearch={onSearch} form={form} />
                            </Col>
                            <Col span={4} style={{ textAlign: "right" }}>
                                <MenuSorter onChange={handleChangeSortPrice} sortByPrice={sortByPrice} />
                            </Col>
                        </Row>

                        {/* PRODUCTS */}
                        <Row gutter={[40, 40]}>
                            {isPerfumesLoading ? (
                                <Spinner />
                            ) : (
                                perfumes.map((perfume) => (
                                    <PerfumeCard key={perfume.id} perfume={perfume} colSpan={8} />
                                ))
                            )}
                        </Row>

                        {/* PAGINATION */}
                        <Row style={{ marginTop: 30 }}>
                            <Pagination
                                current={currentPage}
                                pageSize={MAX_PAGE_VALUE}
                                total={totalElements}
                                showSizeChanger={false}
                                onChange={changePagination}
                            />
                        </Row>
                    </Col>
                </Row>
            </Layout.Content>
        </Layout>
    );
};

export default Menu;
