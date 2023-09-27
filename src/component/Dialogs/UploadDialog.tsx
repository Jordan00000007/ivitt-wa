import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import Dialog, { DialogProps } from './Dialog';
import { ActiveRedGrayBtn } from '../Buttons/ButtonStyle';
import { Title, ActionContainer, StyledButton } from './commonDialogsStyle';
import CreateSearchSelect, { ClassListType } from '../Select/CreateSearchSelect';
import { getAllProjectsAPI, GetAllProjectsType } from '../../constant/API';
import { closeLoading, openLoading } from '../../redux/store/slice/loading';
import { useDispatch } from 'react-redux';
import UploadFolderZone from '../UploadZone/UploadFolderZone';
import QuitUploadDialog from './QuitUploadDialog';
import { setSelectedClass } from '../../redux/store/slice/selectedClass';
import { setIteration } from '../../redux/store/slice/currentIteration';
import UploadZone from '../UploadZone/UploadZone';


const ContentWrapper = styled.div`
  height: 392px;
  display: flex;
  flex-direction: column;
`

const StyledActiveRedGrayBtn = styled(ActiveRedGrayBtn)`
   margin-Left: 10px;
`

type UploadDialogProps = DialogProps & {
  id: string;
  dataType: string;
  datasetInfoApiCallback: (id: string) => void;
  handleInitData: (data: GetAllProjectsType) => void;
  setActiveClassName: (data: string) => void;
  setOpenUploadDialog: (open: boolean) => void;
  combinedClass: ClassListType[];
  searchValue: ClassListType | null;
  setSearchValue: (value: ClassListType | null) => void;
}
export interface UploadableFile {
  file: File | any;
  isDone: boolean;
  progress?: number;
  validColor?: boolean;
  errMessage?: string;
}


export const checkIfReady = (list: UploadableFile[]) => {
  const notReady: boolean[] = [];
  list.forEach((v) => { if (v.isDone === false) notReady.push(v.isDone) })
  if (notReady.length > 0) return false;
  else return true;
}


const UploadDialog = (props: UploadDialogProps) => {
  const { combinedClass, setOpenUploadDialog, open, dataType, id,
    handleClose, datasetInfoApiCallback, handleInitData, setActiveClassName,
    searchValue, setSearchValue,
    ...restProps } = props;
  const dispatch = useDispatch();
  const [active, setActive] = useState<"files" | "folders">("files");
  const [files, setFiles] = useState<UploadableFile[]>([]);
  const [folderItem, setFolderItem] = useState<UploadableFile[]>([]);
  const [selectFolder, setSelectFolder] = useState<UploadableFile[]>([]);
  const [openQuit, setOpenQuit] = useState<boolean>(false);
  const [classList, setClassList] = useState<ClassListType[]>([]);


  const isFolderLoadingReady = useCallback((folderList: UploadableFile[]) => {
    return checkIfReady(folderList);
  }, [])

  const isFilesLoadingReady = useCallback((fileList: UploadableFile[]) => {
    return checkIfReady(fileList);
  }, [])

  const isSelectFolderLoadingReady = useCallback((theSelectFolder: UploadableFile[]) => {
    return checkIfReady(theSelectFolder);
  }, [])

  const handleUploadRefresh = () => {
    dispatch(openLoading());
    getAllProjectsAPI()
      .then(({ data }) => {
        handleInitData(data.data);
        datasetInfoApiCallback(id);
        handleClose();
        dispatch(setIteration('workspace'));
        setActiveClassName('All');
        setFiles([]);
        setFolderItem([]);
        setSelectFolder([]);
      })
      .catch((err) => console.log('DatasetDialog-getAllProjectsAPI-Error', err))
      .finally(() => dispatch(closeLoading()));
  }

  const clearList = () => {
    setFiles([]);
    setFolderItem([]);
    setSelectFolder([]);
  }

  const handleCancel = () => {
    const allEmpty = files.length === 0 && folderItem.length === 0 && selectFolder.length === 0;
    const eitherListNotEmpty = files.length > 0 || folderItem.length > 0 || selectFolder.length > 0;

    if (files.length === 0) {
      setClassList(combinedClass)
    }

    if (allEmpty) {
      handleClose();
      clearList();
    } else {
      //任一清單不是空的，而且都為完成狀態，就refresh
      if (eitherListNotEmpty && isFilesLoadingReady(files) && isFolderLoadingReady(folderItem) && isSelectFolderLoadingReady(selectFolder)) {
        handleClose();
        handleUploadRefresh();
      } else {
        //如果quit是關的就打開
        if (openQuit === false) {
          setOpenQuit(true)
        } else {
          //如果已經開著，就直接清空清單並refresh
          setOpenQuit(false);
          handleClose();
          clearList();
          handleUploadRefresh();
        }
      }
    }
    //重新把redux跟newClass設為''
    dispatch(setSelectedClass(''))
    setSearchValue(null)
  };

  const handleTabClick = useCallback(() => {
    const allEmpty = files.length === 0 && folderItem.length === 0 && selectFolder.length === 0;
    if (allEmpty) {
      return (
        <>
          <StyledActiveRedGrayBtn active={active === "files"} onClick={() => setActive('files')}>Files</StyledActiveRedGrayBtn>
          <StyledActiveRedGrayBtn active={active === "folders"} onClick={() => setActive('folders')}>Folders</StyledActiveRedGrayBtn>
        </>
      )
    } else {
      if (files.length > 0) {
        return (
          <>
            <StyledActiveRedGrayBtn active={active === "files"} onClick={() => setActive('files')}>Files</StyledActiveRedGrayBtn>
            <StyledActiveRedGrayBtn disabled active={active === "folders"} onClick={() => setActive('folders')}>Folders</StyledActiveRedGrayBtn>
          </>
        )
      } else {
        return (
          <>
            <StyledActiveRedGrayBtn disabled active={active === "files"} onClick={() => setActive('files')}>Files</StyledActiveRedGrayBtn>
            <StyledActiveRedGrayBtn active={active === "folders"} onClick={() => setActive('folders')}>Folders</StyledActiveRedGrayBtn>
          </>
        )
      }
    }
  }, [active, files.length, folderItem.length, selectFolder.length])


  useEffect(() => {
    setClassList(combinedClass)
  }, [combinedClass, setSearchValue]);


  return (
    <>
      <Dialog style={{ width: '680px', margin: '30px 40px', overflow: 'hidden' }}
        open={open} handleClose={() => { }} {...restProps}>
        <Title style={{ marginBottom: '20px' }}>Upload
          {handleTabClick()}
        </Title>
        <ContentWrapper>
          {dataType === 'classification' && active === "files" ?
            <CreateSearchSelect
              id={id}
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              classList={classList}
              hasUploadFile={!!files.length}
            />
            : null
          }
          {active === "files" ?

            <UploadZone
              id={id}
              dataType={dataType}
              files={files}
              setFiles={setFiles}
              uploadDialogOpen={open}
            />
            :
            <UploadFolderZone
              id={id}
              dataType={dataType}
              folderItem={folderItem}
              setFolderItem={setFolderItem}
              selectFolder={selectFolder}
              setSelectFolder={setSelectFolder}
            />
          }
        </ContentWrapper>
        <ActionContainer>
          <StyledButton style={{ marginBottom: '0' }} onClick={handleCancel}>
            Close
          </StyledButton>
        </ActionContainer>
      </Dialog >

      <QuitUploadDialog
        open={openQuit}
        setOpenQuit={setOpenQuit}
        handleQuitClose={handleCancel}
        handleClose={handleCancel}
      />


    </>
  );
};

export default UploadDialog;
