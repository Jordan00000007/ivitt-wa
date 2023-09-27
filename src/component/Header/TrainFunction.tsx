import { useCallback, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetAllProjectsType } from "../../constant/API";
import { WsContext } from "../../layout/logIn/LoginLayout";
import { useGetIterationList } from "../../pages/dataset/hook/useDataset";
import { selectCardClassType } from "../../pages/Main";
import { useGetCurrTrainInfo } from "../../pages/model/hook/useModelData";
import { createAlertMessage } from "../../redux/store/slice/alertMessage";
import { selectCurrentTrainInfo } from "../../redux/store/slice/currentTrainInfo";
import { selectDisableBtn } from "../../redux/store/slice/disableBtn";
import { selectSocketId } from "../../redux/store/slice/socketId";
import { customAlertMessage } from "../../utils/utils";
import StopTrainDialog from "../Dialogs/StopTrainDialog";
import TrainDialog from "../Dialogs/TrainDialog";
import { StyledBtnWhite } from "./headerStyle";
import styled from "styled-components";
import { selectProjectData } from "../../redux/store/slice/projectData";


type TagProps = {
  handleInitData: (data: GetAllProjectsType) => void;
};

export const TrainBtnWrapperDiv = styled.div`
display: flex;
align-items: center;
justify-content: flex-end;
width: 662px;
height: 56px;


  @media(max-height: 850px) and (min-width: 1366px){
    width: 650px;
  }

  @media(min-height: 850px){
    width: 660px;
  }

  @media(max-width: 1320px){
  min-width:fit-content;
  margin-left: 12px;
  width: 100px;
  }
`;


const TrainFunction = (props: TagProps) => {
  const { handleInitData } = props;
  const dispatch = useDispatch();
  const trainData = useSelector(selectCurrentTrainInfo).currTrain;
  const socketId = useSelector(selectSocketId).socketId;
  const disableBtn = useSelector(selectDisableBtn).disableBtn;
  const projectData = useSelector(selectProjectData).projectData;
  const { iterLengthPass, lastIter, getIterListCallback } = useGetIterationList(socketId);
  const { getCurrTrainingInfo } = useGetCurrTrainInfo();
  const [alertTrain, setAlertTrain] = useState(false);
  const [openTrainDialog, setOpenTrainDialog] = useState(false);
  const [openStopDialog, setOpenStopDialog] = useState(false);
  const { convertId } = useContext(WsContext);


  const trainBtnOnClick = () => {
    //只要是可以train的每次按之前都確認一下是不是正在training的
    if (!alertTrain) getCurrTrainingInfo();

    //只要有在train的就禁止
    if (Object.keys(trainData).length !== 0 && !trainData[socketId]) {
      dispatch(createAlertMessage(customAlertMessage('error', 'Another project is training.')));
      return;
    }

    //如果是在train的，就執行stop
    if (trainData[socketId] && trainData[socketId].status && Object.keys(trainData).length !== 0) {
      setOpenStopDialog(true)
    } else {
      //如果不是在train的，就判斷class跟iter數量能不能train
      if (alertTrain) {
        dispatch(createAlertMessage(customAlertMessage('error', 'Each class picture must over 15 or iteration counts must below 20.')));
      } else {
        setOpenTrainDialog(true);
      }
    }
  }


  const checkTrainCondition = useCallback(
    (classNumber: selectCardClassType) => {
      const belowFifteen = Object.values(classNumber).filter((value) => { return Number(value) < 15 })

      if (Object.values(classNumber).length > 0 && belowFifteen.length === 0 && iterLengthPass) {
        return true;
      } else {
        return false;
      }
    },
    [iterLengthPass]
  );


  useEffect(() => {
    if (!socketId || !projectData) return;
    if (checkTrainCondition(projectData['workspace']['classNumber'])) {
      setAlertTrain(false)
    } else {
      setAlertTrain(true);
    }
  }, [checkTrainCondition, projectData, socketId]);




  return (
    <>
      <TrainBtnWrapperDiv>
        <StyledBtnWhite
          onClick={() => {
            trainBtnOnClick()
          }}
          disabled={convertId !== '' || disableBtn}
        >
          {trainData[socketId] && trainData[socketId].status ? 'Stop' : 'Train'}
        </StyledBtnWhite>
      </TrainBtnWrapperDiv>
      {openTrainDialog ?
        <TrainDialog
          id={socketId}
          setAlertTrain={setAlertTrain}
          handleInitData={handleInitData}
          open={openTrainDialog}
          handleClose={() => {
            setOpenTrainDialog(false);
          }}
          tipText={'Project Name'}
        /> : null
      }
      {openStopDialog ?
        <StopTrainDialog
          currentID={socketId}
          open={openStopDialog}
          lastIter={lastIter}
          getIterListCallback={getIterListCallback}
          handleClose={() => {
            setOpenStopDialog(false);
          }}
        /> : null
      }
    </>
  );
};

export default TrainFunction;
