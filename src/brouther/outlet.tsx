/*
    Render the page that match with your route
    @returns string
 */
import React, { Fragment } from "react";
import { usePage } from "../hooks/use-page";
import { useBrouther } from "../hooks/use-brouther";

export const Outlet = (props: { notFound?: React.ReactElement }) => {
    const brouther = useBrouther();
    const page = usePage();
    if (brouther.loading) return <Fragment>{brouther.page?.loadingElement}</Fragment>;
    return props.notFound ? <Fragment>{page ? page : props.notFound}</Fragment> : <Fragment>{page}</Fragment>;
};
