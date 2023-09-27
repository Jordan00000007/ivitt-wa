import { useCallback, useEffect, useRef, useState } from 'react';
import { CustomCancelIcon, FileItem, FileName, FileWrapper, isFileTypeCorrect, ProgressWrapper } from './UploadFileItem';
import { uploadDatasetImgAPI } from '../../constant/API';
import { FolderFilesType } from '../UploadZone/UploadFolderZone';
import { UploadableFile } from '../Dialogs/UploadDialog';
import ProgressBar from './ProgressBar';
import InsertDriveFileRoundedIcon from '@mui/icons-material/InsertDriveFileRounded';
import { useDispatch } from 'react-redux';
import { createAlertMessage } from '../../redux/store/slice/alertMessage';
import { customAlertMessage } from '../../utils/utils';

type UploadFileItemProps = {
  id: string;
  dataType: string;
  folderInfo: any;
  folderFiles: FolderFilesType;
  folderItem: UploadableFile[];
  setFolderItem: (info: any) => void;
};


const UploadFolderItem = (props: UploadFileItemProps) => {

  const { id, dataType, folderFiles, folderItem, setFolderItem, folderInfo } = props;
  const [currentFileLength, setCurrentFileLength] = useState(0);
  const [count, setCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [someFailed, setSomeFailed] = useState(false);
  const stopRef = useRef<any | null>(null);
  const [selectStop, setSelectStop] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const dispatch = useDispatch();

  const waitFunction = (t: File, fileLength: number) => {
    // 用setTimeout模擬async
    let waitSec = 1200;
    if (fileLength < 50) {
      return;
    } else if (fileLength > 100 && fileLength < 1000) {
      waitSec = 1500;
    } else if (fileLength > 1000 && fileLength < 3000) {
      waitSec = 2500;
    } else if (fileLength > 3000 && fileLength < 5000) {
      waitSec = 3000;
    } else {
      waitSec = 5000;
    }

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({ t });
      }, waitSec);
    })
  }


  const handelWaitList = (waitList: File[], limit: number, handleFn: any, config: any) => {
    let index = 0;

    const handelUpload = () => {
      if (stopRef.current === true) return;
      new Promise((resolve, reject) => {

        const folderFile = waitList[index];
        index++;
        const formData = new FormData();

        if (dataType === 'classification') {
          formData.append(folderInfo.file.name, folderFile)
        } else {
          formData.append(folderFile.name, folderFile);
        }

        uploadDatasetImgAPI(id, formData, config)
          .then((res) => {
            setCount((curr) => curr + 1);
          })
          .catch((err) => {
            if (err.name === "CanceledError") {
              return
            } else {
              console.log('UploadFolder-Error', folderFile.name, err.response.data.message);
              setErrorCount((curr) => curr + 1);

              if (err.response.status !== 500) {
                if (err.response.data.message.includes('file')) {
                  setSomeFailed(true);
                } else {
                  setErrMessage(err.response.data.message)
                  stopRef.current = true;
                  setSomeFailed(true);
                }
              } else {
                setErrMessage('Internal server error')
                stopRef.current = true;
                setSomeFailed(true);
              }

            }
          })
        resolve(handleFn(folderFile, waitList.length))

      }).then(() => {
        if (index < waitList.length) {
          handelUpload()
        }
      })
    }

    //如果小於限制(50)，可以一次全部處理，反之一次只處理50張
    if (waitList.length < limit) {
      for (let i = 0; i < waitList.length; i++) {
        handelUpload()
      }
    } else {
      for (let i = 0; i < limit; i++) {
        handelUpload();
      }
    }
  }

  useEffect(() => {
    const folderFileList = folderFiles[folderInfo.file.name];
    if (!folderFiles || !folderFileList) return;
    const abortController = new AbortController();
    const config = {
      signal: abortController.signal,
    };

    const acceptList = folderFileList.filter((item: File) => isFileTypeCorrect(item, dataType));
    setCurrentFileLength(acceptList.length);

    //folderFile-上傳的File
    //acceptList-上傳過濾後清單
    //folderInfo-有含isDone{file: File{name:'123'}, isDone: false}'

    handelWaitList(acceptList, 50, waitFunction, config)


    return () => {
      abortController.abort();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  useEffect(() => {
    //不是檔案問題的話，一樣視為完成
    if (errMessage !== '') {
      folderInfo.isDone = true;
    }

    if (count === 0 || currentFileLength === 0) return;
    //正常傳完的情況要把folder改done
    if (count + errorCount === currentFileLength) {
      folderInfo.isDone = true;
    }
    //Folder如果裡面檔案上傳有問題，顯示something went wrong，一樣視為完成
    if (someFailed && count !== currentFileLength) {
      folderInfo.isDone = true;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, currentFileLength, errMessage])


  const countUpload = useCallback(() => {
    if (!currentFileLength) return 0;
    else {
      const result = Math.round((count / currentFileLength) * 100);
      return result;
    }
  }, [count, currentFileLength]);


  const ifDone = () => {
    if (count + errorCount === currentFileLength || selectStop) return <></>;
    else return <CustomCancelIcon
      className='hide'
      onClick={() => {
        stopRef.current = true;
        folderInfo.isDone = true;
        setSelectStop(true);
        setFolderItem(folderItem)
        dispatch(createAlertMessage(customAlertMessage('success', 'Stop uploading')));
      }} />
  }

  if (!folderFiles) return <></>;

  return (
    <FileWrapper>
      <FileItem validFailed={false}>
        <InsertDriveFileRoundedIcon />
        <ProgressWrapper>
          <FileName>{folderInfo.file.name}</FileName>
          <ProgressBar value={countUpload()} />
          {someFailed ?
            errMessage !== '' ?
              <FileName style={{ fontSize: '13px' }}>
                {errMessage}
              </FileName>
              : <FileName style={{ fontSize: '13px' }}>
                {errorCount} files failed
              </FileName>
            : <></>}
        </ProgressWrapper>
        {ifDone()}
      </FileItem>
    </FileWrapper>
  );
};

export default UploadFolderItem;