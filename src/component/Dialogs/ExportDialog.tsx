import Dialog, { DialogProps } from './Dialog';
import { Title, ActionContainer, StyledButton, StyledButtonRed } from './commonDialogsStyle';
import { FormEventHandler, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { createAlertMessage } from '../../redux/store/slice/alertMessage';
import { customAlertMessage } from '../../utils/utils';
import { useDispatch } from 'react-redux';
import SelectMenu from '../Select/SelectMenu';
import { MenuItem, SelectChangeEvent } from '@mui/material';
import { getExportPlatformAPI, getExportStatusAPI, startExportAPI } from '../../constant/API/exportAPI';
import { convertInfoInit, WsContext } from '../../layout/logIn/LoginLayout';



type ExportDialogProps = DialogProps & {
  currID: string;
  currPlatform: string;
  currIter: string;
  projectModel: string;
};


const ExportDialog = (props: ExportDialogProps) => {
  const { open, handleClose, currID, currPlatform, currIter, projectModel, ...restProps } = props;
  const dispatch = useDispatch();
  const { setConvertInfo, setConvertId, setOpenURLDialog, setURL } = useContext(WsContext);
  const [exportPlatformList, setExportPlatformList] = useState<string[]>([]);
  const [exportToList, setExportToList] = useState<string[]>([]);
  const errRef = useRef<any | null>(null);
  const [errorItem, setErrorItem] = useState<boolean>(false);


  const exportFormInitial = {
    platform: currPlatform.toLowerCase(),
    exportTo: ''
  }
  const [exportForm, setExportForm] = useState(exportFormInitial);


  const handleOnChange = (e: SelectChangeEvent<string>) => {
    e.preventDefault();

    setExportForm({
      ...exportForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleCancel = () => {
    handleClose();
    setExportForm(exportFormInitial);
    errRef.current = false;
    setErrorItem(false)
  };

  const handlePlatformList = useCallback(() => {
    if (exportPlatformList?.length === 0) return [currPlatform];
    else return exportPlatformList;
  },
    [currPlatform, exportPlatformList]
  );

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    let postData: {
      iteration: string
      export_platform: any,
    };

    const formData = new FormData(e.currentTarget);

    if (formData.get('exportTo') === '') {
      errRef.current = true;
      setErrorItem(true);
      dispatch(createAlertMessage(customAlertMessage('error', 'Please fill in all the columns')));
      return;
    }

    postData = {
      iteration: currIter,
      export_platform: formData.get('platform'),
    }

    if (formData.get('platform') !== '' || formData.get('exportTo') !== '') {
      dispatch(createAlertMessage(customAlertMessage('convert', 'Start converting...')));
      handleCancel();
    }

    setConvertId(currID)
    setConvertInfo({
      currID: currID,
      currPlatform: postData.export_platform,
      currIter: currIter,
      selectExportTo: formData.get('exportTo')
    })

    startExportAPI(currID, postData)
      .then(({ data }) => {

        //暫時先關掉，因第二次時WS都可以接到message
        // if (data.includes('The model has been converted')) {

        //   if (exportForm.exportTo === 'iCAP') {
        //     exportIcapAPI(currID, { iteration: currIter })
        //       .then(({ data }) => {
        //         console.log('+++ICAP-DATA', data.data);
        //         dispatch(createAlertMessage(customAlertMessage('success', 'Export success')));
        //       })
        //       .catch(({ response }) => {
        //         console.log('exportIcapAPI-Error', response);
        //         if (response.status === 400) dispatch(createAlertMessage(customAlertMessage('error', response.data.message)));
        //         else dispatch(createAlertMessage(customAlertMessage('error', "Export to iCAP failed")));
        //       })
        //       .finally(() => {
        //         setConvertId('')
        //         setConvertInfo(convertInfoInit);
        //       })
        //   } else {
        //     getShareUrlAPI(currID, { iteration: currIter })
        //       .then(({ data }) => {
        //         if (formData.get('exportTo') === 'URL') {
        //           setURL(`http://${data.data}`);
        //           console.log("LoginLayout-true", data.data)
        //           setOpenURLDialog(true);
        //         }
        //         if (formData.get('exportTo') === 'local') {
        //           console.log("LOCAL+++")
        //           window.location.href = `http://${data.data}`;
        //         }
        //       })
        //       .catch(({ response }) => {
        //         console.log('getShareUrlAPI-Error', response.data.message)
        //       })
        //       .finally(() => {
        //         setConvertId('')
        //         setConvertInfo(convertInfoInit);
        //       })
        //   }
        //   dispatch(createAlertMessage(customAlertMessage('success', 'The model has been converted')));
        // }
      })
      .catch(({ response }) => {
        console.log('startExportAPI-Error', response)
        setConvertId('')
        setConvertInfo(convertInfoInit);
        dispatch(createAlertMessage(customAlertMessage('error', 'Export Failed')))
      })
      .finally(() => handleCancel())
  }

  useEffect(() => {
    if (!open) return;
    Promise.all([getExportPlatformAPI(currID, projectModel), getExportStatusAPI()])
      .then((res) => {
        if (res) {
          setExportPlatformList(res[0].data.data.export_platform);
          const exportTo = res[1].data.data;
          const availableList = Object.keys(exportTo).filter((item: string) => exportTo[item]);
          setExportToList(availableList);
        }
      })
      .catch(({ response }) => console.log('getTrainMethodListAPI-Err', response.data));

  }, [currID, open, projectModel]);


  useEffect(() => {
    if (!errRef.current) return;
    setErrorItem(exportForm.exportTo !== '' ? false : true);
  }, [exportForm.exportTo]);

  return (
    <Dialog open={open} handleClose={handleCancel} {...restProps}>
      <Title>Export model</Title>
      <form onSubmit={handleSubmit}>
        <SelectMenu labelName={'Platform *'} name={'platform'} value={exportForm.platform} menuItemArray={handlePlatformList()} handleChange={handleOnChange} />
        <SelectMenu error={errorItem} labelName={'Export to *'} name={'exportTo'} value={exportForm.exportTo} menuItemArray={exportToList} handleChange={handleOnChange}>
          {exportToList.includes('iCAP') ?
            <div />
            :
            <MenuItem disabled value="">
              <div style={{ paddingLeft: '10px' }}>iCAP</div>
            </MenuItem>
          }
        </SelectMenu>
        <ActionContainer>
          <StyledButton type='button' onClick={handleCancel}>
            {'Cancel'}
          </StyledButton>
          <StyledButtonRed onClick={() => { }}>{'Export'}</StyledButtonRed>
        </ActionContainer>
      </form>
    </Dialog >
  );
};

export default ExportDialog;
