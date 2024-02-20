import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { selectIteration } from '../../../redux/store/slice/currentIteration';
import { selectCurrentTrainInfo } from '../../../redux/store/slice/currentTrainInfo';
import { checkTrainingStatus } from '../../../utils/utils';
import { SubTitle } from '../../pageStyle';
import { Block } from '../modelStyle';
import { SocketLog } from './Log/SocketLog';
import { APILog } from './Log/APILog';
import { useGetCurrTrainInfo } from '../hook/useModelData';


type LogContentProps = {
    logData: any;
    dataType: string;
    ws: any;
};

export const LogBlock = (props: LogContentProps) => {
    const { dataType, logData, ws } = props;
    const { id: datasetId = '' } = useParams();
    const currentIter = useSelector(selectIteration).iteration;
    const trainData = useSelector(selectCurrentTrainInfo).currTrain;
    const dummy = useRef<HTMLDivElement>(null);
    const { getCurrTrainingInfo } = useGetCurrTrainInfo();

    const isCurrTrain = useMemo(() => {

        return checkTrainingStatus(trainData, datasetId, currentIter);
    }, [currentIter, datasetId, trainData])


    const checkLogInit = useCallback(() => {


        if (!isCurrTrain && Object.keys(logData).length > 0) {


            return <APILog logData={logData.data} dataType={dataType} />
        } else {

            return (
                <SocketLog key={datasetId.concat(currentIter)} ws={ws} datasetId={datasetId} />
            )
        }
    }, [currentIter, dataType, datasetId, isCurrTrain, logData, ws]
    );



    //training離開頁面再回來，因為hook中斷執行收不到ending不會重拉API資料，所以另外在這寫

    useEffect(() => {
        getCurrTrainingInfo()
    }, [getCurrTrainingInfo]);


    useEffect(() => {
        if (dummy.current) {
            dummy.current.scrollIntoView({ block: 'end' });
        }
    }, [logData]);


    return (
        <>

            <Block style={{ borderRight: 0 }}>
                <SubTitle>Log</SubTitle>

                {checkLogInit()}

            </Block>

        </>

    );
};
