import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import ModelCardSet from "../../component/Card/ModelCardSet";
import { selectIteration } from '../../redux/store/slice/currentIteration';
import { Right, RightCardWrapper, StyledBtnRed, Title } from "../pageStyle";
import { useContext, useEffect, useState } from 'react';
import { ResGetModelInfoType } from '../../constant/API';
import { selectPlatformMap } from '../../redux/store/slice/projectPlatform';
import { CardWrapper, Left } from './modelStyle';
import InfoBlock from './components/InfoBlock';
import ProjectTag from '../../component/ProjectTag';
import { selectIsTraining } from '../../redux/store/slice/isTraining';
import { useAPIModelInit } from './hook/useModelData';
import { VisualizedBlock } from './components/VisualizedBlock';
import { EvaluateBlock } from './components/EvaluateBlock';
import ExportDialog from '../../component/Dialogs/ExportDialog';
import { WsContext } from '../../layout/logIn/LoginLayout';



export type ModelPropsType = {
  lastIter: string;
  datasetInfoApiCallback: (datasetId: string) => void;
};

export type SocketDatasetsType = {
  label: string,
  data: number[],
  borderColor: string,
  backgroundColor: string,
  lineTension?: number,
}

export type ClassStatusType = {
  acc: number,
  loss: number,
  val_acc: number,
  val_loss: number,
}

export type ObjectStatusType = {
  acc: number,
  loss: number,
}

export const InfoInit = {
  model: '',
  batch_size: 0,
  step: 0,
  input_shape: [],
  spend_time: 0,
  training_method: '',
  gpu: [],
  effect_img_nums: 0
}


function Model(props: ModelPropsType) {
  const { lastIter } = props;
  const { id: datasetId = '', type: dataType = '' } = useParams();
  const dispatch = useDispatch();
  const { ws, convertId } = useContext(WsContext);
  const trainingStatus = useSelector(selectIsTraining).isTraining;
  const currentIter = useSelector(selectIteration).iteration;
  const platformMap = useSelector(selectPlatformMap).platformIdMap;
  const [openExportDialog, setOpenExportDialog] = useState(false);
  //const [ws, setWs] = useState<any>(null);
  const [info, setInfo] = useState<ResGetModelInfoType>(InfoInit);
  const [labels, setLabels] = useState<number[]>([]);


  const { getMetricsAndBest, infoRef, bestModelRef, metricsRef, metrics } = useAPIModelInit(lastIter, datasetId, currentIter, setInfo, setLabels);

  const exportBtnOnClick = () => {
    setOpenExportDialog(true);
  }



  useEffect(() => {
    // dispatch(closeLoading());
    if (trainingStatus === 'stop' || trainingStatus === 'done') {
      getMetricsAndBest()
    }
  }, [dispatch, getMetricsAndBest, trainingStatus]);


  return (
    <>
      <Title>Model
        <div style={{ position: 'absolute', left: '7%', top: '-13.5%' }}>
          <ProjectTag className={'green'} text={dataType} />
        </div>
        <StyledBtnRed
          ref={bestModelRef}
          disabled={!bestModelRef.current || convertId !== ''}
          onClick={exportBtnOnClick}>Export
        </StyledBtnRed>
      </Title>

      <div style={{ display: 'flex', width: '1200px', overflow: 'hidden' }}>
        <Left>
          <CardWrapper ref={metricsRef} show={metricsRef.current}>
            <ModelCardSet metrics={metrics} />
          </CardWrapper>

          {/* Visualized要不要顯示還是得透過ref判斷，因為不一定有圖表 */}
          <CardWrapper show={true}>
            <VisualizedBlock key={datasetId.concat(currentIter)} ws={ws} labels={labels} lastIter={lastIter} />
          </CardWrapper>
          <CardWrapper ref={infoRef} show={infoRef.current}>
            <InfoBlock key={datasetId.concat(currentIter)} ws={ws} trainingStatus={trainingStatus} info={info} dataType={dataType} datasetId={datasetId} platform={platformMap[datasetId]} />
          </CardWrapper>
        </Left>
        <Right>
          <RightCardWrapper ref={bestModelRef} className={bestModelRef.current ? '' : 'hide'}>
            <EvaluateBlock key={datasetId + currentIter} />
          </RightCardWrapper>
        </Right>
      </div>

      <ExportDialog
        open={openExportDialog}
        handleClose={() => {
          setOpenExportDialog(false);
        }}
        currID={datasetId}
        currPlatform={platformMap[datasetId]}
        currIter={currentIter}
        projectModel={info.model}
      />
    </>
  );
}

export default Model;
