import { ResGetMetricsType } from '../../constant/API';
import ModelCard from './ModelCard';

type ModelCardSetProps = {
  metrics: ResGetMetricsType;
};


const ModelCardSet = (props: ModelCardSetProps) => {
  const { metrics } = props;

  //因value有可能是undefine, 所以type寫any
  const roundNumber = (value: any) => {
    if (typeof value !== 'number' || Number.isNaN(value)) {
      return 0;
    }
    return Math.round(value * 100)
  }

  const getOtherKey = (data: ResGetMetricsType) => {
    const otherKey = Object.keys(data).filter((key) => key !== 'precision' && key !== 'recall');
    const keyNumber = roundNumber(metrics[otherKey[0]]);
    return {
      titleName: otherKey.length >= 1 ? otherKey[0] : '',
      keyValue: keyNumber,
    };
  }

  return (
    <>
      <ModelCard title={'Precision'} value={roundNumber(metrics.precision)} barColor={'vivid_1'} hint="Measuring the reliability of the model predictions."></ModelCard>
      <ModelCard title={'Recall'} value={roundNumber(metrics.recall)} barColor={'vivid_2'} hint="Assessing whether the model has successfully learned the features of each category."></ModelCard>
      <ModelCard title={getOtherKey(metrics).titleName} value={getOtherKey(metrics).keyValue} barColor={'vivid_3'} 
        hint={(getOtherKey(metrics).titleName==='mAP')?"Evaluating accuracy of the predicted bounding boxes.":(getOtherKey(metrics).titleName==='f1_score')?'A comprehensive index of precision and recall to measure the quality of a classification model.':'N/A'}
      ></ModelCard>
    </>
  );
};

export default ModelCardSet;
