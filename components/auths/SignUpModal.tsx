import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";

import CloseXIcon from "../../public/static/svg/modal/modal_colose_x_icon.svg"
import MailIcon from "../../public/static/svg/input/mail.svg"
import PersonIcon from "../../public/static/svg/input/person.svg"
import OpenedIcon from "../../public/static/svg/input/opened_eye.svg"
import ClosedEyeIcon from "../../public/static/svg/input/closed_eye.svg"

import palette from "../../styles/palette";
import Input from "../common/Input";
import Selector from "../common/Selector";
import Button from "../common/Button";
import { daysList, monthsList, yearsList } from "../../lib/staticData";
import { signupAPI } from "../../lib/api/auth";
import useValidateMode from "../../hooks/useValidateMode";
import PasswordWarning from "./PasswordWarning";
import { authActions } from "../../store/auth";
import { userActions } from "../../store/user";


const Container = styled.form`
    width: 568px;
    padding: 32px;
    background-color: white;
    z-index: 11;
    position: relative;
    .modal-close-x-icon {
        cursor: pointer;
        display: block;
        margin: 0 0 40px auto;
    }

    .input-wrapper {
        position: relative;
        margin-bottom: 16px;
        input {
            position: relative;
            width: 100%;
            height: 46px;
            padding: 0 44px 0 11px;
            border: 1px solid ${palette.gray_eb};
            border-radius: 4px;
            font-size: 16px;
            outline: none;
            ::placeholder {
                color: ${palette.gray_76};
            }
        }
        svg {
            position: absolute;
            right: 11px;
            top: 16px;
        }
    }
    .sign-up-password-input-wrapper svg {
        cursor: pointer;
    }
    .sign-up-birthday-label {
        font-size: 16px;
        font-weight: 600;
        margin-top: 16px;
        margin-bottom: 8px;
    }
    .sign-up-birthday-info {
        margin-bottom: 16px;
        color: ${palette.charcoal};
    }
    .sign-up-modal-birthday-selectors {
        display: flex;
        margin-bottom: 24px;
    .sign-up-modal-birthday-month-selector {
        margin-right: 16px;
        flex-grow: 1;
    }
    .sign-up-modal-birthday-day-selector {
        margin-right: 16px;
        width: 25%;
    }
    .sign-up-modal-birthday-year-selector {
       width: 33.3333%;
    }
  }
  .sign-up-modal-submit-button-wrapper {
    margin-bottom: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid ${palette.gray_eb};
    }
  .sign-up-modal-set-login {
    color: ${palette.dark_cyan};
    margin-left: 8px;
    cursor: pointer;
  }
`;

// ???????????? ?????? ?????????
const PASSWORD_MIN_LENGTH = 8;

// ?????? ??? ??? ?????? ??? option
const disabledMonths = ["???"];

// ?????? ??? ??? ?????? ??? option
const disabledDays = ["???"];

// ?????? ??? ??? ?????? ??? option
const disabledYears = ["???"];

interface IProps {
    closeModal: () => void;
}

const SignUpModal: React.FC<IProps> = ({ closeModal }) => {
    const [email, setEmail] = useState("");
    const [lastname, setLastname] = useState("");
    const [firstname, setFirstname] = useState("");
    const [password, setPassword] = useState("");
    const [hidePassword, setHidePassword] = useState(true);
    const [birthYear, setBirthYear] = useState<string | undefined>();
    const [birthDay, setBirthDay] = useState<string | undefined>();
    const [birthMonth, setBirthMonth] = useState<string | undefined>();

    const [passwordFocused, setPasswordFocused] = useState(false);

    const dispatch = useDispatch();
    const { setValiedateMode } = useValidateMode();

    //* ????????? ?????? ?????????
    const onChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };
    
    //* ?????? ?????????
    const onChangeLastname = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLastname(event.target.value);
    };
    
    //* ??? ?????????
    const onChangeFirstname = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFirstname(event.target.value);
    };
    
    //* ???????????? ?????????
    const onChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    //* ???????????? ????????? ??????
    const toggleHidePassword = () => {
        setHidePassword(!hidePassword);
    };

    //* ???????????? ??? ?????? ???
    const onChangeBirthMonth = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setBirthMonth(event.target.value);
    }
    //* ???????????? ??? ?????? ???
    const onChangeBirthDay = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setBirthDay(event.target.value);
    }
    //* ???????????? ??? ?????? ???
    const onChangeBirthYear = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setBirthYear(event.target.value);
    }
    //* ???????????? ????????? ????????? ????????? ???
    const onFocusPassword = () =>{
        setPasswordFocused(true);
    };

    //* password??? ???????????? ???????????? ???????????????
    const isPasswordHasNameOrEmail = useMemo(
        () =>
        !password ||
        !lastname ||
        password.includes(lastname) ||
        password.includes(email.split("@")[0]),
        [password, lastname, email]
    );
    
    // ??????????????? ?????? ????????? ????????????
    const isPasswordOverMinLength = useMemo(
        () => !!password && password.length >= PASSWORD_MIN_LENGTH,
        [password]
    );

    // ??????????????? ????????? ??????????????? ???????????????
    const isPasswordHasNumberOrSymbol = useMemo(
        () =>
        !(
            /[{}[\]/?.,;:|)*~`!^\-_+<>@#$%&\\=('"]/g.test(password) ||
            /[0-9]/g.test(password)
        ),
        [password]
    );
    //* ???????????? ??? ?????? ??? ????????????
    const validateSignUpForm = () => {
        //* ?????? ?????? ?????????
        if (!email || !lastname || !firstname || !password) {
            return false;
        }
        //* ??????????????? ???????????? ?????????
        if (
            isPasswordHasNameOrEmail ||
            !isPasswordOverMinLength ||
            isPasswordHasNumberOrSymbol
        ) {
            return false;
        };
        //* ???????????? ????????? ?????? ?????????
        if (!birthDay || !birthMonth || !birthYear) {
            return false
        }
        return true;
    };
 
    //* ???????????? ??? ????????????
    const onSubmitSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setValiedateMode(true);
        console.log(validateSignUpForm());

        if (validateSignUpForm()) {
            try {
                const signUpBody = {
                    email,
                    lastname,
                    firstname,
                    password,
                    birthday: new Date(
                        `${birthYear}-${birthMonth!.replace("???", "")}-${birthDay}`
                      ).toISOString(),
                };
                const { data } = await signupAPI(signUpBody);
                dispatch(userActions.setLoggedUser(data));

                closeModal();
            } catch (e) {
                console.log(e);
            }
        }
    };
    
    //* ??????????????? ?????????
    useEffect(()=> {
        return () =>{
            setValiedateMode(false);
        };
    },[]);

    //* ????????? ????????? ????????????
    const changeToLoginModal = () => {
        dispatch(authActions.setAuthMode("login"));
    };

    return (
        <Container onSubmit={onSubmitSignUp}>
            <CloseXIcon className="modal-close-x-icon" onClick={closeModal}/>
            <div className="input-wrapper">
                <Input 
                type="email" 
                placeholder="????????? ??????" 
                icon={<MailIcon/>} 
                name="email"
                value={email}
                onChange={onChangeEmail}
                />
            </div>
            <div className="input-wrapper">
                <Input 
                placeholder="?????? (???: ??????)" 
                icon={<PersonIcon/>} 
                value={lastname}
                onChange={onChangeLastname}
                />
            </div>
            <div className="input-wrapper">
                <Input 
                placeholder="??? (???: ???)" 
                icon={<PersonIcon/>} 
                value={firstname}
                onChange={onChangeFirstname}
                />
            </div>
            <div className="input-wrapper sign-up-password-input-wrapper">
                <Input 
                type={hidePassword ? "password" : "text"}
                placeholder="???????????? ????????????" 
                icon={
                hidePassword ? (
                    <ClosedEyeIcon onClick={toggleHidePassword}/>
                ):(
                    <OpenedIcon onClick={toggleHidePassword}/>
                )} 
                value={password}
                onChange={onChangePassword}
                onFocus={onFocusPassword}
                useValidation
                isValid={
                  !isPasswordHasNameOrEmail &&
                  isPasswordOverMinLength &&
                  !isPasswordHasNumberOrSymbol
                }
                errorMessage="??????????????? ???????????????"
                />
            </div>
            {passwordFocused && (
                <>
                <PasswordWarning
                    isValid={isPasswordHasNameOrEmail}
                    text="??????????????? ?????? ???????????? ????????? ????????? ????????? ??? ????????????."
                />
                <PasswordWarning isValid={!isPasswordOverMinLength} text="?????? 8???" />
                <PasswordWarning
                    isValid={isPasswordHasNumberOrSymbol}
                    text="????????? ????????? ???????????????."
                />
                </>
            )}
            <h4 className="sign-up-birthday-label">??????</h4>
            <p className="sign-up-birthday-info">??? 18??? ????????? ????????? ???????????? ????????? ??? ????????????. ????????? ?????? ??????????????? ??????????????? ???????????? ????????????.</p>
            <div className="sign-up-modal-birthday-selectors">
                <div className="sign-up-modal-birthday-month-selector">
                    <Selector
                        options={monthsList} 
                        disabledOptions={disabledMonths}
                        defaultValue="???"
                        value={birthMonth}
                        onChange={onChangeBirthMonth}
                        isValid={!!birthMonth}
                        />
                </div>
                <div className="sign-up-modal-birthday-day-selector">
                    <Selector
                        options={daysList} 
                        disabledOptions={disabledDays}
                        defaultValue="???"
                        value={birthDay}
                        onChange={onChangeBirthDay}
                        isValid={!!birthDay}
                        />
                </div>
                <div className="sign-up-modal-birthday-year-selector">
                    <Selector
                        options={yearsList} 
                        disabledOptions={disabledYears}
                        defaultValue="???"
                        onChange={onChangeBirthYear}
                        isValid={!!birthYear}
                        value={birthYear}
                        />
                </div>
            </div>
            <div className="sign-up-modal-submit-button-wrapper">
                <Button type="submit" color="bittersweet">
                    ????????????
                </Button>
            </div>
            <p>?????? ??????????????? ????????? ??????????
            <span className="sign-up-modal-set-login"
                role="presentation"
                onClick={changeToLoginModal}
            >
                ?????????
            </span>
            </p>

        </Container>
    );
};

export default SignUpModal;
