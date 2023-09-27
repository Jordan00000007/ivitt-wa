import styled from 'styled-components';
import Dialog, { DialogProps } from './Dialog';
import { Title, ActionContainer, StyledButton, StyledButtonRed } from './commonDialogsStyle';


const ContentWrapper = styled.div`
  height: 392px;
  display: flex;
  flex-direction: column;
`

type QuitUploadDialogProps = DialogProps & {
  setOpenQuit: (data: boolean) => void;
  handleQuitClose: () => void;
};


const QuitUploadDialog = (props: QuitUploadDialogProps) => {
  const { open, handleClose, handleQuitClose, setOpenQuit, ...restProps } = props;


  return (
    <Dialog style={{ width: '500px', height: '400px', margin: '30px 40px', overflow: 'hidden' }}
      open={open} handleClose={() => { }} {...restProps}>
      <Title style={{ marginBottom: '20px' }}>Quit upload</Title>
      <ContentWrapper>Are you sure? The uploading is not complete yet.</ContentWrapper>
      <ActionContainer>
        <StyledButton style={{ width: 'fit-content' }} onClick={() => setOpenQuit(false)}>
          {'Continue uploading'}
        </StyledButton>
        <StyledButtonRed style={{ marginBottom: '0' }} onClick={() => handleQuitClose()}>Quit</StyledButtonRed>
      </ActionContainer>
    </Dialog >
  );
};

export default QuitUploadDialog;
