import { useCallback, useEffect, useRef } from "react";
import { useDropzone, FileWithPath } from "react-dropzone";
import UploadFileItem, { isFileTypeCorrect } from "../UploadFileItem/UploadFileItem";
import { DropContainer, CustomIcon, Description, CustomSpan, FileItemContainer, Note } from "./uploadZoneStyle";
import { UploadableFile } from "../Dialogs/UploadDialog";
import { deleteDatasetImgAPI, uploadDatasetImgAPI } from "../../constant/API";
import { useDispatch, useSelector } from "react-redux";
import { createAlertMessage } from '../../redux/store/slice/alertMessage';
import { customAlertMessage } from '../../utils/utils';
import { FixedSizeList as List } from 'react-window';
import { getSelectedClass } from "../../redux/store/slice/selectedClass";


type UploadZoneProps = {
  id: string;
  dataType: string;
  files: UploadableFile[];
  setFiles: (data: any) => void;
  uploadDialogOpen: boolean;
};

const UploadZone = (props: UploadZoneProps) => {
  const { id, dataType, files, setFiles } = props;
  const dispatch = useDispatch();
  const theClass = useSelector(getSelectedClass);
  const cancelRef = useRef<any | null>(null);
  const hoveredRef = useRef<any | null>(null);

  function handleMouseOver() {
    hoveredRef.current = true;
  }

  function handleMouseOut() {
    hoveredRef.current = false;
  }


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


  const uploadFunction = useCallback((
    currUploadList: UploadableFile[],
    allLIst: UploadableFile[],
    startIdx: number,
    limit: number,
    waitFunction: any
  ) => {
    let i = 0;

    const handelWaitUpload = () => {
      if (cancelRef.current) {
        return;
      }
      new Promise((resolve, reject) => {
        const uploadFile = currUploadList[i]
        i++;
        const formData = new FormData();
        //要確定是否為classification改變formData.append的資料
        if (dataType === 'classification') {
          if (theClass.selectedClass === '') {
            formData.append('Unlabeled', uploadFile.file)
          } else {
            formData.append(theClass.selectedClass, uploadFile.file)
          }
        } else {
          formData.append(uploadFile.file.name, uploadFile.file)
        }



        uploadDatasetImgAPI(id, formData)
          .then((res) => {
            //到files去找到上傳好的檔案把isDone改true
            setFiles((fileItem: UploadableFile[]) => {
              const newList = fileItem.map((fileItem) => {
                if (fileItem.file.name === uploadFile.file.name) {
                  fileItem.isDone = true;
                  fileItem.progress = 100;
                  return fileItem
                }
                return fileItem;
              })
              return newList
            })


          })
          .catch(({ response }) => {
            console.log('Upload_ErrorMsg', response);
            if (response.status === 500) {
              setFiles((fileItem: UploadableFile[]) => {
                const newList = fileItem.map((fileItem) => {
                  if (fileItem.file.name === uploadFile.file.name) {
                    fileItem.isDone = true;
                    fileItem.progress = 0;
                    fileItem.errMessage = 'Internal server error';
                    fileItem.validColor = true;
                    return fileItem
                  }
                  return fileItem;
                })
                return newList
              })
            } else {
              setFiles((fileItem: UploadableFile[]) => {
                const newList = fileItem.map((fileItem) => {
                  if (fileItem.file.name === uploadFile.file.name) {
                    fileItem.isDone = true;
                    fileItem.progress = 0;
                    fileItem.errMessage = response.data.message ? response.data.message.includes('file') ? response.data.message.split(":")[0] : response.data.message : '';
                    fileItem.validColor = true;
                    return fileItem
                  }
                  return fileItem;
                })
                return newList
              })
            }
          }
          )
        resolve(waitFunction(currUploadList, currUploadList.length))

      }).then(() => {
        if (i < currUploadList.length) {
          handelWaitUpload()
        }
      })
    }

    //如果小於限制，可以一次全部處理，反之一次只處理50張
    if (currUploadList.length < limit) {
      for (let i = 0; i < currUploadList.length; i++) {
        handelWaitUpload()
      }
    } else {
      for (let i = 0; i < limit; i++) {
        handelWaitUpload();
      }
    }
  }, [dataType, id, setFiles, theClass.selectedClass])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newAcceptedFiles = acceptedFiles
      .filter((item: FileWithPath) => !item.path?.includes('/')) //要過濾掉上傳資料夾裡的圖片
      .filter((file) => isFileTypeCorrect(file, dataType));

    const mappedAcc = newAcceptedFiles.map((file) => ({ file, isDone: false, progress: 0 }));

    let startIdx = 0
    setFiles((curr: any) => {
      startIdx = curr.length
      return [...curr, ...mappedAcc]
    });

    uploadFunction(mappedAcc, [...files, ...mappedAcc], startIdx, 50, waitFunction)

  }, [dataType, files, setFiles, uploadFunction]);



  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
    open
  } = useDropzone({
    noClick: true,
    noKeyboard: true,
    accept: dataType === 'classification' ? { "image/*": [] } : { "image/*": [], 'text/plain': ['.txt'] },
    onDrop,
    // maxFiles: 99
  });


  function convertDelData(targetFile: File, theLabel?: string) {
    const noLabel = {
      data: {
        image_info: {
          Unlabeled: [targetFile.name]
        }
      }
    }

    const withLabel = {
      data: {
        image_info: {
          theLabel: [targetFile.name]
        }
      }
    }

    if (theLabel) return withLabel;
    else return noLabel;
  }

  const toRemove = useCallback((target: File) => {
    setFiles((curr: UploadableFile[]) => {
      const newFiles = curr.filter((item) => item.file !== target);
      return newFiles;
    })

    dispatch(createAlertMessage(customAlertMessage('success', 'Upload canceled')));
  }, [dispatch, setFiles]);


  const onDelete = useCallback((target: UploadableFile) => {
    if (target.isDone) {
      deleteDatasetImgAPI(id, convertDelData(target.file))
        .then(() => {
          const newFiles = (curr: any[]) => {
            const newFiles = curr.filter((item) => item.file !== target.file)
            return newFiles;
          }
          setFiles(newFiles);
          dispatch(createAlertMessage(customAlertMessage('success', 'Upload canceled')));
        })
        .catch(({ response }) => {
          dispatch(createAlertMessage(customAlertMessage('error', 'Cancel Uploading Fail')));
          console.log('UploadDialog-deleteDatasetImgAPI-Error', response.data.message)
        })
    } else {
      toRemove(target.file)
    }
  }, [dispatch, id, setFiles, toRemove]);



  // useEffect(() => {
  //   if (!uploadDialogOpen) {
  //     cancelRef.current = true
  //   } else {
  //     cancelRef.current = false
  //   }
  // }, [uploadDialogOpen]);

  useEffect(() => {
    return () => {
      cancelRef.current = true
    }
  }, []);


  return (
    <>
      {files && files.length === 0 ?
        <DropContainer {...getRootProps({
          isFocused,
          isDragAccept,
          isDragReject,
        })}
        >
          <input {...getInputProps()} />
          <CustomIcon sx={{ fontSize: '42px' }} />
          <Description>Drag & drop your files or
            <CustomSpan onClick={open}>browse</CustomSpan>
          </Description>
          <Note>Supported formats: 'jpg', 'jpeg', 'png', 'bmp', 'txt'.</Note> 
        </DropContainer>
        :
        <FileItemContainer
          {...getRootProps({
            isFocused,
            isDragAccept,
            isDragReject,
          })}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        >
          <List
            height={360}
            width={600}
            itemCount={files.length}
            itemSize={74}
            itemData={files}
          >
            {({ index, style, data }) => {
              return (
                <div
                  key={index}
                  style={{
                    ...style,
                    width: '568px',
                    left: '16px',
                    zIndex: hoveredRef.current ? '1' : '-1'
                    //不寫-1，drop到fileItem上會失效drop的功能，因這邊reactWindow預設style is absolute
                    //要改回1，才可以不會因為是-1選不到元素，不能cancel或顯示tooltip
                  }}
                >
                  <input {...getInputProps()} />
                  <UploadFileItem
                    key={data[index].file.lastModified}
                    currFile={data[index]}
                    onDelete={onDelete}
                    toRemove={toRemove}
                    progress={data[index].progress ?? 0}
                  />
                </div>
              );
            }}
          </List>
        </FileItemContainer >
      }
    </>
  );
}

export default UploadZone;



