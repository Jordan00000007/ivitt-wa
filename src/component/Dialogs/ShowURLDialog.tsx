import Dialog, { DialogProps } from './Dialog';
import { Title, ActionContainer, StyledButtonRed } from './commonDialogsStyle';
import { useDispatch } from 'react-redux';
import InputTextField from '../Input/InputTextField';
import styled from 'styled-components';
import { createAlertMessage } from '../../redux/store/slice/alertMessage';
import { customAlertMessage } from '../../utils/utils';
import Copy from '../../images/Copy.png'

type ShowURLDialogProps = DialogProps & {
  URLValue: string;
};

const CopyBtn = styled.div`
  position: absolute;
  top: 22.5px;
  left:88%;
  cursor: pointer;
  height: 52px;
  width: 52px;
  display: flex;
  justify-content: center;
  align-items: center;

`

const IconWrap = styled.div`
  height: 32px;
  width: 32px;
  border: 1px solid #FAFAFD;
  border-radius: 6px;
  display: flex;

  &:hover{
    background-color: ${props => props.theme.color.divider};
  }
`


const ShowURLDialog = (props: ShowURLDialogProps) => {
  const { open, handleClose, URLValue, ...restProps } = props;
  const dispatch = useDispatch();


  const handleCancel = () => {
    handleClose();
  };

  async function copyToClipboard(textToCopy: string) {
    // Navigator clipboard api needs a secure context (https)
    if (window.isSecureContext) {
      await window.navigator.clipboard.writeText(textToCopy);
    } else {
      // Use the 'out of viewport hidden text area' trick
      const textArea = document.createElement("textarea");
      textArea.value = textToCopy;

      // Move textarea out of the viewport so it's not visible
      textArea.style.position = "absolute";
      textArea.style.left = "-999999px";

      document.body.prepend(textArea);
      textArea.select();
      //execCommand目前還可以作用但可能隨時被停用
      try {
        document.execCommand('copy');
      } catch (error) {
        dispatch(createAlertMessage(customAlertMessage('error', 'Failed to copy the URL.')));
      } finally {
        textArea.remove();
      }
    };
  }


  const handleClickCopy = async () => {
    try {
      await copyToClipboard(URLValue);
      dispatch(createAlertMessage(customAlertMessage('success', 'The URL has been copied.')));
    } catch (error) {
      dispatch(createAlertMessage(customAlertMessage('error', 'Failed to copy the URL.')));
    }
  };


  return (
    <Dialog open={open} handleClose={() => { }} {...restProps}>
      <Title>Export success</Title>
      <InputTextField
        labelName={'URL'}
        value={URLValue}
        inputStyle={{ paddingRight: '50px' }}
        endElement={
          <CopyBtn
            onClick={() => handleClickCopy()}>
            <IconWrap><img src={Copy} alt={Copy} /></IconWrap>
          </CopyBtn>
        }
        onChange={() => { }}
      >
      </InputTextField>

      <ActionContainer>
        <StyledButtonRed type='button' onClick={handleCancel}>
          {'Close'}
        </StyledButtonRed>

      </ActionContainer>
    </Dialog >
  );
};

export default ShowURLDialog;
