import { useEffect, useRef, useState } from 'react';
import Dialog, { DialogProps } from '../Dialogs/Dialog';
import { customAlertMessage } from '../../utils/utils';
import { ActionContainer, StyledButton, StyledButtonRed, Title } from './commonDialogsStyle';
import InputTextField from '../Input/InputTextField';
import { GetAllProjectsType, getAllProjectsAPI, renameProjectAPI } from '../../constant/API';
import { createAlertMessage } from '../../redux/store/slice/alertMessage';
import { useDispatch } from 'react-redux';
import { closeLoading, openLoading } from '../../redux/store/slice/loading';

export type RenameDialogProps = DialogProps & {
  open: boolean;
  projectId: string;
  currentProjectName: string;
  handleInitData: (data: GetAllProjectsType) => void
};

const CommonRenameDialog = (props: RenameDialogProps) => {
  const { open, projectId, currentProjectName, handleInitData, handleClose, ...restProps } = props;
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [errorItem, setErrorItem] = useState<boolean>(false);
  const errRef = useRef<any | null>(null);

  const handleCancel = () => {
    handleClose();
    setName('');
    errRef.current = false;
    setErrorItem(false)
  };

  const handleSave = () => {
    if (name === '') {
      errRef.current = true;
      setErrorItem(true);
      dispatch(createAlertMessage(customAlertMessage('error', 'Project name can not be empty')));
      return;
    }

    dispatch(openLoading())
    renameProjectAPI(projectId, name)
      .then(() => {
        getAllProjectsAPI()
          .then(({ data }) => {
            handleInitData(data.data);
            dispatch(createAlertMessage(customAlertMessage('success', 'Rename Success')));
          })
          .catch(({ response }) => console.log('CardDialog-getAllProjectsAPI-Error', response.data.message))
          .finally(() => {
            handleCancel();
            dispatch(closeLoading())
          });
      })
      .catch(({ response }) => {
        dispatch(createAlertMessage(customAlertMessage('error', response.data.message ? response.data.message : 'Internal server error')));

      })
      .finally(() => {
        dispatch(closeLoading());
      })

  };


  useEffect(() => {
    if (!errRef.current) return;
    if (name !== '') {
      setErrorItem(false);
    }
  }, [name]);

  return (
    <Dialog open={open} handleClose={handleCancel} {...restProps}>
      <Title>{`${'Rename'} ${currentProjectName}`} </Title>
      <InputTextField
        labelName='New project name'
        value={name}
        onChange={(e) => {
          setName(e.target.value);
        }}
        error={errorItem}
      />
      <ActionContainer>
        <StyledButton onClick={handleCancel}>
          {'Cancel'}
        </StyledButton>
        <StyledButtonRed onClick={handleSave}>
          {'Save'}
        </StyledButtonRed>
      </ActionContainer>
    </Dialog>
  );
};

export default CommonRenameDialog;
