import { useEffect, useRef } from 'react';
import { SpanWrapper, LogContent } from '../../modelStyle';


type LogContentProps = {
  logData: any;
  dataType: string;
};

export const APILog = (props: LogContentProps) => {
  const { logData, dataType } = props;
  const dummy = useRef<HTMLDivElement>(null);


  useEffect(() => {
    if (dummy.current) {
      dummy.current.scrollIntoView({ block: 'end' });
    }
  }, [logData]);


  return (
    <SpanWrapper>
      {Object.keys(logData).map((value, index) =>
        dataType === 'classification' ?
          <LogContent key={index + 1}>{`STEP${index + 1} ▎acc: ${logData[value].status.acc}, loss: ${logData[value].status.loss},
                      val_acc: ${logData[value].status.val_acc}, val_loss: ${logData[value].status.val_loss}`}
          </LogContent>
          :
          <LogContent key={index + 2}>{`STEP${index + 1} ▎avg_loss: ${logData[value].status.avg_loss},    
                        mAP: ${logData[value].status.mAP}`}
          </LogContent>
      )}
      <div ref={dummy} />
    </SpanWrapper>
  );
};
