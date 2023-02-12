import React from "react";
import styled, { css } from "styled-components";
import palette from "../../styles/palette";

//* 버튼 색상 구하기
const getButtonColor = (color: string, colorReverse: boolean) => {
    if (colorReverse) {
        switch (color) {
            case "dark_cyan":
                return css`
                    border: 2px solid ${palette.dark_cyan};
                    color: ${palette.dark_cyan};
                    background-color: white;
                `;
            default:
                return css`
                    border:2px solid ${palette.black};
                    color: ${palette.black};
                    background-color: white;
                `;
        }
    }
    switch (color) {
        case "dark_cyan":
            return css`
                background-color: ${palette.dark_cyan};
                color: white;
            `;
        case "bittersweet":
            return css`
                background-color: ${palette.bittersweet};
                color: white;
            `;
        case "gray_c4":
            return css`
                border: 1px solid ${palette.gray_c4};
                background-color: white;
                color: ${palette.gray_48};
            `;
        case "amaranth":
            return css`
                background-color: ${palette.amaranth};
                color: white;  
            `;
        default:
            return css`
                background-color: white;
                color: ${palette.black};
                border: 1px solid ${palette.gray_c4};
            `;
    }
};

// 버튼 크기 구하기
const getButtonSize = (size: "small" | "medium") => {
    switch (size) {
      case "medium":
        return css`
          height: 48px;
        `;
      case "small":
        return css`
          font-size: 14px;
          height: 36px;
        `;
      default:
        return "";
    }
  };

interface StyledButtonProps {
    width: string | undefined;
    colorReverse: boolean;
    size: "small" | "medium";
}

const Container = styled.button<StyledButtonProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 48px;
  border: 0;
  border-radius: 4px;
  font-size: 18px;
  font-weight: 700;
  outline: none;
  cursor: pointer;
  width: ${(props) => props.width};
  ${(props) => getButtonColor(props.color || "", props.colorReverse)};
  svg {
    margin-right: 12px;
  }
  ${(props) =>getButtonSize(props.size)}
`;

interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    color?: "dark_cyan" | "white" | "bittersweet"| "gray_c4" |"amaranth";
    width?: string;
    colorReverse?: boolean;
    icon?: JSX.Element;
    size?: "small" | "medium";
}

const Button: React.FC<IProps> = ({ 
    children,
    color,
    width,
    colorReverse = false,
    icon,
    size ="medium",
    ...props
     }) => {
    return (
        <Container 
        {...props} 
        color={color}
        width={width}
        colorReverse={colorReverse}      
        size={size} 
        >
            {icon}
            {children}
        </Container>
    );
};

export default React.memo(Button);
