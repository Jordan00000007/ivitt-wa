import { useCallback, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetAllProjectsType, getTrainingListAPI,getDatasetListAPI } from "../../constant/API";
import { WsContext } from "../../layout/logIn/LoginLayout";
import { useGetIterationList } from "../../pages/dataset/hook/useDataset";
import { selectCardClassType } from "../../pages/Main";
import { useGetCurrTrainInfo } from "../../pages/model/hook/useModelData";
import { createAlertMessage } from "../../redux/store/slice/alertMessage";
import { selectCurrentTrainInfo } from "../../redux/store/slice/currentTrainInfo";
import { selectDisableBtn } from "../../redux/store/slice/disableBtn";
import { selectSocketId } from "../../redux/store/slice/socketId";
import { selectIteration } from "../../redux/store/slice/currentIteration";
import { customAlertMessage } from "../../utils/utils";
import StopTrainDialog from "../Dialogs/StopTrainDialog";
import WarnTrainDialog from "../Dialogs/WarnTrainDialog";
import TrainDialog from "../Dialogs/TrainDialog";
import { StyledBtnWhite } from "./headerStyle";
import styled from "styled-components";
import { selectProjectData } from "../../redux/store/slice/projectData";
import { io } from 'socket.io-client';
import { socketHost } from '../../constant/API/APIPath';



type TagProps = {
    handleInitData: (data: GetAllProjectsType) => void;
};

export const TrainBtnWrapperDiv = styled.div`
display: flex;
align-items: center;
justify-content: flex-end;
width: 608px;
height: 56px;

@media(max-width: 1024px){
  width: 316px;
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
    const [openWarnDialog, setOpenWarnDialog] = useState(false);
    const { convertId } = useContext(WsContext);
    const currentIter = useSelector(selectIteration).iteration;

    const [isTraining, setIsTraining] = useState(false);

    const [trainingProjectId, setTrainingProjectId] = useState('');
    const [trainingIteration, setTrainingIteration] = useState('');
    const [trainingTaskId, setTrainingTaskId] = useState('');

    function getTrainingList() {
        return new Promise((resolve, reject) => {
            getTrainingListAPI()
                .then(({ data }) => {
                    resolve(data.data);
                })
                .catch(({ response }) => {
                    reject('getTrainingListAPI-Error');
                })
        })
    }

    function getDatasetList() {
        return new Promise((resolve, reject) => {
            getDatasetListAPI(socketId)
                .then(({ data }) => {
                    resolve(data.data);
                })
                .catch(({ response }) => {
                    reject('getDatasetListAPI-Error');
                })
        })
    }


    const trainBtnOnClick = async () => {
        //只要是可以train的每次按之前都確認一下是不是正在training的
        if (!alertTrain) getCurrTrainingInfo();

        //console.log('socketId',socketId)

        const myList: any = await getTrainingList();
        let projectInScheduler=false;

        //console.log('task_list',myList.task_list)

        if (myList.task_list) {
            if (myList.task_list.length > 0) {

                myList.task_list.forEach((item:any) => {
                    
                    const myTaskId = Object.keys(item).toString();
                    const myProjectId = item[myTaskId].project_uuid;
                    if (socketId === myProjectId) projectInScheduler = true;
                });
            }
        }

        //console.log('projectInScheduler',projectInScheduler);
        //projectInScheduler=true;

        const IterList:any=await getDatasetList();
        let IterNumberOverLimit=false;
        if (IterList.folder_name.length>=21) IterNumberOverLimit=true;
        //console.log('IterList',IterList.folder_name.length)


        //如果是在train的，就執行stop
        if (isTraining) {
            setOpenStopDialog(true)
        } else {
            //如果不是在train的，就判斷class跟iter數量能不能train
            if (projectInScheduler) {
                //console.log('alert could not training dialog')
                setOpenWarnDialog(true)
            } else {
                if ((alertTrain)||(IterNumberOverLimit)) {
                    dispatch(createAlertMessage(customAlertMessage('error', 'Each class picture must over 15 or iteration counts must below 20.')));
                } else {
                    setOpenTrainDialog(true);
                }
            }
        }
    }


    const checkTrainCondition = useCallback(
        (classNumber: selectCardClassType) => {
            const overFifteen = Object.keys(classNumber).map((theClass) => classNumber[theClass] >= 15);
            const checkIfPass = overFifteen.every(value => value === true);

            //if (overFifteen.length > 0 && checkIfPass && iterLengthPass) {
            if (overFifteen.length > 0 && checkIfPass) {
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

    useEffect(() => {

        if ((socketId !== '') ) {
            getTrainingListAPI()
                .then(({ data }) => {
                    if (data.status === 200) {
                        // console.log('training list---')
                        // console.log(data.data)
                        if (data.data) {
                            if (data.data.task_list.length > 0) {
                                const myTaskId = Object.keys(data.data.task_list[0]).toString();
                                const myProjectId = data.data.task_list[0][myTaskId].project_uuid;
                                const myIteration = data.data.task_list[0][myTaskId].iteration;
                                setTrainingTaskId(myTaskId);
                                setTrainingProjectId(myProjectId);
                                setTrainingIteration(myIteration);

                                if ((myProjectId === socketId) && (currentIter === `iteration${myIteration}`)) {
                                    console.log('it is training')
                                    setIsTraining(true);

                                } else {
                                    console.log('it is not training')
                                    setIsTraining(false);

                                }

                            } else {
                                setTrainingTaskId('');
                                setTrainingProjectId('');
                                setTrainingIteration('');
                                setIsTraining(false);
                            }

                        }


                    } else {
                        console.log('getTrainingListAPI-Error', data.message);
                    }
                })
                .catch(({ response }) => {
                    console.log('getTrainingListAPI-Error', response);
                })
        }

    }, [socketId, currentIter]);


    useEffect(() => {

        const socket = io(`${socketHost}/schedule`);

        socket.on('connect', () => {
            //log('Connected to the server');
        });

        socket.on('task_sort', (message) => {


            const myTaskList = JSON.parse(message).task_sort;

            if (myTaskList.length === 0) {

                setTrainingTaskId('');
                setTrainingProjectId('');
                setTrainingIteration('');
                setIsTraining(false);

            } else {



                const myTaskId = Object.keys(myTaskList[0]).toString();
                const myIteration = myTaskList[0][myTaskId].iteration;
                const myProjectId = myTaskList[0][myTaskId].project_uuid;

                // console.log('==============================')
                // console.log('myTaskId',myTaskId)
                // console.log('myIteration',myIteration)
                // console.log('myProjectId',myProjectId)

                setTrainingTaskId(myTaskId);
                setTrainingProjectId(myProjectId);
                setTrainingIteration(myIteration);

                if ((myProjectId === socketId) && (currentIter === `iteration${myIteration}`)) {
                    console.log('it is training')
                    setIsTraining(true);

                } else {
                    console.log('it is not training')
                    setIsTraining(false);

                }


            }
        })



        // 在組件卸載時斷開連接
        return () => {
            socket.disconnect();
        };
    }, []);



    return (
        <>
            <TrainBtnWrapperDiv>
                <StyledBtnWhite
                    onClick={() => {
                        trainBtnOnClick()
                    }}
                    disabled={convertId !== '' || disableBtn}
                >
                    {(isTraining) ? 'Stop' : 'Train'}
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
                    taskId={trainingTaskId}
                    open={openStopDialog}
                    lastIter={lastIter}
                    getIterListCallback={getIterListCallback}
                    handleClose={() => {
                        setOpenStopDialog(false);
                    }}
                /> : null
            }
            {openWarnDialog ?
                <WarnTrainDialog
                    currentID={socketId}
                    taskId={trainingTaskId}
                    open={openWarnDialog}
                    lastIter={lastIter}
                    getIterListCallback={getIterListCallback}
                    handleClose={() => {
                        setOpenWarnDialog(false);
                    }}
                /> : null
            }


        </>
    );
};

export default TrainFunction;
