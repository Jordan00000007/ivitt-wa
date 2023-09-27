import styled from 'styled-components';

type OverlayProps = {
  open: boolean;
};

const Overlay = styled.div<OverlayProps>`
  position: fixed;
  display: ${(props) => (props.open ? 'block' : 'none')};
  visibility: ${(props) => (props.open ? 'visible' : 'hidden')};
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: #969698;
  opacity: 0.6;
  z-index: 100;
`;

export default Overlay;
