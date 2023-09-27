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
import type { DecimationOptions } from "chart.js";
import { useEffect, useState, useCallback, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
import { selectIteration } from '../../../../redux/store/slice/currentIteration';
import { selectCurrentTrainInfo } from '../../../../redux/store/slice/currentTrainInfo';
import { StatusType } from '../ChartBlock';

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

export type DatasetsType = {
  label: string,
  data: number[],
  borderColor: string,
  backgroundColor: string,
  lineTension?: number,
}


export type LineChartType = {
  labels: number[];
  chartBtnActive: string;
  dataType: string;
  curveData: any;
  socketGraph: any;
  datasetId: string;
};


function LineChart(props: LineChartType) {
  const { labels, chartBtnActive, dataType, curveData, socketGraph, datasetId } = props;
  const currentIter = useSelector(selectIteration).iteration;
  const trainData = useSelector(selectCurrentTrainInfo).currTrain;
  const hasTraining = Object.keys(trainData).length > 0;

  const [chartTrain, setChartTrain] = useState<DatasetsType[]>([]);
  const [chartVal, setChartVal] = useState<DatasetsType[]>([]);

  const trainRef = useRef<any | null>(null);
  const valRef = useRef<any | null>(null);

  const trainChart = trainRef.current;
  const valChart = valRef.current;

  const theDecimation: DecimationOptions = {
    enabled: true,
    algorithm: "lttb",
    samples: 50
  }


  const handleDatasets = useCallback((data: StatusType[]) => {
    const lossList: number[] = [];
    const accList: number[] = [];
    const valLossList: number[] = [];
    const valAccList: number[] = [];

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
  }, [dataType]);


  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        align: "end" as const,
        labels: {
          usePointStyle: true,
          boxWidth: 8,
          boxHeight: 8,
          pointStyle: 'rectRounded',
        }
      },
      title: {
        display: false,
      },
      decimation: theDecimation,
    },
    scales: {
      y: {
        beginAtZero: false,
      },
      x: {
        beginAtZero: false,
        ticks: {
          // stepSize: 5000,
          // min: 0,
          max: labels.length,
          // maxRotation: 0,
          autoSkip: true,
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
    if (!hasTraining) return;

    if (!trainChart?.data) return;
    //trainRef
    const classLoss = trainChart.data.datasets[0].data;
    classLoss.push(socketGraph.status.loss);
    const classAcc = trainChart.data.datasets[1].data;
    classAcc.push(socketGraph.status.acc);

    trainRef.current.update('none');

    if (!valChart?.data) return;
    //valRef
    const classValLoss = valChart.data.datasets[0].data;
    classValLoss.push(socketGraph.status.val_loss);
    const classValAcc = valChart.data.datasets[1].data;
    classValAcc.push(socketGraph.status.val_acc);
    valRef.current.update('none');

  }

  const handelObjUpdate = () => {
    if (!hasTraining) return;

    if (!trainChart?.data) return;
    //trainRef
    const curObjTrain = trainChart.data.datasets[0].data;
    curObjTrain.push(socketGraph.status.avg_loss);
    trainRef.current.update('none');

    if (!valChart?.data) return;
    //valRef
    const curObjVal = valChart.data.datasets[0].data;
    curObjVal.push(socketGraph.status.mAP);
    valRef.current.update('none');

  }


  useEffect(() => {
    //只要有socket都會去update
    if (trainData[datasetId] && trainData[datasetId].iteration === currentIter) {
      if (socketGraph && !Object.keys(socketGraph).includes('precision')) {
        if (trainRef.current) {
          if (socketGraph && hasTraining) {
            if (dataType === 'classification') {
              handelClassUpdate()
            } else {
              handelObjUpdate()
            }
          }
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataType, hasTraining, socketGraph, trainData, datasetId, currentIter]);

  // [dataType, handelObjUpdate,handelClassUpdate, hasTraining, socketGraph]

  useEffect(() => {
    //來的來源是[]才進handleDatasets處理
    if (trainData[datasetId] && trainData[datasetId].iteration === currentIter) {
      if (curveData && curveData.length) {
        handleDatasets(curveData)
      } else {
        if (curveData.trainConfig === undefined || curveData.valConfig === undefined) return;
        setChartTrain(curveData.trainConfig);
        setChartVal(curveData.valConfig)
      }
    } else {
      if (curveData && curveData.length) {
        handleDatasets(curveData)
      }
    }
  }, [currentIter, curveData, datasetId, handleDatasets, trainData]);



  return (
    <>
      <div style={{ display: chartBtnActive === 'train' ? 'flex' : 'none', width: '100%', height: '100%' }}>
        <Line ref={trainRef} options={options} data={{ labels, datasets: chartTrain }} />
      </div>

      <div style={{ display: chartBtnActive === 'val' ? 'flex' : 'none', width: '100%', height: '100%' }}>
        <Line ref={valRef} options={options} data={{ labels, datasets: chartVal }} />
      </div>
    </>
  );
}

export default LineChart;



