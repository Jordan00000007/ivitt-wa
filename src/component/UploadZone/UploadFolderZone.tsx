import { ChangeEvent, useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { isFileTypeCorrect } from "../UploadFileItem/UploadFileItem";
import { DropContainer, CustomIcon, Description, CustomSpan, FileItemContainer } from "./uploadZoneStyle";
import { UploadableFile } from "../Dialogs/UploadDialog";
import UploadFolderItem from "../UploadFileItem/UploadFolderItem";
import UploadSelectFolderItem from "../UploadFileItem/UploadSelectFolderItem";
import React from "react";
import { createAlertMessage } from "../../redux/store/slice/alertMessage";
import { customAlertMessage } from "../../utils/utils";
import { useDispatch } from "react-redux";


type UploadZoneProps = {
  id: string;
  dataType: string;
  folderItem: UploadableFile[];
  setFolderItem: (info: any) => void;
  selectFolder: UploadableFile[];
  setSelectFolder: (info: any) => void;
};

declare global {
  interface Window {
    showDirectoryPicker: any;
  }
}

export type FolderFilesType = {
  [key: string]: File[];
};



const UploadZone = (props: UploadZoneProps) => {
  const dispatch = useDispatch();
  const { id, dataType, folderItem, setFolderItem, selectFolder, setSelectFolder } = props;
  const [folderFiles, setFolderFiles] = useState<FolderFilesType>({});
  const [selectFolderData, setSelectFolderData] = useState<Record<string, File[]>>({});


  async function readFolderFiles(folderEntries: FileSystemDirectoryEntry) {
    const nameAndFiles: Record<string, File[]> = {};
    let directoryReader = folderEntries.createReader();
    let res: File[] = [];

    // @ts-ignore
    async function read() {
      const filesInFolder: any = await new Promise((resolve, reject) =>
        directoryReader.readEntries((entries: any[]) => {
          //濾掉folder
          const fileEntries = entries.filter((entry: FileSystemFileEntry) => entry.isFile);
          const filesPromise = fileEntries.map((entry: FileSystemFileEntry) => new Promise((resolve) => entry.file((file) => {
            resolve(file);
          })))
          Promise.all(filesPromise).then(resolve, reject);
        }, reject));

      res = [...res, ...filesInFolder];

      if (filesInFolder.length < 100) {
        const validFileList = res.filter((file: File) => isFileTypeCorrect(file, dataType));
        if (validFileList.length > 0) nameAndFiles[folderEntries.name] = validFileList;
        return nameAndFiles;
      }

      return read();
    }

    return read();
  };

  async function scanFolders(folderEntries: FileSystemDirectoryEntry[]) {
    let isDirectoryFiles: Object = {};
    for (let i = 0; i < folderEntries.length; i++) {
      const fileListInFolder = await readFolderFiles(folderEntries[i]);
      isDirectoryFiles = { ...isDirectoryFiles, ...fileListInFolder }
    }
    return isDirectoryFiles;
  }

  async function handleAcceptedFileList(files: any) {
    let fileList: File[] = [];
    for (let i = 0; i < files.length; i++) {
      //只留是folder(type會是'')才push，不是的就不做成map清單
      const file = files[i];
      if (file.type === '') fileList.push(file);
    }
    return fileList;
  }

  async function myCustomFileGetter(event: any) {
    let result: File[] = [];
    let directories: FileSystemDirectoryEntry[] = [];
    //1. only Dnd, Select will use getDir to handel
    //2. Folder or File?
    //3. 要過濾掉檔案不合法的
    if (event.dataTransfer && event.type === "drop") {
      let { items = {}, files = [] } = event.dataTransfer;
      for (let i = 0; i < items.length; i++) {
        const theFolderEntry = items[i].webkitGetAsEntry(); //theFolderEntry.isDirectory=true是folder
        if (theFolderEntry && theFolderEntry.isDirectory) {
          directories.push(theFolderEntry)
        }
      }
      const theFolderFileList: any = await scanFolders(directories);
      setFolderFiles(theFolderFileList)
      //過濾要做acceptFiles的清單,只有至少有一內容是合法的才顯示
      const getFiles = await handleAcceptedFileList(files);
      const confirmFileName = Object.keys(theFolderFileList);
      result = getFiles.filter((item) => confirmFileName.includes(item.name))
      return result;
    }
    return result;
  }

  async function onUploadHandler(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    const folderName = e.target.files[0]?.webkitRelativePath.split("/")[0];
    const folderFiles = Object.values(e.target.files);
    const nameAndFiles: Record<string, File[]> = {}

    try {
      const promises = [];
      for (const file of folderFiles) {
        if (isFileTypeCorrect(file, dataType)) promises.push(file);
      }
      const allFileList = await Promise.all(promises);
      //不是圖檔會是undefine所以過濾掉
      const results = allFileList.filter(element => {
        return element !== undefined;
      });

      nameAndFiles[folderName] = results;
      //確定都是至少有圖檔才做成selectFolder清單，只上傳合法資料
      if (results.length > 0) {
        setSelectFolder([{ file: { name: folderName }, isDone: false }]);
        setSelectFolderData(nameAndFiles)
      } else {
        setSelectFolder([]);
        dispatch(createAlertMessage(customAlertMessage('error', 'Not valid file type')));
      }
    } catch (error) {
      console.log('Exception', error)
    }
  }


  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const mappedAcc = acceptedFiles.map((file) => ({ file, isDone: false }));
    setFolderItem((curr: any) => [...curr, ...mappedAcc]);
  }, [setFolderItem]);


  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
    isDragActive,
  } = useDropzone({
    noClick: true,
    noKeyboard: true,
    onDrop,
    useFsAccessApi: true,
    getFilesFromEvent: event => myCustomFileGetter(event),
  });


  return (
    <>
      {folderItem.length === 0 && selectFolder.length === 0 ?
        <DropContainer {...getRootProps({ isFocused, isDragAccept, isDragReject, isDragActive })}>
          <CustomIcon sx={{ fontSize: '42px' }} />
          <Description>Drag & drop your folders or
            <CustomSpan>
              {/* @ts-expect-error */}
              <input {...getInputProps()} directory="" webkitdirectory="" type="file" onChange={onUploadHandler} />
              browse
            </CustomSpan>
          </Description>
        </DropContainer>
        :
        <FileItemContainer
          {...getRootProps({ isFocused, isDragAccept, isDragReject, isDragActive })}>
          <input {...getInputProps()} />
          {selectFolder && selectFolder.length ?
            selectFolder.map((folderInfo, index) => (
              <UploadSelectFolderItem
                key={index}
                id={id}
                dataType={dataType}
                folderInfo={folderInfo}
                selectFolder={selectFolder}
                setSelectFolder={setSelectFolder}
                selectFolderData={selectFolderData}
              />
            ))
            : null
          }
          {folderItem && folderItem.length ?
            folderItem.map((folderInfo, index) => (
              <UploadFolderItem
                key={index}
                id={id}
                dataType={dataType}
                folderInfo={folderInfo}
                folderFiles={folderFiles}
                folderItem={folderItem}
                setFolderItem={setFolderItem}
              />
            ))
            : null}
        </FileItemContainer>
      }
    </>
  );
}

export default UploadZone;
