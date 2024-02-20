import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ResGetMetricsType, toGetMetricsAPI, getModelInfoAPI, getCurveAPI, checkBestModelAPI, ResGetModelInfoType } from '../../../constant/API';
import { setIteration } from '../../../redux/store/slice/currentIteration';
import { selectIsTraining, setIsTraining } from '../../../redux/store/slice/isTraining';
import { selectCurrentTab, setCurrentTab } from '../../../redux/store/slice/currentTab';
import { selectCurrentTrainInfo, setCurrentTrainInfo } from '../../../redux/store/slice/currentTrainInfo';
import { projectTrainStatusAPI } from '../../../constant/API/trainAPI';
import { createAlertMessage } from '../../../redux/store/slice/alertMessage';
import { customAlertMessage } from '../../../utils/utils';
import { closeLoading, openLoading } from '../../../redux/store/slice/loading';

type StatusType = {
    [key: string]: number
}

//確認為何不能用props寫就可刪
export type UseAPIModeDataPropsType = {
    lastIter: string;
    datasetId: string;
    dataType: string;
    currentIter: string;
    setInfo: (data: ResGetModelInfoType) => void;
};

export type SocketGraphType = {
    step: number;
    status: {
        [key: string]: number
    }
};

//API部分用trainingStatus來判斷，切換時API資料就不會出現，所以先拿掉

export type idTrainStatusType = {
    iteration: string,
    status: boolean
};


export const useGetCurrTrainInfo = () => {

    //console.log('get current training info...')

    const dispatch = useDispatch();

    const getCurrTrainingInfo = useCallback(() => {
        projectTrainStatusAPI()
            .then(({ data }) => {

                dispatch(setCurrentTrainInfo(data.data))
            })
            .catch((err) => {
                console.log('useAllProjectInit-Error', err);
            })

    }, [dispatch]);


    return {
        getCurrTrainingInfo
    }


}


export const useAPIModelInit = (
    lastIter: string,
    datasetId: string,
    currentIter: string,
    setInfo: (data: any) => void,
    setLabels: (data: number[]) => void
) => {
    //const { lastIter, datasetId, setInfo, dataType, currentTab, currentIter } = props;

    
    const dispatch = useDispatch();
    const metricsRef = useRef<any | null>(null);
    const infoRef = useRef<any | null>(null);
    const bestModelRef = useRef<any | null>(null);
    const [metrics, setMetrics] = useState<ResGetMetricsType>({ precision: 0, recall: 0, other: 0 });

    const trainingStatus = useSelector(selectIsTraining).isTraining;


    //因不管是否在training都會有Info的資料，所以和其他分開
    const getModelInfo = useCallback(() => {
        const sameIter = { iteration: currentIter };
        const theLastIter = { iteration: lastIter };

        getModelInfoAPI(datasetId, currentIter === 'workspace' ? theLastIter : sameIter)
            .then(({ data }) => {

                infoRef.current = true;
                setInfo(data.data);
                //把step數字作成chart label
                const stepList = Array.from({ length: data.data.step }, (_, i) => i + 1);
                setLabels(stepList);
            })
            .catch((err) => {
                infoRef.current = false;
                console.log('getModelInfoAPI', err)
            })

    }, [currentIter, datasetId, lastIter, setInfo, setLabels, trainingStatus])

    const getMetricsAndBest = useCallback(() => {

        const sameIter = { iteration: currentIter };
        const theLastIter = { iteration: lastIter };

        if (currentIter === 'workspace') dispatch(setIteration(lastIter));


        Promise.allSettled([toGetMetricsAPI(datasetId, currentIter === 'workspace' ? theLastIter : sameIter),
        checkBestModelAPI(datasetId, currentIter === 'workspace' ? theLastIter : sameIter)
        ]).then((res) => {

            console.log('(1) checkBestModelAPI',res)

            const metricsAPIData = res[0];
            const bestAPIData = res[1];

            //沒有bestModel, metrics就不顯示，但有可能單獨只有bestModel
            if (bestAPIData.status === 'fulfilled') {
                bestModelRef.current = true;
                if (metricsAPIData.status === 'fulfilled') {
                    metricsRef.current = true
                    setMetrics(metricsAPIData.value.data.data);
                }
            } else {
                metricsRef.current = false;
                bestModelRef.current = false;
            }

        })

    }, [currentIter, datasetId, dispatch, lastIter])


    useEffect(() => {
        getModelInfo();
        getMetricsAndBest();
        bestModelRef.current = null;
        metricsRef.current = null;
        infoRef.current = null;

    }, [getMetricsAndBest, getModelInfo]);

    //原先的參數getMetricsAndBest, getModelInfo, trainData, trainingStatus
    //透過在stop or done Model 重新拿getMetricsAndBest，來取代非必要的參數

    return {
        metricsRef,
        infoRef,
        bestModelRef,
        metrics,
        getMetricsAndBest,
        getModelInfo
    };
}

//拿掉trainingStatus 停留畫面train結束不會更新log!!!!
export const useAPICurveAndLog = (
    lastIter: string,
    datasetId: string,
    currentIter: string,
    trainingStatus: string
) => {
    // const { lastIter, datasetId, setInfo, dataType, currentTab, currentIter } = props;



    const currentTab = useSelector(selectCurrentTab).tab;
    const dispatch = useDispatch();
    const curveRef = useRef<any | null>(null);
    const [logData, setLogData] = useState<any>({});
    const [curveData, setCurveData] = useState<StatusType[]>([]);

    const getCurveAndLog = useCallback(() => {
        const sameIter = { iteration: currentIter };
        const theLastIter = { iteration: lastIter };

        if (currentIter === 'workspace') dispatch(setIteration(lastIter));

        getCurveAPI(datasetId, currentIter === 'workspace' ? theLastIter : sameIter)
            .then(({ data }) => {
                
                curveRef.current = true;
                const status = Object.keys(data.data).map((v) => data.data[v].status)
                setLogData(data);
                setCurveData(status)
            })
            .catch((err) => {
                //console.log('getCurveAPI-Err', err);
                //curveRef.current = false;

                //setLogData([]);
                //setCurveData([])
            })

    }, [currentIter, datasetId, dispatch, lastIter])


    useEffect(() => {
        if (currentTab !== 'Model') return;
        curveRef.current = null;
        getCurveAndLog();
    }, [currentTab, getCurveAndLog, trainingStatus]);


    return {
        curveRef,
        logData,
        curveData,
        getCurveAndLog
    };
}


export const useSocketGraphData = (ws: any) => {

    const [socketGraph, setSocketGraph] = useState<any>(null);

    const graphListener = (...message: any) => {
        if (message) {
            const curveData = JSON.parse(message);
            setSocketGraph(curveData)
        }
    }

    useEffect(() => {
        //連線成功設定監聽
        if (ws) {
            ws.on('curve', graphListener);
        }

        return () => {
            if (ws) {
                ws.removeAllListeners(['curve']);
                setSocketGraph(null)
            }
        }
    }, [ws])

    return {
        socketGraph
    };
}


export const useSocketLogData = (ws: any) => {
    const dispatch = useDispatch();
    const { getCurrTrainingInfo } = useGetCurrTrainInfo();
    const [socketLog, setSocketLog] = useState<string[]>([]);
    const firstAlertRef = useRef<any | null>(null);

    const listenLogSocket = useCallback(() => {

        ws.on('log', (message: any) => {

            //console.log('socket io =>',message)

            if (message) {
                setSocketLog((curr) => { return [...curr, message] });
                if (message.includes('Ending...')) {
                    dispatch(openLoading())
                    dispatch(setIsTraining('done'));
                    setTimeout((() => {
                        getCurrTrainingInfo()
                        dispatch(closeLoading());
                    }), 8000)
                }

                if (message.includes('out of memory') || message.includes('No best model')) {
                    if (message.includes('out of memory')) {
                        firstAlertRef.current = true;
                        dispatch(createAlertMessage(customAlertMessage('error', 'Out of memory')));
                    } else {
                        if (!firstAlertRef) dispatch(createAlertMessage(customAlertMessage('error', message)));
                    }
                    dispatch(openLoading())
                    //馬上改成stop，在Main重拉的dataset跟iterList會有問題
                    setTimeout((() => {
                        dispatch(setIsTraining('stop'));
                        dispatch(setCurrentTab("Dataset"));
                        dispatch(setIteration('workspace'));
                        getCurrTrainingInfo();
                        dispatch(closeLoading());
                    }), 8000)
                }
            }
        });
    }, [dispatch, getCurrTrainingInfo, ws])


    useEffect(() => {
        //連線成功設定監聽
        if (ws?.connected) {
            listenLogSocket();
        }

        return (() => {
            if (ws) {
                ws.removeAllListeners(['log'])
            }
        })

    }, [listenLogSocket, ws])

    return {
        socketLog,
        listenLogSocket
    };
}


export type DatasetsType = {
    label: string,
    data: number[],
    borderColor: string,
    backgroundColor: string,
    lineTension?: number,
}

export const useCurveDataResult = (
    ws: any,
    lastIter: string,
    datasetId: string,
    currentIter: string,
    trainingStatus: string,
    dataType: string
) => {
    //負責判斷training情況，return chartConfig updateData
    const trainData = useSelector(selectCurrentTrainInfo).currTrain;
    const { curveData } = useAPICurveAndLog(lastIter, datasetId, currentIter, trainingStatus)
    const { socketGraph } = useSocketGraphData(ws);

    const classTrain = useMemo(() => {
        return [
            {
                label: 'loss',
                data: [],
                borderColor: '#E61F23',
                backgroundColor: '#E61F23',
            },
            {
                label: 'acc',
                data: [],
                borderColor: '#57B8FF',
                backgroundColor: '#57B8FF',
            },
        ]
    }, [])

    const objTrain = useMemo(() => {
        return [
            {
                label: 'avg_loss',
                data: [],
                borderColor: '#E61F23',
                backgroundColor: '#E61F23',
            }
        ]
    }, [])

    const classVal = useMemo(() => {
        return [
            {
                label: 'val_loss',
                data: [],
                borderColor: '#E61F23',
                backgroundColor: '#E61F23',
            },
            {
                label: 'val_acc',
                data: [],
                borderColor: '#57B8FF',
                backgroundColor: '#57B8FF',
            }
        ]
    }, [])

    const objVal = useMemo(() => {
        return [
            {
                label: 'mAP',
                data: [],
                borderColor: '#E61F23',
                backgroundColor: '#E61F23',
            }
        ]
    }, [])


    const trainRefInit = useCallback(() => {
        if (dataType === 'classification') return (classTrain)
        else return (objTrain)
    }, [classTrain, dataType, objTrain])

    const valRefInit = useCallback(() => {
        if (dataType === 'classification') return (classVal);
        else return (objVal);
    }, [classVal, dataType, objVal]);

    // //出去再回來要歸類在socket，然後socket要把API資料當作config傳出去
    const theChartConfig = useMemo(() => {
        //代表有在train，但最一開始會先回空的API[]，因為TRAIN-Curr還沒去拿

        if (trainData[datasetId]) {
            if (curveData.length > 0) {
                return curveData
            } else {
                //剛開始只有socket沒有api的時候，會有短暫的null，用來設圖的config
                if (socketGraph === null) {
                    return {
                        trainConfig: trainRefInit(),
                        valConfig: valRefInit()
                    }
                }
                //有socket但訓練結束不需丟這個資料過去
                if (Object.keys(socketGraph).includes('precision')) return curveData;
                return socketGraph?.status
            }
        } else {
            return curveData
        }
    }, [curveData, datasetId, socketGraph, trainData, trainRefInit, valRefInit])


    return {
        theChartConfig,//不管什麼情況就是拿來當config因為已經篩選過條件
        socketGraph,//負責拿來當update的資料
    }
}


