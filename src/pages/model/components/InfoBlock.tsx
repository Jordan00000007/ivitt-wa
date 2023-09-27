import styled from 'styled-components';
import { OverflowHide, SubTitle } from "../../pageStyle";
import { ResGetModelInfoType } from '../../../constant/API';
import { Block, CardsBlock } from '../modelStyle';
import { checkTrainingStatus, convertSecondsToMinutes } from '../../../utils/utils';
import StyledTooltip from '../../../component/Tooltip';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentTrainInfo } from '../../../redux/store/slice/currentTrainInfo';
import { useParams } from 'react-router-dom';
import { selectIteration } from '../../../redux/store/slice/currentIteration';


export const BlockWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 100%;
  width: 100%;
`;

export const RowWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 308px;
  min-width: 0;
  height: 36px;
  padding: 8px 10px;
  font-size:  ${props => props.theme.typography.body1};
  border-bottom: 2px solid ${props => props.theme.color.onColor_2}20;
`;

export const Title = styled.div`
  width: 120px;
  color: ${props => props.theme.color.onColor_2};
`;

export const Value = styled(OverflowHide)`
  margin-left: 10px;
  color: ${props => props.theme.color.onColor_1};
  width: 155px;
  text-transform: capitalize;
`;


export type InfoBlockPropsType = {
  info: ResGetModelInfoType;
  dataType: string;
  platform: string;
  datasetId: string;
  trainingStatus: string;
  ws: any
};


function InfoBlock(props: InfoBlockPropsType) {
  const { info, dataType, platform, trainingStatus, ws } = props;
  const { id: datasetId = '' } = useParams();
  const trainData = useSelector(selectCurrentTrainInfo).currTrain;
  const currentIter = useSelector(selectIteration).iteration;
  const [socketTime, setSocketTime] = useState<any>(null);

  const isCurrTrain = useMemo(() => {
    return checkTrainingStatus(trainData, datasetId, currentIter);
  }, [currentIter, datasetId, trainData])

  const checkTimeValue = useCallback(() => {
    if (isCurrTrain) {
      return typeof socketTime === 'number' ? convertSecondsToMinutes(socketTime) : 'calculating...';
    } else {
      //剛train完或是stop，API的spend_time會沒資料，要從socket拿資料
      return convertSecondsToMinutes(!info.spend_time ? socketTime : info.spend_time)
    }

  }, [info.spend_time, isCurrTrain, socketTime])

  const listenTimeSocket = useCallback(() => {
    ws.on('remaining_time', (message: any) => {
      const remainingTime = message.replace('remaining_time', '');
      if (Number(remainingTime) > 0) {
        setSocketTime(Number(remainingTime))
      }
    });

    ws.on('spend_time', (message: any) => {
      const spendTime = message.replace('spend_time', '');
      if (message) {
        setSocketTime(Number(spendTime))
        ws.removeAllListeners(['remaining_time', 'spend_time'])
      }
    });
  }, [ws])


  useEffect(() => {
    if (ws && Object.keys(trainData).length !== 0) {
      listenTimeSocket();
    }
    return () => {
      if (ws) {
        ws.removeAllListeners(['remaining_time'])
        ws.removeAllListeners(['spend_time'])
      }
    }
  }, [listenTimeSocket, trainData, ws])



  return (
    <>
      <CardsBlock style={{ height: '260px' }}>
        <Block>
          <SubTitle style={{ padding: '20px, 24px' }}>Information</SubTitle>
          <BlockWrapper>
            <RowWrapper>
              <Title>Model Type</Title>
              <Value>{dataType}</Value>
            </RowWrapper>
            <RowWrapper>
              <Title>Platform</Title>
              <Value>{platform}</Value>
            </RowWrapper>
            <RowWrapper>
              <Title>Dataset count</Title>
              <Value>{info.effect_img_nums}</Value>
            </RowWrapper>
            <RowWrapper>
              <Title>Training Method</Title>
              <Value>{info.training_method}</Value>
            </RowWrapper>
            <RowWrapper style={{ borderBottom: 'none' }}>
              <Title>{isCurrTrain && trainingStatus === 'doing' ? 'Remaining Time' : 'Spend time'}</Title>
              <Value>{checkTimeValue()}</Value>
            </RowWrapper>
          </BlockWrapper>
        </Block>
        <Block style={{ borderRight: '0' }}>
          <SubTitle>Parameter</SubTitle>
          <BlockWrapper>
            <RowWrapper>
              <Title>Model</Title>
              <Value>{info.model}</Value>
            </RowWrapper>
            <RowWrapper>
              <Title>GPU</Title>
              <StyledTooltip place='right' title={info.gpu}>
                <Value>{info.gpu}</Value>
              </StyledTooltip>
            </RowWrapper>
            <RowWrapper>
              <Title>Input shape</Title>
              <Value>{String(info.input_shape)}</Value>
            </RowWrapper>
            <RowWrapper>
              <Title>Batch size</Title>
              <Value>{info.batch_size}</Value>
            </RowWrapper>
            <RowWrapper style={{ borderBottom: 'none' }}>
              <Title>Step</Title>
              <Value>{info.step}</Value>
            </RowWrapper>
          </BlockWrapper>
        </Block>
      </CardsBlock>
    </>
  );
}

export default InfoBlock;
