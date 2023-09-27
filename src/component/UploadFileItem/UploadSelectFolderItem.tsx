import React, { useRef } from 'react';
import { CustomCancelIcon, FileWrapper, FileItem, ProgressWrapper, FileName } from './UploadFileItem';
import ProgressBar from './ProgressBar';
import InsertDriveFileRoundedIcon from '@mui/icons-material/InsertDriveFileRounded';
import { useCallback, useEffect, useState } from 'react';
import { uploadDatasetImgAPI } from '../../constant/API';
import { UploadableFile } from '../Dialogs/UploadDialog';
import { useDispatch } from 'react-redux';
import { createAlertMessage } from '../../redux/store/slice/alertMessage';
import { customAlertMessage } from '../../utils/utils';
import { FolderFilesType } from '../UploadZone/UploadFolderZone';


type UploadFileItemProps = {
  id: string;
  dataType: string;
  folderInfo: any;
  selectFolderData: FolderFilesType;
  selectFolder: UploadableFile[];
  setSelectFolder: (info: any) => void;
};


const UploadSelectFolderItem = (props: UploadFileItemProps) => {

  const { id, dataType, selectFolderData, selectFolder, setSelectFolder, folderInfo } = props;
  const [someFailed, setSomeFailed] = useState(false);
  const stopRef = useRef<any | null>(null);
  const [selectErrorCount, setSelectErrorCount] = useState(0);
  const [selectFolderCount, setSelectFolderCount] = useState(0);
  const [selectFolderLength, setSelectFolderLength] = useState(0);
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


  function handelWaitList(waitList: File[], limit: number, handleFn: any, config: any) {
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
            setSelectFolderCount((curr) => curr + 1);
          })
          .catch((err) => {
            if (err.name === "CanceledError") {
              return
            } else {
              console.log('UploadSelectFolder-ErrorMsg', err, err.response.data.message);
              setSelectErrorCount((curr) => curr + 1);

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

    if (waitList.length < limit) {
      for (let i = 0; i < waitList.length; i++) {
        handelUpload()
      }
    } else {
      for (let i = 0; i < limit; i++) {
        handelUpload()
      }
    }
  }

  useEffect(() => {
    if (!selectFolderData || stopRef.current) return;
    const abortController = new AbortController();
    const config = {
      signal: abortController.signal,
    };

    //select一次只能選一個資料夾，所以可以用[0]
    const filesInFolder = Object.values(selectFolderData)[0];

    setSelectFolderLength(filesInFolder.length);
    //上傳50個就要等等
    handelWaitList(filesInFolder, 50, waitFunction, config)

    return () => abortController.abort();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectFolderData]);



  useEffect(() => {
    //不是檔案問題的話，一樣視為完成
    if (errMessage !== '') {
      folderInfo.isDone = true;
    }

    if (selectFolderCount === 0 || selectFolderLength === 0) return;
    //正常傳完的情況要把folder改done
    if (selectFolderCount + selectErrorCount === selectFolderLength) {
      folderInfo.isDone = true;
      setSelectFolder(selectFolder);
    }
    //Folder如果裡面檔案上傳有問題，顯示something went wrong，一樣視為完成
    if (someFailed && selectFolderCount !== selectFolderLength) {
      folderInfo.isDone = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectFolderCount, selectFolderLength, errMessage])

  const countUpload = useCallback(() => {
    if (!selectFolderLength) return 0;
    else {
      const result = Math.round((selectFolderCount / selectFolderLength) * 100);
      return result;
    }
  }, [selectFolderCount, selectFolderLength]);

  const ifDone = () => {
    if (selectFolderCount + selectErrorCount === selectFolderLength || selectStop) return <></>;
    else return <CustomCancelIcon onClick={() => {
      stopRef.current = true;
      folderInfo.isDone = true;
      setSelectStop(true);
      setSelectFolder(selectFolder);
      dispatch(createAlertMessage(customAlertMessage('success', 'Stop uploading')));
    }} />
  }

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
                {selectErrorCount} files failed
              </FileName>
            : <></>}
        </ProgressWrapper>
        {ifDone()}
      </FileItem>
    </FileWrapper>
  );
};

export default UploadSelectFolderItem;


