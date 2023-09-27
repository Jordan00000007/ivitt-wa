import styled from 'styled-components';
import CheckCircleOutlineSharpIcon from '@mui/icons-material/CheckCircleOutlineSharp';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import classnames from 'classnames';
import { getAlertMessage, closeAlertMessage, createAlertMessage } from '../redux/store/slice/alertMessage'
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useContext, useEffect } from 'react';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import { StopGrayButton } from './Buttons/ButtonStyle';
import { stopConvertingAPI } from '../constant/API/exportAPI';
import { customAlertMessage } from '../utils/utils';
import { WsContext } from '../layout/logIn/LoginLayout';
import Feedback_Loading from '../images/Feedback_Loading.png'

const AlertContainer = styled.div`
  z-index: 180;
  position: fixed;
  top: 90%;
  left:0;
  right: 12px;
  bottom: 0;
  height: 44px;
  width: 100%;
  max-width: 1200px;
  margin: auto;
  color: ${props => props.theme.color.base_3};
  background-color: ${props => props.theme.color.onColor_1};
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 16px;

  &.show {
    visibility: visible;
  }

  &.hide {
    visibility: hidden;
    pointer-events: none;
    display: none;
  }
`;

const AlertText = styled.div`
  margin-left: 8px;
  padding-top: 2px;
`;

const StyledStopGrayButton = styled(StopGrayButton)`
  position: absolute;
  top: -8px;
  left: 91.5%;
`;

const WaitingIcon = styled(RotateRightIcon)`
  color: #E6AA1F;
  font-size: 28px;
  stroke: #16272E;
  stroke-width: 0.3;
`

export type AlertTypes = 'success' | 'error' | 'convert' | 'download';

const AlertMessage = () => {
  const message = useSelector(getAlertMessage);
  const dispatch = useDispatch();
  const { convertId, setConvertId } = useContext(WsContext);

  const closeTimer = useCallback(() => {
    const timeout = setTimeout(() => {
      dispatch(closeAlertMessage());
      clearTimeout(timeout);
    }, 3000);
  },
    [dispatch]
  );

  const stopConvert = useCallback(() => {
    stopConvertingAPI(convertId)
      .then(({ data }) => {
        dispatch(createAlertMessage(customAlertMessage('success', 'Stop converting')));
      })
      .catch(({ response }) => {
        console.log('stopConvert-Error', response.data.message)
        dispatch(createAlertMessage(customAlertMessage('error', 'Stop convert error')))
      })
      .finally(() => setConvertId(''))
  },
    [convertId, dispatch, setConvertId]
  );

  useEffect(() => {
    //如果是convert/download就不關閉
    if (message.show && message.alertType !== 'convert' && message.alertType !== 'download') closeTimer();
  }, [closeTimer, message.alertType, message.show]);


  const IconGenerate = (alertType: AlertTypes) => {
    if (alertType === 'success') return <CheckCircleOutlineSharpIcon sx={{ color: '#0DD22E' }} />;
    if (alertType === 'error') return <CancelOutlinedIcon sx={{ color: '#E91D1D' }} />;
    if (alertType === 'convert' || alertType === 'download') return <img src={Feedback_Loading} alt={WaitingIcon} />

    return <></>;
  };

  return (
    <AlertContainer className={classnames({ show: message.show, hide: !message.show })} >
      {IconGenerate(message.alertType)}
      <AlertText>{message.message}</AlertText>
      {message.alertType === 'convert' ?
        <StyledStopGrayButton onClick={() => stopConvert()}>Stop</StyledStopGrayButton>
        : null
      }
    </AlertContainer>
  );
};

export default AlertMessage;