import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import Header from '../../component/Header/Header';
import Projects from '../../pages/projects/Projects';

import AutoLabel from '../../pages/autoLabel';

import Main from '../../pages/Main'
import { useAllProjectInit } from '../../pages/projects/hook/useAllProjects';
import { createContext, useCallback, useEffect, useState } from 'react';
import { socketHost } from '../../constant/API/APIPath';
import { io } from 'socket.io-client'
import { useDispatch, useSelector } from 'react-redux';
import { createAlertMessage } from '../../redux/store/slice/alertMessage';
import { customAlertMessage } from '../../utils/utils';
import { getShareUrlAPI, exportIcapAPI } from '../../constant/API/exportAPI';
import ShowURLDialog from '../../component/Dialogs/ShowURLDialog';
import { selectColorBar, setColorBars } from '../../redux/store/slice/colorBar';
import { getColorBarAPI } from '../../constant/API';


const Wrapper = styled.div`
  background-color: ${props => props.theme.color.base_1};
`;

type ConvertDataType = {
  currID: string;
  currPlatform: string;
  currIter: string;
  selectExportTo: FormDataEntryValue | null;
};

export const convertInfoInit = {
  currID: '',
  currPlatform: '',
  currIter: '',
  selectExportTo: ''
}

export const WsContext = createContext<{
  ws: any;
  setWs: (ws: any) => void;
  convertId: string;
  setConvertId: (ws: string) => void;
  convertInfo: ConvertDataType;
  setConvertInfo: (data: ConvertDataType) => void;
  setOpenURLDialog: (data: boolean) => void;
  setURL: (data: string) => void;
}>({
  ws: null,
  setWs: () => undefined,
  convertInfo: convertInfoInit,
  setConvertInfo: () => undefined,
  convertId: '',
  setConvertId: () => undefined,
  setOpenURLDialog: () => undefined,
  setURL: () => undefined,
});

function LoginLayout() {
  const dispatch = useDispatch();
  const colorBars = useSelector(selectColorBar).colorBar;
  const pathname = useLocation().pathname;
  const currentID = pathname.split("/").pop();
  const { initData, handleInitData, noInitData } = useAllProjectInit(pathname);
  const [ws, setWs] = useState<any>(null);
  const [convertInfo, setConvertInfo] = useState<ConvertDataType>(convertInfoInit);
  const [openURLDialog, setOpenURLDialog] = useState(false);
  const [URL, setURL] = useState<string>('');
  const [convertId, setConvertId] = useState<string>('');




  const handelSetDefault = useCallback(() => {
    ws.removeAllListeners(['convert_log'])
    setConvertInfo(convertInfoInit)
    setConvertId('');
  },
    [ws]
  );

  const handelResult = useCallback(() => {
    if (convertInfo.currIter === '') return;
    if (convertInfo.selectExportTo === 'iCAP') {
      exportIcapAPI(convertInfo.currID, { iteration: convertInfo.currIter })
        .then(({ data }) => {
          dispatch(createAlertMessage(customAlertMessage('success', 'Export success')));
        })
        .catch(({ response }) => {
          if (response.status === 400) dispatch(createAlertMessage(customAlertMessage('error', response.data.message)));
          else dispatch(createAlertMessage(customAlertMessage('error', "Export to iCAP failed")));
        })
        .finally(() => {
          handelSetDefault();
        })
    } else {
      getShareUrlAPI(convertInfo.currID, { iteration: convertInfo.currIter })
        .then(({ data }) => {
          if (convertInfo.selectExportTo === 'URL') {
            setURL(`http://${data.data.url}`);
            setOpenURLDialog(true);
            dispatch(createAlertMessage(customAlertMessage('success', 'Success')));
            handelSetDefault();
          }
          if (convertInfo.selectExportTo === 'local') {
            window.location.href = `http://${data.data.url}`;
            dispatch(createAlertMessage(customAlertMessage('success', 'Success')));
            handelSetDefault();
          }
        })
        .catch(({ response }) => {
        })
        .finally(() => {
          handelSetDefault();
        })
    }

  },
    [convertInfo.currID, convertInfo.currIter, convertInfo.selectExportTo, dispatch, handelSetDefault]
  );


  const connectWebSocket = useCallback(() => {

    if (ws && ws.connected && convertId === '' && currentID !== 'allProjects') {
      ws.disconnect();
      ws.removeAllListeners(['convert_log']);
      setTimeout((() => {
        setWs(io(`${socketHost}/${currentID}/log`));
      }), 500)
      return;
    }

    if (!ws && currentID !== 'allProjects') {
      setWs(io(`${socketHost}/${currentID}/log`));
      return;
    }

  }, [convertId, currentID, ws])


  const listenToSocket = useCallback(() => {
    if (ws) {
      ws.on('convert_log', (message: any) => {
        if (message.includes('Success')) {
          handelResult()
        }
        if (message.includes('Downloading')) {
          dispatch(createAlertMessage(customAlertMessage('convert', 'Downloading...')));
        }
        if (message.includes('%')) {
          dispatch(createAlertMessage(customAlertMessage('convert', `converting ${JSON.parse(message)}`)));
        }
        if (message.includes('Failure')) {
          dispatch(createAlertMessage(customAlertMessage('error', message)));
          handelSetDefault();
        }
      });
    }
  },
    [dispatch, handelResult, handelSetDefault, ws]
  );


  useEffect(() => {
    if (convertId === '') return;

    listenToSocket();

    return () => {
      if (ws !== null && convertId === '') {
        ws.removeAllListeners(['convert_log']);
      }
    }

  }, [convertId, listenToSocket, ws]);


  useEffect(() => {
    if (currentID === '' || currentID === 'allProjects') return;
    connectWebSocket();
  }, [connectWebSocket, currentID]);


  useEffect(() => {
    if (Object.keys(colorBars).length !== 0) return;

    getColorBarAPI().then(({ data }) => {
      dispatch(setColorBars(data.data))
    });
  }, [colorBars, dispatch]);


  //如果initData.length = 0 就return，有錯誤會連Header都出不來

  return (
    <WsContext.Provider
      value={{ ws, setWs, convertInfo, setConvertInfo, convertId, setConvertId, setOpenURLDialog, setURL }}
    >
      <div style={{ overflow: 'hidden', position: 'relative' }}>
        <Header handleInitData={handleInitData} />
        <Wrapper>
          <Routes>
            <Route path='/allProjects' element={<Projects noInitData={noInitData} initData={initData} handleInitData={handleInitData} />} />
            <Route path='main/:type/:id' element={<Main handleInitData={handleInitData} />} />
            <Route path='/*' element={<Navigate to='/allProjects' />} />
          </Routes>
          <ShowURLDialog
            open={openURLDialog}
            handleClose={() => {
              setOpenURLDialog(false);
              setURL('')
            }}
            URLValue={URL}
          />
        </Wrapper>
      </div>

    

    </WsContext.Provider>
  );
}

export default LoginLayout;


