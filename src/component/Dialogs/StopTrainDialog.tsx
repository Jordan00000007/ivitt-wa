import Dialog, { DialogProps } from './Dialog';
import { Title, ActionContainer, StyledButton, TipText, StyledButtonRed } from './commonDialogsStyle';
import { useCallback, useEffect } from 'react';
import { checkBestModelAPI } from '../../constant/API';
import { stopTrainingAPI } from '../../constant/API/trainAPI';
import { createAlertMessage } from '../../redux/store/slice/alertMessage';
import { setIteration } from '../../redux/store/slice/currentIteration';
import { selectCurrentTab, setCurrentTab } from '../../redux/store/slice/currentTab';
import { setIsTraining } from '../../redux/store/slice/isTraining';
import { customAlertMessage } from '../../utils/utils';
import { useDispatch, useSelector } from 'react-redux';
import { useGetCurrTrainInfo } from '../../pages/model/hook/useModelData';
import { closeLoading, openLoading } from '../../redux/store/slice/loading';



type StopTrainDialogProps = DialogProps & {
  currentID: string;
  lastIter: string;
  getIterListCallback: () => void
};


const StopTrainDialog = (props: StopTrainDialogProps) => {
  const { open, handleClose, currentID, lastIter, getIterListCallback, ...restProps } = props;
  const dispatch = useDispatch();
  const { getCurrTrainingInfo } = useGetCurrTrainInfo();
  const currentTab = useSelector(selectCurrentTab).tab;

  const backToDataset = useCallback(() => {
    dispatch(setIsTraining('stop'));
    dispatch(setCurrentTab("Dataset"));
    dispatch(setIteration('workspace'));
    getCurrTrainingInfo();
    dispatch(closeLoading());
  }, [dispatch, getCurrTrainingInfo])


  const handleStopTrain = useCallback(() => {
    dispatch(openLoading());
    handleClose();
    stopTrainingAPI(currentID)
      .then((res) => {
        checkBestModelAPI(currentID, { iteration: lastIter })
          .then((res) => {
            setTimeout((() => {
              dispatch(setIsTraining('stop'));
              dispatch(closeLoading());
              dispatch(createAlertMessage(customAlertMessage('success', 'Stop training')))
            }), 8000)
          })
          .catch(({ response }) => {
            if (currentTab !== 'model') {
              setTimeout((() => {
                backToDataset();
                dispatch(createAlertMessage(customAlertMessage('success', 'Stop training with no best model')))
              }), 8000)
            }
          })
      })
      .catch((err) => {
        setTimeout((() => {
          backToDataset();
          dispatch(createAlertMessage(customAlertMessage('error', 'Stop training error')))
        }), 8000)
      })

  },
    [backToDataset, currentID, currentTab, dispatch, handleClose, lastIter]
  );

  useEffect(() => {
    if (open && lastIter) {
      getIterListCallback();
    }
  }, [getIterListCallback, lastIter, open]);


  return (
    <Dialog open={open} handleClose={handleClose} {...restProps}>
      <Title>Stop Train</Title>
      <TipText>Stop training now?</TipText>
      <ActionContainer>
        <StyledButton onClick={() => handleClose()}>
          {'Cancel'}
        </StyledButton>
        <StyledButtonRed onClick={() => handleStopTrain()}>{'Stop'}</StyledButtonRed>
      </ActionContainer>
    </Dialog>
  );
};

export default StopTrainDialog;
