import { useEffect, useRef, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSocketLogData } from '../../hook/useModelData';
import { SpanWrapper, LogContent } from '../../modelStyle';
import { socketHost } from '../../../../constant/API/APIPath';
import { io } from 'socket.io-client';
import { closeLoading, openLoading } from '../../../../redux/store/slice/loading';
import { selectIsTraining,setIsTraining } from '../../../../redux/store/slice/isTraining';
import { projectTrainStatusAPI } from '../../../../constant/API/trainAPI';
import { selectCurrentTrainInfo, setCurrentTrainInfo } from '../../../../redux/store/slice/currentTrainInfo';


type LogContentProps = {
    ws: any;
    datasetId: string;
};

export const SocketLog = (props: LogContentProps) => {
    const { ws } = props;
   
    const dummy = useRef<HTMLDivElement>(null);
    const { socketLog } = useSocketLogData(ws);
    const [shortLog, setShortLog] = useState<string[]>(socketLog);

    const dispatch=useDispatch();

    const getCurrTrainingInfo = useCallback(() => {
        projectTrainStatusAPI()
          .then(({ data }) => {
    
            dispatch(setCurrentTrainInfo(data.data))
          })
          .catch((err) => {
            console.log('useAllProjectInit-Error', err);
          })
    
      }, [dispatch]);
    


    // useEffect(() => {
    //     if (dummy.current) {
    //         dummy.current.scrollIntoView({ block: 'end' });
    //     }
    // }, [socketLog]);

    useEffect(() => {
        if (dummy.current) {
            dummy.current.scrollIntoView({ block: 'end' });
        }
    }, [shortLog]);

    useEffect(() => {
        if (socketLog.length > 25) {
            const cut = socketLog.slice(-25);
            setShortLog(cut)
        } else {
            setShortLog(socketLog)
        }
    }, [socketLog]);


    useEffect(() => {

        

        const socket = io(`${socketHost}/${props.datasetId}/log`);

        socket.on('connect', () => {
            //log('Connected to the server');
        });

        socket.on('log', (message) => {

            //console.log('log===>', message)
            if (message!=='""'){

            
                setShortLog((curr) => { 

                    //console.log('length=',curr.length)

                    if (curr.length > 25) {
                        const cut = curr.slice(-25);
                        return [cut, message];
                    }else{
                        return [...curr, message];
                    }
                
                });
            }
            if (message.includes('Ending...')) {
                dispatch(openLoading())
                
                setTimeout((() => {
                    dispatch(setIsTraining('done'));
                    getCurrTrainingInfo()
                    dispatch(closeLoading());
                }), 8000)
            }

        })

        // 在組件卸載時斷開連接
        return () => {
            socket.disconnect();
        };
    }, []);


    return (
        <SpanWrapper>
            {shortLog.map((value, index) =>
                <LogContent key={index}>{value}</LogContent>
            )}

            <div ref={dummy} />
        </SpanWrapper>
    );
};
