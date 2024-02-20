import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import LineChart from './Charts/LineChart';
import { selectIsTraining } from "../../../redux/store/slice/isTraining";
import { useParams } from "react-router-dom";
import { selectIteration } from '../../../redux/store/slice/currentIteration';
import { useCurveDataResult } from '../hook/useModelData';



export type StatusType = {
    [key: string]: number
}

export type VisualizedPropsType = {
    ws: any;
    labels: number[];
    chartBtnActive: string;
    lastIter: string;
};


export const ChartBlock = (props: VisualizedPropsType) => {
    const { ws, labels, chartBtnActive, lastIter } = props;
    const { id: datasetId = '', type: dataType = '' } = useParams();
    //const { id: datasetId = '0982dfa7-7190-4e2e-b5b8-3dcceca28a3b', type: dataType = 'object_detection' } = useParams();
    const currentIter = useSelector(selectIteration).iteration;
    const trainingStatus = useSelector(selectIsTraining).isTraining;


    const { theChartConfig, socketGraph } = useCurveDataResult(
        ws,
        lastIter,
        datasetId,
        currentIter,
        trainingStatus,
        dataType
    )



    if (theChartConfig && theChartConfig.length === 0) return <></>;

    return (
        <LineChart key={datasetId.concat(currentIter)} datasetId={datasetId} socketGraph={socketGraph} curveData={theChartConfig} dataType={dataType} chartBtnActive={chartBtnActive} labels={labels} />
    );
};