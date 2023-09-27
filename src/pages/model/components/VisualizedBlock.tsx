import { SubTitle } from "../../pageStyle";
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useAPICurveAndLog } from '../hook/useModelData';
import { Block, BtnWrapper, CardsBlock, SwitchChartBtn } from '../modelStyle';
import { LogBlock } from "./LogBlock";
import { selectIsTraining } from "../../../redux/store/slice/isTraining";
import { useParams } from "react-router-dom";
import { selectIteration } from "../../../redux/store/slice/currentIteration";
import { ChartBlock } from "./ChartBlock";


export type VisualizedPropsType = {
  ws: any;
  labels: number[];
  lastIter: string;
};


export const VisualizedBlock = (props: VisualizedPropsType) => {
  const { ws, labels, lastIter } = props;
  const { id: datasetId = '', type: dataType = '' } = useParams();
  const trainingStatus = useSelector(selectIsTraining).isTraining;
  const currentIter = useSelector(selectIteration).iteration;
  const [chartBtnActive, setChartBtnActive] = useState<'train' | 'val'>('train');
  const { logData } = useAPICurveAndLog(
    lastIter,
    datasetId,
    currentIter,
    trainingStatus
  )


  return (
    <CardsBlock>
      <Block>
        <SubTitle>Data visualized</SubTitle>
        <BtnWrapper>
          <SwitchChartBtn style={{ marginRight: '8px' }} active={chartBtnActive === 'train'} onClick={() => setChartBtnActive('train')}>train </SwitchChartBtn>
          <SwitchChartBtn active={chartBtnActive === 'val'} onClick={() => setChartBtnActive('val')}>val</SwitchChartBtn>
        </BtnWrapper>
        <ChartBlock ws={ws} labels={labels} chartBtnActive={chartBtnActive} lastIter={lastIter} />
      </Block>
      <LogBlock ws={ws} logData={logData} dataType={dataType} />
    </CardsBlock>

  );
};