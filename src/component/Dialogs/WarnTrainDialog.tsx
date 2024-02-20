import Dialog, { DialogProps } from './Dialog2';
import { Title, ActionContainer, StyledButton, TipText, StyledButtonRed } from './commonDialogsStyle';
import { useCallback, useEffect } from 'react';
import { selectCurrentTab, setCurrentTab } from '../../redux/store/slice/currentTab';
import { setIsTraining } from '../../redux/store/slice/isTraining';
import { customAlertMessage } from '../../utils/utils';
import { useDispatch, useSelector } from 'react-redux';
import { useGetCurrTrainInfo } from '../../pages/model/hook/useModelData';
import { closeLoading, openLoading } from '../../redux/store/slice/loading';



type WarnTrainDialogProps = DialogProps & {
    currentID: string;
    taskId: string;
    lastIter: string;
    getIterListCallback: () => void
};




const WarnTrainDialog = (props: WarnTrainDialogProps) => {
    const { open, handleClose, currentID, taskId, lastIter, getIterListCallback, ...restProps } = props;
    const dispatch = useDispatch();
    const { getCurrTrainingInfo } = useGetCurrTrainInfo();
    const currentTab = useSelector(selectCurrentTab).tab;

    
    return (
        <Dialog open={open} handleClose={handleClose} {...restProps}>
            <Title>Already in training schedule.</Title>
            <TipText>Please go to the scheduler page to check the order of your projects.</TipText>
            <ActionContainer>
                <StyledButtonRed onClick={() => handleClose()}>
                    {'Close'}
                </StyledButtonRed>
            </ActionContainer>
        </Dialog>
    );
};

export default WarnTrainDialog;
