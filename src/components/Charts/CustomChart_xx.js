import React, { useState, forwardRef, useEffect, useImperativeHandle, useRef, useContext, useCallback } from "react";
import { Line } from 'react-chartjs-2';
import { filter } from 'lodash-es';
import log from "../../utils/console";
import CustomButton from '../../components/Buttons/CustomButton';
import { WsContext } from '../../layout/logIn/LoginLayout';
import { useAPIModelInit, useCurveDataResult, useAPICurveAndLog } from '../../pages/model/hook/useModelData';
import { getCurveAPI, getDatasetListAPI } from '../../constant/API';

import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentTrainInfo } from '../../redux/store/slice/currentTrainInfo';
import { selectIsTraining } from "../../redux/store/slice/isTraining";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Decimation,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Decimation
);


const CustomChart = forwardRef((props, ref) => {

    const [inputValue, setInputValue] = useState('');
    const [warnning, setWarnning] = useState(false);
    // const { ref1, ref2 } = ref;

    const [chartType, setChartType] = useState('train');
    const [chartTrain, setChartTrain] = useState([]);
    const [chartVal, setChartVal] = useState([]);

    const [lastIter, setLastIter] = useState('');


    const [curveData, setCurveData] = useState([]);

    const inputRef = useRef();

    // const lastIter = 'iteration1';
    // const datasetId = '0982dfa7-7190-4e2e-b5b8-3dcceca28a3b';
    const dataType = 'object_detection';
    //const dataType = 'classification';
    // const currentIter = 'iteration1';



    const datasetId = props.trainingId;


    const { ws, convertId } = useContext(WsContext);

    const trainRef = useRef(null);
    const valRef = useRef(null);

    const trainChart = trainRef.current;
    const valChart = valRef.current;

    const InfoInit = {
        model: '',
        batch_size: 0,
        step: 0,
        input_shape: [],
        spend_time: 0,
        training_method: '',
        gpu: [],
        effect_img_nums: 0
    }

    // const { theChartConfig, socketGraph } = useCurveDataResult(
    //     ws,
    //     lastIter,
    //     datasetId,
    //     currentIter,
    //     trainingStatus,
    //     dataType
    // )


    const [info, setInfo] = useState(InfoInit);
    const [labels, setLabels] = useState([]);




    // const { getMetricsAndBest, infoRef, bestModelRef, metricsRef, metrics } = useAPIModelInit(lastIter, datasetId, currentIter, setInfo, setLabels);

    const theDecimation = {
        enabled: true,
        algorithm: "lttb",
        samples: 50
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
            },
            decimation: theDecimation,
        },
        scales: {
            y: {
                beginAtZero: false,
                ticks: {
                    font: {
                        size: 10,

                    },
                    color: '#979CB5'
                },
            },
            x: {
                beginAtZero: false,
                ticks: {
                    // stepSize: 5000,
                    // min: 0,
                    max: labels.length,
                    // maxRotation: 0,
                    autoSkip: true,
                    font: {
                        size: 10
                    },
                    color: '#979CB5'
                },

            },

        },
        pointRadius: labels.length >= 40 ? 0 : 1,
        borderWidth: 3,
        pointHoverRadius: 4,
        animation: {
            duration: 0
        },
        parsingOptions: {
            parsing: false
        },
    };


    //如果先篩選是哪個btn才update，另一個圖的update會不即時，所以先拿掉
    const handelClassUpdate = () => {
        // if (!hasTraining) return;

        if (!trainChart?.data) return;
        //trainRef
        const classLoss = trainChart.data.datasets[0].data;
        //classLoss.push(socketGraph.status.loss);
        const classAcc = trainChart.data.datasets[1].data;
        //classAcc.push(socketGraph.status.acc);

        trainRef.current.update('none');

        if (!valChart?.data) return;
        //valRef
        const classValLoss = valChart.data.datasets[0].data;
        //classValLoss.push(socketGraph.status.val_loss);
        const classValAcc = valChart.data.datasets[1].data;
        //classValAcc.push(socketGraph.status.val_acc);
        valRef.current.update('none');

    }

    const handelObjUpdate = () => {
        // if (!hasTraining) return;

        if (!trainChart?.data) return;
        //trainRef
        const curObjTrain = trainChart.data.datasets[0].data;
        //curObjTrain.push(socketGraph.status.avg_loss);
        trainRef.current.update('none');

        if (!valChart?.data) return;
        //valRef
        const curObjVal = valChart.data.datasets[0].data;
        //curObjVal.push(socketGraph.status.mAP);
        valRef.current.update('none');

    }


    const handleDatasets = useCallback((data) => {

        log('handle datasets  --->')
        log(data)

        const lossList = [];
        const accList = [];
        const valLossList = [];
        const valAccList = [];

        if (dataType === 'classification') {
            Object.keys(data).forEach((v) => {
                if (data[Number(v)] && data[Number(v)].loss) lossList.push(data[Number(v)].loss);
                if (data[Number(v)] && data[Number(v)].acc) accList.push(data[Number(v)].acc);
                if (data[Number(v)] && data[Number(v)].val_loss) valLossList.push(data[Number(v)].val_loss);
                if (data[Number(v)] && data[Number(v)].val_acc) valAccList.push(data[Number(v)].val_acc);

                setChartTrain([
                    {
                        label: 'loss',
                        data: lossList,
                        borderColor: '#E61F23',
                        backgroundColor: '#E61F23',
                        lineTension: 0.2
                    },
                    {
                        label: 'acc',
                        data: accList,
                        borderColor: '#57B8FF',
                        backgroundColor: '#57B8FF',
                        lineTension: 0.2
                    }
                ]);
                setChartVal([
                    {
                        label: 'val_loss',
                        data: valLossList,
                        borderColor: '#E61F23',
                        backgroundColor: '#E61F23',
                        lineTension: 0.2
                    },
                    {
                        label: 'val_acc',
                        data: valAccList,
                        borderColor: '#57B8FF',
                        backgroundColor: '#57B8FF',
                        lineTension: 0.2
                    }
                ]);
            })

        } else {
            Object.keys(data).forEach((v) => {
                lossList.push(data[Number(v)].avg_loss);
                accList.push(data[Number(v)].mAP);
                setChartTrain([
                    {
                        label: 'avg_loss',
                        data: lossList,
                        borderColor: '#E61F23',
                        backgroundColor: '#E61F23',
                        lineTension: 0.2
                    }
                ]);
                setChartVal([
                    {
                        label: 'mAP',
                        data: accList,
                        borderColor: '#E61F23',
                        backgroundColor: '#E61F23',
                        lineTension: 0.2
                    }
                ]);
            })
        }

        if (dataType === 'classification') {
            handelClassUpdate()
        } else {
            handelObjUpdate()
        }

    }, [dataType]);

    const getCurveAndLog = useCallback(() => {

        if ((datasetId !== '') && (lastIter !== '')) {
            getCurveAPI(datasetId, { iteration: lastIter })
                .then(({ data }) => {
                    log('getCurveAPI-Success', data);
                    const status = Object.keys(data.data).map((v) => data.data[v].status)
                    setCurveData(status)
                })
                .catch((err) => {
                    log('getCurveAPI-Err', err);
                })
        }


    }, [datasetId, lastIter])

    const getLastIter = useCallback(() => {

        if (datasetId !== '') {

            getDatasetListAPI(datasetId)
                .then(({ data }) => {
                    log('getDatasetListAPI-Success', data.data.folder_name);
                    const IterArr = filter(data.data.folder_name, function (o) { return o !== 'workspace' })
                    if (IterArr.length > 0) {
                        setLastIter(IterArr[IterArr.length - 1])
                    }

                })
                .catch((err) => {
                    log('getDatasetListAPI-Err', err);
                })

        }

    }, [datasetId])


    useImperativeHandle(ref, () => ({


    }));


    useEffect(() => {

        log('curveData...',curveData)

        if (curveData && curveData.length) {
            handleDatasets(curveData)
        }

    }, [curveData, handleDatasets]);



    //theChartConfig
    // useEffect(() => {

    //     log('------------------theChartConfig------------------')
    //     log(theChartConfig)

    //     log('------------------trainData------------------')
    //     log(trainData)


    //     //來的來源是[]才進handleDatasets處理
    //     if (trainData[datasetId] && trainData[datasetId].iteration === currentIter) {
    //         if (theChartConfig && theChartConfig.length) {
    //             handleDatasets(theChartConfig)
    //         } else {
    //             if (theChartConfig.trainConfig === undefined || theChartConfig.valConfig === undefined) return;
    //             setChartTrain(theChartConfig.trainConfig);
    //             setChartVal(theChartConfig.valConfig)
    //         }
    //     } else {
    //         if (theChartConfig && theChartConfig.length) {
    //             handleDatasets(theChartConfig)
    //         }
    //     }

    // }, [currentIter, theChartConfig, datasetId, handleDatasets, trainData]);

    // useEffect(() => {
    //     //只要有socket都會去update
    //     if (trainData[datasetId] && trainData[datasetId].iteration === currentIter) {
    //         if (socketGraph && !Object.keys(socketGraph).includes('precision')) {
    //             if (trainRef.current) {
    //                 if (socketGraph && hasTraining) {
    //                     if (dataType === 'classification') {
    //                         handelClassUpdate()
    //                     } else {
    //                         handelObjUpdate()
    //                     }
    //                 }
    //             }
    //         }
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [dataType, hasTraining, socketGraph, trainData, datasetId, currentIter]);





    useEffect(() => {

        log('datasetId --->',datasetId)
        log('lastIter --->',lastIter)

        getLastIter();
        getCurveAndLog();

    }, [datasetId,lastIter]);

    return (
        <div className="d-flex flex-column" style={{ padding: '20px 24px 15px 24px' }}>
            <div className="d-flex flex-start" style={{ color: '#16272E', fontSize: 16, fontWeight: 500, fontFamily: 'Roboto' }}>Data visualized</div>

            <div className="d-flex flex-row justify-content-between" style={{ marginBottom: 5 }}>
                <div className="d-flex flex-start">
                    <div style={{ marginRight: 8 }}><CustomButton name="train" width={40} height={18} active={chartType === 'train'} onClick={(chartType) => setChartType(chartType)} /></div>
                    <div><CustomButton name="val" width={40} height={18} active={chartType === 'val'} onClick={(chartType) => setChartType(chartType)} /></div>
                </div>
                <div className="d-flex flex-row align-items-center" style={{ fontSize: 12, color: '#979CB5' }}>
                    {
                        (dataType === 'object_detection') ?
                            <>
                                <div style={{ marginRight: 3, width: 10, height: 10, backgroundColor: '#E61F23', borderRadius: 4 }}></div>
                                <div>{(chartType === 'train') ? 'avg loss' : 'mAP'}</div>
                            </>
                            :
                            <>
                                <div style={{ marginRight: 3, width: 10, height: 10, backgroundColor: '#E61F23', borderRadius: 4 }}></div>
                                <div style={{ marginRight: 6 }}>{(chartType === 'train') ? 'loss' : 'val_loss'}</div>
                                <div style={{ marginRight: 3, width: 10, height: 10, backgroundColor: '#57B8FF', borderRadius: 4 }}></div>
                                <div>{(chartType === 'train') ? 'acc' : 'val_acc'}</div>
                            </>

                    }

                </div>
            </div>


            <div className="d-flex flex-row" style={{ height: 200, width: 252 }}>
                <div style={{ display: chartType === 'train' ? 'flex' : 'none', width: '100%', height: '100%' }}>
                    <Line ref={trainRef} options={options} data={{ labels, datasets: chartTrain }} />
                </div>

                <div style={{ display: chartType === 'val' ? 'flex' : 'none', width: '100%', height: '100%' }}>
                    <Line ref={valRef} options={options} data={{ labels, datasets: chartVal }} />
                </div>
            </div>


        </div>
    )
});

export default CustomChart;