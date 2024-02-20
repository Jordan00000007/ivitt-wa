import classNames from 'classnames';
import { ReactNode, CSSProperties, HTMLAttributes } from 'react';
import styled from 'styled-components';
import { ReactComponent as Icon_More } from '../../assets/Icon_More.svg';

const StyledButton = styled.div`
  display: inline-flex;
  justify-content: center;
  align-items: bottom;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #ffffff;
  border: 1px solid #E0E1E6;
  opacity: 0.7;

  &:hover {
    background-color: ${props => props.theme.color.divider};
  }
  &:active {
    background-color: ${props => props.theme.color.divider};
  }

  &.hide {
    visibility: hidden;
    display: none;
    pointer-events: none;
  }
`;


type MoreButtonProps = {
    children?: ReactNode;
    style?: CSSProperties;
    className?: string;
    disabled?: boolean;
    hide?: boolean;
} & HTMLAttributes<HTMLDivElement>;

const MoreButtonGlobal = (props: MoreButtonProps) => {
    const { children, hide = false, className, ...restProps } = props;
    const newClassName = hide ? 'hide' : '';
    return (

        // <StyledButton className={classNames(newClassName, className)} {...restProps}>
        //   •••
        // </StyledButton>
       

        <StyledButton className={classNames(newClassName, className)}  {...restProps}>
            <Icon_More ></Icon_More>
        </StyledButton>
       



    );
};

export default MoreButtonGlobal;
