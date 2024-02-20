import React, { useState, forwardRef, useEffect, useImperativeHandle, useRef, useContext, useCallback } from "react";
import { Line } from 'react-chartjs-2';
import { filter,cloneDeep } from 'lodash-es';
import log from "../../utils/console";
import CustomButton from '../../components/Buttons/CustomButton';
import { WsContext } from '../../layout/logIn/LoginLayout';
import { useAPIModelInit, useCurveDataResult, useAPICurveAndLog } from '../../pages/model/hook/useModelData';
import { getCurveAPI, getDatasetListAPI } from '../../constant/API';
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentTrainInfo } from '../../redux/store/slice/currentTrainInfo';
import { selectIsTraining } from "../../redux/store/slice/isTraining";
import { apiHost, socketHost } from '../../constant/API/APIPath';
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
import { ChargingStation } from "@mui/icons-material";

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

    let { datasetId, dataType, lastIter, totalStep } = props;

    const [inputValue, setInputValue] = useState('');
    const [warnning, setWarnning] = useState(false);
    // const { ref1, ref2 } = ref;

    const [chartType, setChartType] = useState('train');
    const [chartTrain, setChartTrain] = useState([
        {
            label: 'loss',
            data: new Array(totalStep),
            borderColor: '#E61F23',
            backgroundColor: '#E61F23',
            lineTension: 0.2
        },
        {
            label: 'acc',
            data: new Array(totalStep),
            borderColor: '#57B8FF',
            backgroundColor: '#57B8FF',
            lineTension: 0.2
        }
    ]);
    const [chartVal, setChartVal] = useState([
        {
            label: 'val_loss',
            data:  new Array(totalStep),
            borderColor: '#E61F23',
            backgroundColor: '#E61F23',
            lineTension: 0.2
        },
        {
            label: 'val_acc',
            data:  new Array(totalStep),
            borderColor: '#57B8FF',
            backgroundColor: '#57B8FF',
            lineTension: 0.2
        }
    ]);

    const [curveData, setCurveData] = useState([]);

    const [chart1Line1, setChart1Line1] = useState([]);
    const [chart1Line2, setChart1Line2] = useState([]);
    const [chart2Line1, setChart2Line1] = useState([]);
    const [chart2Line2, setChart2Line2] = useState([]);

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

    const [info, setInfo] = useState(InfoInit);
    const [labels, setLabels] = useState([]);


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
                    //max: labels.length,
                    max: totalStep,
                    // maxRotation: 0,
                    autoSkip: true,
                    font: {
                        size: 10
                    },
                    color: '#979CB5'
                },

            },

        },
        pointRadius: totalStep >= 40 ? 0 : 1,
        borderWidth: 3,
        pointHoverRadius: 4,
        animation: {
            duration: 0
        },
        parsingOptions: {
            parsing: false
        },
    };



    const handleCurveData = useCallback((data, myTotalStep) => {

        log('handle datasets')
        log('totalStep', myTotalStep)

        const lossList = new Array(myTotalStep);
        const accList = new Array(myTotalStep);
        const valLossList = new Array(myTotalStep);
        const valAccList = new Array(myTotalStep);

        Object.keys(data).forEach((v) => {

            if (v < myTotalStep) {

                if (dataType === 'classification') {
                    if (data[Number(v)] && data[Number(v)].loss) lossList[Number(v)] = data[Number(v)].loss;
                    if (data[Number(v)] && data[Number(v)].acc) accList[Number(v)] = data[Number(v)].acc;
                    if (data[Number(v)] && data[Number(v)].val_loss) valLossList[Number(v)] = data[Number(v)].val_loss;
                    if (data[Number(v)] && data[Number(v)].val_acc) valAccList[Number(v)] = data[Number(v)].val_acc;
                } else {
                    if (data[Number(v)] && data[Number(v)].avg_loss) lossList[Number(v)] = data[Number(v)].avg_loss;
                    if (data[Number(v)] && data[Number(v)].mAP) accList[Number(v)] = data[Number(v)].mAP;

                }

            }

        })

      
        if (dataType === 'classification') {
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

        } else {

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

        }
    }, [dataType]);

    const getCurveHistory = useCallback(() => {

        


        if ((datasetId !== '') && (lastIter !== '')) {
            getCurveAPI(datasetId, { iteration: lastIter })
                .then(({ data }) => {
                    const status = Object.keys(data.data).map((v) => data.data[v].status)
                    const myCurrentStep = status.length;
                    props.updateStep(myCurrentStep);


                    log('curve data ===>')
                    log(status)

                    setCurveData(status)
                })
                .catch((err) => {
                    log('getCurveAPI-Err', err);
                    //setCurveData(new Array(totalStep))
                })
        }


    }, [datasetId, lastIter])





    useImperativeHandle(ref, () => ({

        setChartDataClear: () => {

            log('set chart data clear')
            log('totalStep', totalStep)
            log('dataType', dataType)
            const lossList = new Array(totalStep);
            const accList = new Array(totalStep);
            const valLossList = new Array(totalStep);
            const valAccList = new Array(totalStep);

            if (dataType === 'classification') {
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

            } else {

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

            }




        },

    }));


    useEffect(() => {

        log('------------------ total step -------------------------------',totalStep)
        log('------------------ curveData -------------------------------',curveData)

        if (totalStep > 0) {

            const myLable = [];
            const myChart1Line1 = [];
            const myChart1Line2 = [];
            const myChart2Line1 = [];
            const myChart2Line2 = [];
            for (let i = 1; i <= totalStep; i++) {
                myLable.push(i);
                myChart1Line1.push(null);
                myChart1Line2.push(null);
                myChart2Line1.push(null);
                myChart2Line2.push(null);
            }
            setLabels(myLable);

            //handleCurveData(curveData, totalStep);

        }


    }, [totalStep, curveData])

   
    const resetChartData=(myTotalStep)=>{

        log('=================================================')
        log('reset chart data')
        log('myTotalStep',myTotalStep)

        const curObjTrain=chartTrain;
        curObjTrain[0].data= Array(myTotalStep).fill(null);
        curObjTrain[1].data=Array(myTotalStep).fill(null);
        setChartTrain(curObjTrain);

        const curObjVal=chartVal;
        curObjVal[0].data=Array(myTotalStep).fill(null);
        curObjVal[1].data=Array(myTotalStep).fill(null);
        setChartVal(curObjVal);

        getCurveHistory();
        
    }




    useEffect(() => {

        log('=================================================')
        log('datasetId chagne to ===>',datasetId)
        log('lastIter chagne to ===>',lastIter)
        log('totalStep chagne to ===>',totalStep)

    
        //resetChartData(totalStep)
 
        //getCurveHistory();

    }, [datasetId,lastIter,totalStep,dataType]);



    useEffect(() => {

        if (datasetId !== '') {

            const socket = io(`${socketHost}/${datasetId}/log`);

            socket.on('connect', () => {
                log(`Connected to [${datasetId}] channel`);
            });

            socket.on('curve', (message) => {


                log('curve message....')
                log(message)

                const myData = JSON.parse(message)
                const myStep = parseInt(myData.step);

                console.log('update step ',myStep)
                props.updateStep(myStep);

                if (myData.status.avg_loss) {

                    

                    // const curObjTrain=cloneDeep(chartTrain);
                    // curObjTrain[0].data[myStep-1]=myData.status.avg_loss;

                    // log('(111) curObjTrain[0].data',curObjTrain[0].data)


                    // setChartTrain(curObjTrain);


                    // log('curObjTrain---',curObjTrain)

                    const myChart1Line1=chart1Line1;
                    myChart1Line1[myStep-1]=myData.status.avg_loss;
                    setChart1Line1(myChart1Line1);
                    
                }

                if (myData.status.mAP) {

                    // const curObjVal=cloneDeep(chartVal);
                    // curObjVal[0].data[myStep-1]=myData.status.mAP;
                    // setChartVal(curObjVal);

                    const myChart2Line1=chart2Line1;
                    myChart2Line1[myStep-1]=myData.status.mAP;
                    setChart2Line1(myChart2Line1);
                    
                }

                if (myData.status.loss) {

                    const curObjTrain=cloneDeep(chartTrain);
                    curObjTrain[0].data[myStep-1]=myData.status.loss;
                    setChartTrain(curObjTrain);
                    
                }

                if (myData.status.acc) {

                    const curObjTrain=cloneDeep(chartTrain);
                    curObjTrain[1].data[myStep-1]=myData.status.acc;
                    setChartTrain(curObjTrain);

                }

                if (myData.status.val_loss) {

                    const curObjVal=cloneDeep(chartVal);
                    curObjVal[0].data[myStep-1]=myData.status.val_loss;
                    setChartVal(curObjVal);

                }

                if (myData.status.val_acc) {

                    const curObjVal=cloneDeep(chartVal);
                    curObjVal[1].data[myStep-1]=myData.status.val_acc;
                    setChartVal(curObjVal);

                }
                


            })

            // 在組件卸載時斷開連接
            return () => {
                socket.disconnect();
            };

        }
    }, [datasetId]);








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
                    <Line ref={trainRef} options={options} data={{ labels, datasets: [
                        {
                            label: 'loss',
                            data: chart1Line1,
                            borderColor: '#E61F23',
                            backgroundColor: '#E61F23',
                            lineTension: 0.2
                        },
                        {
                            label: 'acc',
                            data: chart1Line2,
                            borderColor: '#57B8FF',
                            backgroundColor: '#57B8FF',
                            lineTension: 0.2
                        }
                    ]}} />
                </div>

                <div style={{ display: chartType === 'val' ? 'flex' : 'none', width: '100%', height: '100%' }}>
                    <Line ref={valRef} options={options} data={{ labels, datasets:  [
                        {
                            label: 'val_loss',
                            data: chart2Line1,
                            borderColor: '#E61F23',
                            backgroundColor: '#E61F23',
                            lineTension: 0.2
                        },
                        {
                            label: 'val_acc',
                            data: chart2Line2,
                            borderColor: '#57B8FF',
                            backgroundColor: '#57B8FF',
                            lineTension: 0.2
                        }
                    ]}} />
                </div>
            </div>


        </div>
    )
});

export default CustomChart;