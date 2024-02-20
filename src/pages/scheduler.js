import React, { useState, useEffect, useImperativeHandle, forwardRef, useRef, useMemo, useCallback } from 'react';

import log from "../utils/console";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/js/dist/tab.js';
import '../css/App.css';
import { useDispatch, useSelector } from 'react-redux';
import Stack from '@mui/joy/Stack';
import LinearProgress from '@mui/joy/LinearProgress';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { CountUp, useCountUp } from 'use-count-up';
import { useNavigate } from 'react-router-dom';
import CustomToast from "../components/Alerts/CustomToast";
import CustomTooltip from "../components/Tooltips/CustomTooltip";
import StyledTooltip from '../component/Tooltip';
import { Link, useParams, useSearchParams } from 'react-router-dom';

import { EmptyWrapper, SchedulerHeadContainer, SchedulerHeadWrapper, SchedulerBodyContainer, SchedulerBodyWrapper } from "./pageStyle";
import StatusButton from '../components/Buttons/StatusButton';
import CustomButton from '../components/Buttons/CustomButton';
import ExtendButton from '../components/Buttons/ExtendButton';
import CustomChart from '../components/Charts/CustomChart';
import CustomCounter from '../components/Counters/CustomCounter';
import { ReactComponent as Icon_Reorder } from '../assets/Icon_Reorder.svg';
import Cursor_Hand_Open from '../assets/Cursor_Hand_Open.png';
import Cursor_Hand_Hold from '../assets/Cursor_Hand_Hold.png';
import { Grayscale } from 'konva/lib/filters/Grayscale';
import moment from 'moment';
import { filter, toArray } from 'lodash-es';
import { io } from 'socket.io-client';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';

import { historyAPI, getTrainingListAPI, modTrainingListAPI, delTrainingListAPI, stopTaskAPI, getModelInfoAPI, getDatasetListAPI, getAllProjectsAPI } from '../constant/API';
import { selectCurrentTrainInfo } from '../redux/store/slice/currentTrainInfo';
import { socketHost } from '../constant/API/APIPath';
import { selectCurrentTab, setCurrentTab } from '../redux/store/slice/currentTab';
import { selectIteration, setIteration } from '../redux/store/slice/currentIteration';




const Scheduler = forwardRef((props, ref) => {

    const [taskList, setTaskList] = useState([]);
    const [historyList, setHistoryList] = useState([]);
    const [projectId, setProjectId] = useState('');
    const [taskId, setTaskId] = useState('');

    const [currentStep, setCurrentStep] = useState(0);
    const [currentPercent, setCurrentPercent] = useState(0);
    const [currentModelType, setCurrentModelType] = useState('');
    const [currentPlatform, setCurrentPlatform] = useState('');
    const [currentDatasetCount, setCurrentDatasetCount] = useState('');
    const [currentTrainingMethod, setCurrentTrainingMethod] = useState('');
    const [remainingTime, setRemainingTime] = useState('');
    const [startTime, setStartTime] = useState('');

    const [flash, setFlash] = useState(false);

    const [totalStep, setTotalStep] = useState(0);
    const [projectName, setProjectName] = useState('');
    const [noTask, setNoTask] = useState(true);
    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
    const [showStopConfirmModal, setShowStopConfirmModal] = useState(false);
    const [lastIter, setLastIter] = useState('');
    const [allProjectInfo, setAllProjectInfo] = useState([]);

    const [deleteTaskId, setDeleteTaskId] = useState('');
    const [deleteProjectName, setDeleteProjectName] = useState('');
    const [table2HeaderNoShadow,setTable2HeaderNoShadow] = useState(true);
    const [table1HeaderNoShadow,setTable1HeaderNoShadow] = useState(true);

    const navigator = useNavigate();


    const [searchParams, setSearchParams] = useSearchParams();

    const chartRef = useRef();
    const toastRef = useRef();


    const dispatch = useDispatch();

    useImperativeHandle(ref, () => ({

    }));

    const currentTableColumnWidth = [120, 120, 300, 300, 300, 100];
    const historyTableColumnWidth = [];

    const getItemStyle = (isDragging, draggableStyle) => ({
        //...draggableStyle,
        // cursor: isDragging ?  `url(${Cursor_Hand_Open});` :  `url(${Cursor_Hand_Hold});`,
        cursor: 'url(Cursor_Hand_Hold)',
        width: 100,
        backgroundColor: '#ff0000'
    });

    const getDuration = (startTime, endTime) => {

        const mySeconds = Math.round(endTime - startTime);
        const duration = moment.duration(mySeconds, 'seconds');
        const myMin = (duration.seconds() >= 30) ? duration.minutes() + 1 : duration.minutes();
        const myHour = duration.hours();
        return myHour + ' hr ' + myMin + ' min';
    }

    const getProjectName = (myProjectId) => {
        const myProject = filter(allProjectInfo, function (o) { return o.id === myProjectId });
        if (myProject.length > 0) {
            return myProject[0].name;
        } else {
            return 'N/A';
        }
    }

    const getHistoryList = () => {

        historyAPI()
            .then(({ data }) => {
                if (data.status === 200) {

                    const myData = Object.values(data.data.history_list);
                    setHistoryList(myData);

                } else {
                    log('historyAPI-Error', data.message);
                }


            })
            .catch(({ response }) => {

                log('historyAPI-Error', response.data);

            })



    }

    const getTrainingList = () => {

        getTrainingListAPI()
            .then(({ data }) => {

                if (data.status === 200) {

                    if (Object.keys(data.data).length !== 0) {
                        const myData = Object.values(data.data.task_list);
                        //log('getTrainingListAPI-Success', myData);
                        setTaskList(myData)

                        if (myData.length > 0) {
                            setNoTask(false);
                            //log(myData[0]);
                            const myKey = Object.keys(myData[0]).toString();
                            const myProjectId = myData[0][myKey].project_uuid;
                            const myTotalStep = myData[0][myKey].total_step;
                            const myProjectName = myData[0][myKey].project_name;
                            const myIteration = `iteration${myData[0][myKey].iteration}`;

                            //log('task id=', myKey)

                            setProjectId(myProjectId);
                            setTaskId(myKey);
                            setTotalStep(myTotalStep);
                            setProjectName(myProjectName);
                            setLastIter(myIteration);

                            const myProject = filter(allProjectInfo, function (o) { return o.id === myProjectId });
                            if (myProject.length > 0) {
                                //myData[idx].project_name=myProject[0].name;
                                //log('myProject', myProject)
                                setCurrentModelType(myProject[0].type);
                                setCurrentPlatform(myProject[0].platform);
                                setCurrentDatasetCount(myProject[0].totalImgNum);

                            }


                        }
                    } else {
                        setNoTask(true);
                    }


                } else {
                    log('getTrainingListAPI-Error', data.message);

                }

                //dispatch(closeLoading());


            })
            .catch(({ response }) => {

                //dispatch(closeLoading());

                log('getTrainingListAPI-Error', response.data);


                // setShowType(1);
                // setShowText(response.data.message);
                // alertRef.current.setShowTrue(3000);
            })



    }

    const getAllProject = () => {

        getAllProjectsAPI()
            .then(({ data }) => {
                const projectInfo = Object.entries(data.data).map((item) => {
                    const id = item[0];
                    const value = item[1];

                    return {
                        id: id,
                        name: value.project_name,
                        type: value.type,
                        platform: value.platform,
                        coverImg: value.cover_img,
                        effectImgNum: value.effect_img_nums,
                        totalImgNum: value.total_img_nums,
                        iteration: value.iteration,
                        createTime: value.create_time
                    }
                });

                //log('getAllProject', projectInfo)

                setAllProjectInfo(projectInfo)

            })
            .catch(({ message }) => {
                log('getAllProjectsAPI-Error!', message);

            })
    }

    const getModelInfo = (myDatasetId, myLastIter) => {

        //log('upate model info', myDatasetId, myLastIter)

        if ((myDatasetId !== '') && (myLastIter !== '')) {

            const myPayload = {};
            myPayload.iteration = myLastIter;

            getModelInfoAPI(myDatasetId, myPayload)
                .then(({ data }) => {
                    //log('getModelInfoAPI-Success', data.data.training_method);
                    setCurrentTrainingMethod(data.data.training_method);
                })
                .catch((err) => {
                    log('getModelInfoAPI-Err', err);
                })

        }

    };

    const handleStopTask = () => {
        setShowStopConfirmModal(true);
    }

    const handleStopTaskConfirm = () => {
        log('handle stop task!!!')
        setShowStopConfirmModal(false);
        if (taskId !== '') {

            const myPayload = {};
            myPayload.task_uuid = taskId;

            log('myPayload', myPayload)

            stopTaskAPI(myPayload)
                .then(({ data }) => {
                    log('stopTaskAPI-res', data);


                    if (data.status === 200) {
                        // success

                        setStartTime('');
                        setRemainingTime('');
                        chartRef.current.resetLineData();
                        toastRef.current.setMessage(0, `${projectName} has been stop.`);

                    } else {
                        log('stopTaskAPI-Error', data.message);
                    }

                    //dispatch(closeLoading());


                })
                .catch(({ response }) => {

                    //dispatch(closeLoading());

                    log('stopTaskAPI-Error', response.data);
                    // setShowType(1);
                    // setShowText(response.data.message);
                    // alertRef.current.setShowTrue(3000);
                })

        }
    }

    const handleViewTask = () => {
        //log('handle view task!!!')
        dispatch(setIteration(lastIter));
        dispatch(setCurrentTab('Model'));
        navigator(`/main/${currentModelType}/${projectId}`);
    }

    const handleViewDataset = (myProjectId) => {
        log('handle view dataset',myProjectId)
        dispatch(setIteration('workspace'));
        dispatch(setCurrentTab('Dataset'));
        const myProject = filter(allProjectInfo, function (o) { return o.id === myProjectId });

        if (myProject.length > 0) {

            const myDataType=myProject[0].type;
            //log('myDataType',myDataType)
            navigator(`/main/${myDataType}/${myProjectId}`);

        }
        
    }

    const handleHistoryItemClick = (myProjectId, myIteration, myStatus) => {
        log('handle history item click', myProjectId, myIteration, myStatus)

        if (myStatus === 'failed') {
            toastRef.current.setMessage(1, 'Iteration not found');
            return;
        }

        getDatasetListAPI(myProjectId)
            .then(({ data }) => {
                //log('getLastIter-Success', data.data.folder_name);
                const IterArr = filter(data.data.folder_name, function (o) { return o === `iteration${myIteration}` })
                if (IterArr.length > 0) {

                    const myProject = filter(allProjectInfo, function (o) { return o.id === myProjectId });

                    if (myProject.length > 0) {

                        //log('myProject', myProject)
                        //log('myIteration', myIteration)

                        const myType = myProject[0].type
                        dispatch(setIteration(`iteration${myIteration}`));
                        dispatch(setCurrentTab('Model'));
                        navigator(`/main/${myType}/${myProjectId}`);
                    }

                } else {

                    toastRef.current.setMessage(1, 'Iteration not found', myProjectId + '_' + myIteration)

                    log('iteration not found')
                }

            })
            .catch((err) => {
                log('getDatasetListAPI-Err', err);
            })





    }

    const textRef = useRef();

    const handleUpdateStep = (myStep) => {

        setCurrentStep(myStep);

    }

    const handleDeleteTask = (myTaskId, myProjectName) => {

        //log('handle delete task id=', myTaskId, myProjectName)

        setDeleteTaskId(myTaskId);
        setDeleteProjectName(myProjectName);
        setShowDeleteConfirmModal(true);

    }

    const handleDeleteTaskConfirm = () => {

        setShowDeleteConfirmModal(false);

        if (deleteTaskId !== '') {

            delTrainingListAPI({ data: { task_uuid: deleteTaskId } })
                .then(({ data }) => {

                    if (data.status === 200) {
                        log('delTrainingListAPI-Success', data);

                        toastRef.current.setMessage(0, 'Schedule has been deleted.');

                    } else {
                        log('delTrainingListAPI-Error(a)', data);
                    }

                })
                .catch(({ response }) => {

                    log('delTrainingListAPI-Error(b)', response);

                    if (response.status === 400) {

                        toastRef.current.setMessage(1, response.data.message);

                    }
                })

        }
    }


    const handleReorderList = (myData) => {

        // log('handle reorder task list')
        // log(myData)

        const { source, destination, draggableId } = myData;

        // log('source', source)
        // log('destination', destination)

        // 拷貝新的 items (來自 state) 
        let newItems = [...taskList];

        const [remove] = newItems.splice(source.index, 1);

        newItems.splice(destination.index, 0, remove);

        setTaskList(newItems);

        //log('newItems', newItems)


        const myPayload = Object.entries(newItems).map((item) => {
            return Object.keys(item[1]).toString();
        });

        log('myPayload', myPayload)

        modTrainingListAPI({ task_sort: myPayload })
            .then(({ data }) => {

                if (data.status === 200) {
                    log('modTrainingListAPI-Success', data);
                } else {
                    log('modTrainingListAPI-Error', data);
                }

            })
            .catch(({ response }) => {

                log('modTrainingListAPI-Error', response.data);
            })

    }

    useEffect(() => {

        if (allProjectInfo.length > 0) {
            getTrainingList();
            getHistoryList();
        }

    }, [allProjectInfo]);

    useEffect(() => {


        if (projectId !== '') {

            const myProject = filter(allProjectInfo, function (o) { return o.id === projectId });

            if (myProject.length > 0) {

                setCurrentModelType(myProject[0].type);
                setCurrentPlatform(myProject[0].platform);
                setCurrentDatasetCount(myProject[0].totalImgNum);


            }
        }

    }, [projectId]);

    const resetEffect = () => {

        log('reset effect')

    }


    useEffect(() => {

        getAllProject();



    }, []);

    useEffect(() => {
        if (searchParams.get('new') === 'true') {
            setFlash(true);
        }
        const timer = setTimeout(() => {
            setFlash(false);
        }, 5000);
        return () => clearTimeout(timer);
    }, []);


    useEffect(() => {

        const socket = io(`${socketHost}/schedule`);

        socket.on('connect', () => {
            //log('Connected to the server');
        });

        socket.on('task_sort', (message) => {


            const myTaskList = JSON.parse(message).task_sort;

            if (myTaskList.length === 0) {

                setNoTask(true);

            } else {

                setNoTask(false);
                setTaskList(myTaskList);
                setCurrentStep(0);

                const myKey = Object.keys(myTaskList[0]).toString();
                const myTotalStep = myTaskList[0][myKey].total_step;
                const myProjectId = myTaskList[0][myKey].project_uuid;
                const myProjectName = myTaskList[0][myKey].project_name;

                setTotalStep(myTotalStep);
                setProjectId(myProjectId);
                setProjectName(myProjectName);
                setTaskId(myKey)

                //getLastIter(myProjectId, false);


            }
        })

        socket.on('error_msg', (message) => {


            const error_msg = JSON.parse(message);

            const myTaskId=error_msg.task_uuid;
            const myProjectName=error_msg.project_name;
            const myMessage=error_msg.error_msg;

            toastRef.current.setMessage(1, `${myProjectName} : ${myMessage}`,myTaskId);

            //log('error_msg',error_msg);

          
        })

        socket.on('training_data_status', (message) => {

            log('training_data_status=====>', message)

            const myIter = JSON.parse(message).iteration;

            setLastIter(`iteration${myIter}`);



        })

        // 在組件卸載時斷開連接
        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {

        const socket = io(`${socketHost}/history`);

        socket.on('connect', () => {
            //log('Connected to the server');
        });

        socket.on('get_history', (message) => {

            const myHistoryList = toArray(JSON.parse(message));
            setHistoryList(myHistoryList)

        })

        // 在組件卸載時斷開連接
        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {

        if (projectId !== '') {
            const socket = io(`${socketHost}/${projectId}/log`);

            socket.on('connect', () => {
                log('Connected to the remaining time log');
            });

            socket.on('remaining_time', (message) => {

                //log('remaining time =', message)
                const duration = moment.duration(parseInt(message), 'seconds');
                const myMin = (duration.seconds() >= 30) ? duration.minutes() + 1 : duration.minutes();
                const myHour = duration.hours();
                setRemainingTime(myHour + 'hr ' + myMin + 'min.');

            })

            // 在組件卸載時斷開連接
            return () => {
                socket.disconnect();
            };
        }

    }, [projectId]);

    useEffect(() => {


        const socket = io(`${socketHost}/progress`);

        socket.on('connect', () => {
            //log('Connected to the server');
        });

        socket.on('get_info', (message) => {

            //log('progress =', message)

            const myData = JSON.parse(message);

            if (projectId === myData.project_uuid) {

                //log('set start time',myData.start_time)

                if (startTime === '') {

                    const myStartTime = moment.unix(Math.round(myData.start_time)).format('hh:mm A');
                    setStartTime(myStartTime);
                }

            }

            // const duration = moment.duration(1000, 'seconds');
            // const myMin = (duration.seconds() >= 30) ? duration.minutes() + 1 : duration.minutes();
            // const myHour = duration.hours();
            // setRemainingTime(myHour + 'hr ' + myMin + 'min.');


        })

        // 在組件卸載時斷開連接
        return () => {
            socket.disconnect();
        };


    }, [projectId]);

    useEffect(() => {

        if (chartRef.current) chartRef.current.resetLineData();


    }, [taskId]);

    useEffect(() => {

        getModelInfo(projectId, lastIter);

    }, [projectId, lastIter]);



    return (
        <>
            <SchedulerHeadContainer noOverFlow={true}>
                <SchedulerHeadWrapper>
                    <div className="my-scheduler-title">Scheduler</div>

                    <div style={{ position: 'relative', height: 86 }}>
                        <div style={{ position: 'absolute', top: 5 }}>

                            <ul className="nav nav-tabs flex-nowrap" id="myTab" role="tablist">
                                <li className="nav-item" role="presentation">
                                    <button className="my-nav-link roboto-h4 active" id="current-tab" data-bs-toggle="tab" data-bs-target="#current" type="button" role="tab" aria-controls="info" aria-selected="true" onClick={() => setFlash(false)}>Current</button>

                                </li>
                                <li className="nav-item" role="presentation">
                                    <button className="my-nav-link roboto-h4" id="history-tab" data-bs-toggle="tab" data-bs-target="#history" type="button" role="tab" aria-controls="log" aria-selected="false">History</button>
                                </li>
                            </ul>

                        </div>
                    </div>

                </SchedulerHeadWrapper>
            </SchedulerHeadContainer>

            <SchedulerBodyContainer noOverFlow={true} >
                <SchedulerBodyWrapper>

                    <div className="tab-content" id="myTabContent">
                        <div className="tab-pane fade show active" id="current" role="tabpanel" aria-labelledby="current-tab">
                            {
                                noTask ?
                                    <div className='d-flex flex-column justify-content-center align-items-center' style={{ width: 1200, height: 500 }}>
                                        <div style={{ fontSize: 22, color: '#000000', fontWeight: 500, fontFamily: 'Roboto' }}>No training schedule.</div>
                                        <div style={{ fontSize: 18, color: '#979CB5', fontWeight: 300, fontFamily: 'Roboto' }}>Please start training from project.</div>

                                    </div>
                                    :
                                    <div className='my-tab-container d-flex flex-row justify-content-between'>

                                        <div className='my-training-panel d-flex flex-column' style={{ backgroundColor: 'white' }}>
                                            <div className='my-training-panel-section-1'>
                                                <div className='d-flex flex-column' style={{ padding: 24 }}>
                                                    <div className='d-flex flex-row justify-content-between' style={{ fontWeight: 500, fontSize: 22 }}>

                                                        <div style={{ width: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                            <CustomTooltip customClassName=''>
                                                                {projectName}
                                                            </CustomTooltip>
                                                        </div>

                                                        <CustomCounter currentStep={currentStep} totalStep={totalStep} updatePercent={(myPercent) => setCurrentPercent(myPercent)}></CustomCounter>
                                                    </div>
                                                    <div className='d-flex flex-row justify-content-between' style={{ paddingTop: 15, paddingBottom: 15 }}>
                                                        <Stack spacing={12} sx={{ flex: 1 }}>
                                                            <LinearProgress determinate value={currentPercent} size="lg" />
                                                        </Stack>
                                                    </div>
                                                    <div className='d-flex flex-row justify-content-between' style={{ fontWeight: 400, fontSize: 13, color: '#000000D9', fontFamily: 'Roboto' }}>
                                                        <div>Started at {startTime}</div>
                                                        <div>{remainingTime} left</div>
                                                    </div>
                                                    <div className='d-flex flex-row justify-content-between' style={{ paddingTop: 15, paddingBottom: 0 }}>
                                                        <div><CustomButton name="stop" width={116} height={32} onClick={handleStopTask} /></div>
                                                        <div><CustomButton name="view" width={116} height={32} onClick={handleViewTask} /></div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='my-training-panel-section-2'>
                                                <CustomChart datasetId={projectId} lastIter={lastIter} totalStep={parseInt(totalStep)} dataType={currentModelType} updateStep={handleUpdateStep} ref={chartRef} />

                                            </div>
                                            <div className='my-training-panel-section-3'>
                                                <div className='d-flex flex-column' style={{ padding: '24px 20px' }}>
                                                    <div className='d-flex flex-row justify-content-between' style={{ fontWeight: 500, fontSize: 22, paddingBottom: 5 }}>
                                                        <div>Information</div>
                                                    </div>

                                                    <div className='d-flex flex-row justify-content-start' style={{ fontFamily: 'Roboto', borderBottom: '1px solid #0000001F', paddingLeft: 8 }}>
                                                        <div className='d-flex align-items-center' style={{ fontSize: 14, color: '#979CB5', width: 120, height: 34, paddingTop: 3 }}>Model type</div>
                                                        <div className='d-flex align-items-center' style={{ fontSize: 14, color: '#16272E', paddingTop: 3 }}>{currentModelType}</div>
                                                    </div>
                                                    <div className='d-flex flex-row justify-content-start' style={{ fontFamily: 'Roboto', borderBottom: '1px solid #0000001F', paddingLeft: 8 }}>
                                                        <div className='d-flex align-items-center' style={{ fontSize: 14, color: '#979CB5', width: 120, height: 34, paddingTop: 3 }}>Platform</div>
                                                        <div className='d-flex align-items-center' style={{ fontSize: 14, color: '#16272E', paddingTop: 3 }}>{currentPlatform}</div>
                                                    </div>
                                                    <div className='d-flex flex-row justify-content-start' style={{ fontFamily: 'Roboto', borderBottom: '1px solid #0000001F', paddingLeft: 8 }}>
                                                        <div className='d-flex align-items-center' style={{ fontSize: 14, color: '#979CB5', width: 120, height: 34, paddingTop: 3 }}>Dataset count</div>
                                                        <div className='d-flex align-items-center' style={{ fontSize: 14, color: '#16272E', paddingTop: 3 }}>{currentDatasetCount}</div>
                                                    </div>
                                                    <div className='d-flex flex-row justify-content-start' style={{ fontFamily: 'Roboto', borderBottom: '1px solid #0000001F', paddingLeft: 8 }}>
                                                        <div className='d-flex align-items-center' style={{ fontSize: 14, color: '#979CB5', width: 120, height: 34, paddingTop: 3 }}>Training method</div>
                                                        <div className='d-flex align-items-center' style={{ fontSize: 14, color: '#16272E', paddingTop: 3 }}>{currentTrainingMethod}</div>
                                                    </div>

                                                </div>
                                            </div>

                                        </div>



                                        <div className='my-table' style={{ width: 880, height: 662 }}>
                                            <div className={(table1HeaderNoShadow)?'my-thead':'my-thead-shadow'}>
                                                <div className='my-thead-th' style={{ width: currentTableColumnWidth[0] }}></div>
                                                <div className='my-thead-th' style={{ width: currentTableColumnWidth[1] }}>Order</div>
                                                <div className='my-thead-th' style={{ width: currentTableColumnWidth[2] }}>Project name</div>
                                                <div className='my-thead-th' style={{ width: currentTableColumnWidth[3] }}>Status</div>
                                                <div className='my-thead-th' style={{ width: currentTableColumnWidth[4] }}>Step</div>
                                                <div className='my-thead-th' style={{ width: currentTableColumnWidth[5] }}></div>
                                            </div>
                                            <div className='my-tbody'  onScroll={(e)=>{
                                        if (e.target.scrollTop === 0) {
                                                //console.log('滾動在頂部');
                                                setTable1HeaderNoShadow(true);
                                          } else {
                                                //console.log('滾動不在頂部');
                                                setTable1HeaderNoShadow(false);
                                          }
                                        
                                        }}>

                                                <DragDropContext

                                                    onDragEnd={handleReorderList}
                                                >

                                                    <Droppable droppableId="drop-id">
                                                        {(provided, snapshot) => (
                                                            <div ref={provided.innerRef} {...provided.droppableProps}>
                                                                {taskList.map((item, i) => (

                                                                    (i === 0) ?
                                                                        <div className='my-tbody-row' key={Object.keys(item).toString()} onClick={handleViewTask}>
                                                                            <div className='my-tbody-td' style={{ width: currentTableColumnWidth[0] }}></div>
                                                                            <div className='my-tbody-td' style={{ width: currentTableColumnWidth[1] }}>1</div>
                                                                            <div className='my-tbody-td' style={{ width: currentTableColumnWidth[2], overflow: 'hidden', textOverflow: 'ellipsis' }} >
                                                                                <CustomTooltip customClassName=''>
                                                                                    {item[Object.keys(item)].project_name}
                                                                                </CustomTooltip>
                                                                            </div>
                                                                            <div className='my-tbody-td' style={{ width: currentTableColumnWidth[3] }}><StatusButton name="training" /></div>
                                                                            <div className='my-tbody-td' style={{ width: currentTableColumnWidth[4] }}>{currentStep}/{item[Object.keys(item)].total_step}</div>
                                                                            <div className='my-tbody-td' style={{ width: currentTableColumnWidth[5] }}></div>
                                                                        </div>
                                                                        :
                                                                        <div key={Object.keys(item).toString()} >
                                                                            <Draggable draggableId={Object.keys(item).toString()} index={i}>
                                                                                {(provided, snapshot) => (
                                                                                    <div
                                                                                        {...provided.draggableProps}
                                                                                        ref={provided.innerRef}

                                                                                    >
                                                                                        {/* <div className={((i === (taskList.length - 1)) && (flash)) ? 'my-tbody-row flash-element' : 'my-tbody-row'} style={{ backgroundColor: (i % 2 === 1) ? '#F8F8F8' : '#FFFFFF' }} task_uuid={Object.keys(item)}> */}
                                                                                        <div className={((i === (taskList.length - 1)) && (flash)) ? `my-tbody-row-${(i % 2 === 1) ? "1" : "2"} flash-element` : `my-tbody-row-${(i % 2 === 1) ? "1" : "2"}`} task_uuid={Object.keys(item)} style={(snapshot.isDragging) ? { backgroundColor: '#F2FAFF',border:'1px solid #16272E3D',boxShadow: '0px 2px 12px #00000033' } : {}} onClick={()=>handleViewDataset(item[Object.keys(item)].project_uuid)}>
                                                                                            <div className='my-tbody-td d-flex justify-content-center' style={{ width: currentTableColumnWidth[0] }}  {...provided.dragHandleProps}>
                                                                                                <Icon_Reorder fill={(snapshot.isDragging) ? '#16272E' : '#16272E2E'} />
                                                                                            </div>
                                                                                            <div className='my-tbody-td' style={{ width: currentTableColumnWidth[1] }} >{i + 1}</div>
                                                                                            <div className='my-tbody-td' style={{ width: currentTableColumnWidth[2], overflow: 'hidden', textOverflow: 'ellipsis' }} >
                                                                                                <CustomTooltip customClassName=''>
                                                                                                    {item[Object.keys(item)].project_name}
                                                                                                </CustomTooltip>
                                                                                            </div>
                                                                                            <div className='my-tbody-td' style={{ width: currentTableColumnWidth[3] }}>
                                                                                                <StatusButton name="waiting" />
                                                                                            </div>
                                                                                            <div className='my-tbody-td' style={{ width: currentTableColumnWidth[4], fontWeight: 300 }}>0/{item[Object.keys(item)].total_step}</div>
                                                                                            <div className='my-tbody-td' style={{ width: currentTableColumnWidth[5] }}><ExtendButton type={1} uuid={Object.keys(item).toString()} projectName={item[Object.keys(item)].project_name} onDeleteTask={handleDeleteTask} /></div>
                                                                                        </div>
                                                                                    </div>
                                                                                )}
                                                                            </Draggable>
                                                                        </div>
                                                                ))}
                                                                {provided.placeholder}
                                                            </div>
                                                        )}
                                                    </Droppable>

                                                </DragDropContext>


                                            </div>
                                        </div>
                                    </div>
                            }
                        </div>
                        <div className="tab-pane fade" id="history" role="tabpanel" aria-labelledby="history-tab" style={{ backgroundColor: 'red' }}>
                            <div className='my-tab-container'>

                                <div className='my-table'>
                                    <div className={(table2HeaderNoShadow)?'my-thead':'my-thead-shadow'}>
                                        <div className='my-thead-th'>Project name</div>
                                        <div className='my-thead-th'>Iteration</div>
                                        <div className='my-thead-th'>Status</div>
                                        <div className='my-thead-th'>Duration</div>
                                        <div className='my-thead-th'>End time</div>
                                    </div>
                                    <div className='my-tbody' onScroll={(e)=>{
                                        if (e.target.scrollTop === 0) {
                                                //console.log('滾動在頂部');
                                                setTable2HeaderNoShadow(true);
                                          } else {
                                                //console.log('滾動不在頂部');
                                                setTable2HeaderNoShadow(false);
                                          }
                                        
                                        }}>



                                    {
                                        historyList.sort((a, b) => b.end_time - a.end_time).map((item, idx) => (

                                            <div className='my-tbody-row' key={idx} style={{ cursor: 'pointer' }} onClick={() => handleHistoryItemClick(item.project_uuid, item.iteration, item.task_status.toLowerCase())}>


                                                <div className='my-tbody-td' style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    <CustomTooltip customClassName=''>
                                                        {getProjectName(item.project_uuid)}
                                                    </CustomTooltip>
                                                </div>
                                                <div className='my-tbody-td'>{item.iteration}</div>
                                                <div className='my-tbody-td'><StatusButton name={item.task_status.toLowerCase()} /></div>
                                                <div className='my-tbody-td'>{getDuration(item.start_time, item.end_time)}</div>
                                                <div className='my-tbody-td'>{moment.unix(Math.round(item.end_time)).format('YYYY/MM/DD HH:mm')}</div>
                                            </div>

                                        ))

                                    }

                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </SchedulerBodyWrapper>
        </SchedulerBodyContainer >




            <Modal
                open={showDeleteConfirmModal}
            >
                <ModalDialog
                    sx={{ minWidth: 500, maxWidth: 500, minHeight: 360, maxHeight: 360 }}
                >
                    <div className='container-fluid'>
                        <div className='row'>
                            <div className='col-12 p-0 my-dialog-title'>
                                <div>
                                    Delete training schedule?
                                </div>

                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-12 p-0 my-dialog-parameter'>
                                <div style={{ paddingTop: 24, fontSize: 16, color: '#16272E' }}>
                                    {deleteProjectName} training schedule will be deleted.
                                </div>

                            </div>
                        </div>

                        <div className='row'>
                            <div className='col-12 d-flex justify-content-end' style={{ padding: 0 }}>
                                <div style={{ paddingTop: 163 }} className='d-flex gap-3'>
                                    <CustomButton name="cancel" onClick={() => {
                                        setShowDeleteConfirmModal(false);
                                    }} />
                                    <CustomButton name="delete" onClick={handleDeleteTaskConfirm} />

                                </div>
                            </div>
                        </div>
                    </div>
                </ModalDialog>
            </Modal>



            <Modal
                open={showStopConfirmModal}
            >
                <ModalDialog
                    sx={{ minWidth: 500, maxWidth: 500, minHeight: 360, maxHeight: 360 }}
                >
                    <div className='container-fluid'>
                        <div className='row'>
                            <div className='col-12 p-0 my-dialog-title'>
                                <div>
                                    Stop training schedule?
                                </div>

                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-12 p-0 my-dialog-parameter'>
                                <div style={{ paddingTop: 24, fontSize: 16, color: '#16272E' }}>
                                    {projectName} training schedule will be stoped.
                                </div>

                            </div>
                        </div>

                        <div className='row'>
                            <div className='col-12 d-flex justify-content-end' style={{ padding: 0 }}>
                                <div style={{ paddingTop: 163 }} className='d-flex gap-3'>
                                    <CustomButton name="cancel" onClick={() => {
                                        setShowStopConfirmModal(false);
                                    }} />
                                    <CustomButton name="stop-dialog" onClick={handleStopTaskConfirm} />

                                </div>
                            </div>
                        </div>
                    </div>
                </ModalDialog>
            </Modal>

            <CustomToast ref={toastRef}></CustomToast>



        </>

    );
});

export default Scheduler;
