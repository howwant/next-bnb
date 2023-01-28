import React from "react";
import { useDispatch } from "react-redux";
import useModal from "../hooks/useModal";
import { authActions } from "../store/auth";
import AuthModal from "./auths/AuthModal";


const HeaderAuths: React.FC = () => {
        //* 모달을 열고 닫을 boolean 값
        const { openModal, ModalPortal, closeModal } = useModal();
        const dispatch = useDispatch();

    return (
        <>
          <div className="header-auth-buttons">
                <button 
                type="button" 
                className="header-sign-up-button"
                onClick={() => {
                    dispatch(authActions.setAuthMode("signup"));
                    openModal();
                }}
                >
                    회원가입
                </button>
                <button 
                type="button" 
                className="header-login-button"
                onClick={() => {
                    dispatch(authActions.setAuthMode("login"));
                    openModal();
                }}
                >
                    로그인
                </button>
            </div>
            <ModalPortal>
                <AuthModal closeModal={closeModal} />
            </ModalPortal>
        </>
    )
}

export default HeaderAuths;