import { useCallback, useEffect, useRef, useState } from 'react';
import Dialog, { DialogProps } from './Dialog';
import { customAlertMessage } from '../../utils/utils';
import { Title, ActionContainer, StyledButton, StyledButtonRed } from './commonDialogsStyle';
import InputTextField from '../Input/InputTextField';
import SelectMenu from '../Select/SelectMenu';
import { SelectChangeEvent } from '@mui/material';
import { GetAllProjectsType, createProjectAPI, getAllProjectsAPI } from '../../constant/API';
import { useAddProjectList } from '../../pages/projects/hook/useAllProjects';
import { createAlertMessage } from '../../redux/store/slice/alertMessage';
import { useDispatch } from 'react-redux';
import { closeLoading, openLoading } from '../../redux/store/slice/loading';




type AddDialogProps = DialogProps & {
  handleInitData: (data: GetAllProjectsType) => void
};

type ErrorItem = {
  projectName: boolean;
  projectType: boolean;
  platform: boolean;
}

const AddProjectDialog = (props: AddDialogProps) => {
  const { open, handleInitData, handleClose, ...restProps } = props;
  const { typeList, platformList } = useAddProjectList();
  const dispatch = useDispatch();
  const errRef = useRef<any | null>(null);
  const [projectName, setProjectName] = useState('');
  const [projectType, setProjectType] = useState('');
  const [platform, setPlatform] = useState('');
  const [errorItem, setErrorItem] = useState<ErrorItem>({
    projectName: false,
    projectType: false,
    platform: false
  });


  const clearValue = () => {
    setProjectName('');
    setPlatform('');
    setProjectType('');
  };

  const handleCancel = useCallback(() => {
    handleClose();
    clearValue();
  }, [handleClose]);

  const handleTypeChange = (event: SelectChangeEvent<string>) => {
    event.preventDefault();
    setProjectType(event.target.value);
  };

  const handlePlatformChange = (event: SelectChangeEvent<string>) => {
    event.preventDefault();
    setPlatform(event.target.value);
  };




  const handleSave = () => {
    const notAllFilled = projectName === '' || projectType === '' || platform === '';

    if (notAllFilled) {
      errRef.current = true;
      setErrorItem({
        projectName: projectName === '' ? true : false,
        projectType: projectType === '' ? true : false,
        platform: platform === '' ? true : false
      });
      dispatch(createAlertMessage(customAlertMessage('error', 'Please fill in all the columns')));
      return;
    }

    dispatch(openLoading())
    createProjectAPI({
      project_name: projectName,
      platform: platform,
      type: projectType
    })
      .then(() => {
        getAllProjectsAPI()
          .then(({ data }) => {
            handleInitData(data.data);
            dispatch(createAlertMessage(customAlertMessage('success', 'Add Project Success')));
          })
          .catch((err) => console.log('CardDialog-AddProject-Error', err))
          .finally(() => {
            dispatch(closeLoading());
            handleCancel();
          })
      })
      .catch(({ response }) => {
        dispatch(createAlertMessage(customAlertMessage('error', response.data.message ? response.data.message : 'Internal server error')));
        dispatch(closeLoading());
      })
      .finally(() => dispatch(closeLoading()))

  }


  useEffect(() => {
    if (!errRef.current) return;
    if (projectName !== '' || projectType !== '' || platform !== '') {
      setErrorItem({
        projectName: projectName !== '' ? false : true,
        projectType: projectType !== '' ? false : true,
        platform: platform !== '' ? false : true
      });
    }
  }, [platform, projectName, projectType]);


  return (
    <Dialog open={open} handleClose={handleCancel} {...restProps}>
      <Title>Add Project</Title>
      <InputTextField
        style={{ marginBottom: '18px' }}
        labelName='Project Name *'
        value={projectName}
        onChange={(e) => {
          setProjectName(e.target.value);
        }}
        error={errorItem.projectName}
      />
      <SelectMenu labelName={'Type *'} name={projectType} value={projectType} menuItemArray={typeList} handleChange={handleTypeChange} error={errorItem.projectType} />
      <SelectMenu labelName={'Platform *'} name={platform} value={platform} menuItemArray={platformList} handleChange={handlePlatformChange} error={errorItem.platform} />
      <ActionContainer>
        <StyledButton onClick={handleCancel}>
          Cancel
        </StyledButton>
        <StyledButtonRed onClick={handleSave}>
          Add
        </StyledButtonRed>
      </ActionContainer>
    </Dialog >
  );
};

export default AddProjectDialog;

