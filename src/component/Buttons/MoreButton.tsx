import classNames from 'classnames';
import { ReactNode, CSSProperties, HTMLAttributes } from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: ${props => props.theme.color.base_3};
  opacity: 0.7;
  letter-spacing: 1px;
  font-size: 14px;  
  font-family:'Segoe UI', Verdana, sans-serif ;

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
} & HTMLAttributes<HTMLButtonElement>;

const MoreButton = (props: MoreButtonProps) => {
  const { children, hide = false, className, ...restProps } = props;
  const newClassName = hide ? 'hide' : '';
  return (

    <StyledButton className={classNames(newClassName, className)} {...restProps}>
      •••
    </StyledButton>


  );
};

export default MoreButton;
