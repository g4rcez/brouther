/*
    Render the page that match with your route
    @returns string
 */
import React, { Fragment } from "react";
import { usePage } from "../hooks/use-page";

export const Outlet = (props: { notFound?: React.ReactElement }) => {
    const page = usePage();
    return props.notFound ? <Fragment>{page ? page : props.notFound}</Fragment> : <Fragment>{page}</Fragment>;
};
