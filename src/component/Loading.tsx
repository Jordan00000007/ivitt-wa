import Overlay from './Overlay';
import styled from 'styled-components';
import classNames from 'classnames';
import CircularProgress, { circularProgressClasses } from '@mui/material/CircularProgress';
import { getLoading } from '../redux/store/slice/loading'
import { useSelector } from 'react-redux';


const StyledOverlay = styled(Overlay)`
  cursor: pointer;
`;

const DialogContainer = styled.div`
  border-radius: 12px;
  min-width: 200px;
  min-height: 200px;
  max-width: 40%;
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

const Wrapper = styled.div`
  position: fixed;
  inset: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 150;
  transition: all 0.25s ease;

  &.show {
    visibility: visible;
    display: block;
  }

  &.hide {
    visibility: hidden;
    display: none;
  }
`;

const LoadingTitle = styled.div`
  position: absolute;
  top: 45%;
  left: 35%;
  margin: auto;
  font-size: 16px;
`;


const Loading = () => {
  const open = useSelector(getLoading).isOpen;
  return (
    <Wrapper className={classNames({ hide: !open })}>
      <StyledOverlay open={open} />
      <DialogContainer className={classNames(open ? 'show' : 'hide')}>
        <LoadingTitle>Loading</LoadingTitle>
        <CircularProgress
          variant="determinate"
          sx={{
            color: (theme) =>
              theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
           
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            margin: 'auto',
          }}
          size={90}
          thickness={2.5}
          value={100}
        />
        <CircularProgress
          variant="indeterminate"
          disableShrink
          sx={{
            color: (theme) => (theme.palette.mode === 'light' ? '#E61F23' : '#E61F23'),
           
            animationDuration: '1200ms',
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            margin: 'auto',
            [`& .${circularProgressClasses.circle}`]: {
              strokeLinecap: 'round',
            },
          }}
          size={90}
          thickness={2.5}
          
          
        />
      </DialogContainer>
    </Wrapper>
  );
};

export default Loading;
