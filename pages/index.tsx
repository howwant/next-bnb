import React from "react";
import styled from "styled-components";
import Header from "../components/Header";
import Home from "../components/home/Home";
import { NextPage } from "next";

const Container = styled.div`
    font-size: 21px;
    color: gray;
`

const index: NextPage = () => {
    return (
        <Container>
            <Header />
            <Home />
        </Container>

    );
};

export default index;