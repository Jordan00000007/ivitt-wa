import { useEffect, useRef, useState } from 'react';
import { useSocketLogData } from '../../hook/useModelData';
import { SpanWrapper, LogContent } from '../../modelStyle';


type LogContentProps = {
  ws: any;
};

export const SocketLog = (props: LogContentProps) => {
  const { ws } = props;
  const dummy = useRef<HTMLDivElement>(null);
  const { socketLog } = useSocketLogData(ws);
  const [shortLog, setShortLog] = useState<string[]>(socketLog);


  useEffect(() => {
    if (dummy.current) {
      dummy.current.scrollIntoView({ block: 'end' });
    }
  }, [socketLog]);

  useEffect(() => {
    if (socketLog.length > 25) {
      const cut = socketLog.slice(-25);
      setShortLog(cut)
    } else {
      setShortLog(socketLog)
    }
  }, [socketLog]);


  return (
    <SpanWrapper>
      {shortLog.map((value, index) =>
        <LogContent key={index}>{value}</LogContent>
      )}

      <div ref={dummy} />
    </SpanWrapper>
  );
};
