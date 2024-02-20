import Overlay from '../../Overlay';
import styled from 'styled-components';
import { HtmlHTMLAttributes, ReactNode } from 'react';
import classNames from 'classnames';

const StyledOverlay = styled(Overlay)`
  cursor: pointer;
`;

const DialogContainer = styled.div`
  border-radius: 12px;
  width: 500px;
  height: 360px;
  overflow: auto;
  display: flex;
  flex-direction: column;
  position: fixed;
  z-index: 100;
  transition: all 0.25s ease;


  &::before {
    content: '';
    background: ${props => props.theme.color.base_2};
    border-radius: 12px;
    z-index: -1;
    position: absolute;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
    box-shadow: 2px 2px 8px #0000001A;
  } 
`;

const Content = styled.div`
  transition: all 0.25s ease;
  overflow-y: overlay;
  padding: 40px;
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const Wrapper = styled.div`
  position: fixed;
  inset: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  transition: all 0.25s ease;

  &.hide {
    visibility: hidden;
    display: none;
  }
`;

export type DialogProps = {
  open: boolean;
  handleClose: () => void;
  lapTop?: boolean;
  children?: ReactNode;
} & HtmlHTMLAttributes<HTMLDivElement>;


const Dialog = ({ open, handleClose, children, lapTop = false, ...restProps }: DialogProps) => {
  return (
    <Wrapper className={classNames({ hide: !open })}>
      <StyledOverlay
        open={open}
        onClick={() => {
          handleClose();
        }}
      />
      <DialogContainer {...restProps} className={classNames(lapTop ? 'lapTop' : '')}>
        <Content>{children}</Content>
      </DialogContainer>
    </Wrapper>
  );
};

export default Dialog;
