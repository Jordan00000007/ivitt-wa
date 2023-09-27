import { EmptyDatasetImgContainer, EmptyText, EmptyWrapper, Right, Title } from "../pageStyle";
import { useCallback, useEffect, useState, MouseEvent, useContext, useMemo } from 'react';
import { AllProjectDataType, useFetchLabel } from './hook/useDataset';
import SliderCard from './components/SliderCard';
import PreviewBox from './components/PreviewBox';
import { useDispatch, useSelector } from 'react-redux';
import DatasetDialogs from './components/DatasetDialogs';
import { GetAllProjectsType } from '../../constant/API';
import { ControlBtnContainer, StyledMoreButton, StyledUploadBtn, Left, CardWrapper, PhotoContainer, StyledList } from './datasetStyle';
import { selectIteration } from "../../redux/store/slice/currentIteration"
import ProjectTag from '../../component/ProjectTag';
import { MainContext } from '../Main';
import { selectCurrentTab } from '../../redux/store/slice/currentTab';
import LabelPage from '../label/LabelPage';
import { ClassListType } from '../../component/Select/CreateSearchSelect';
import PhotoFrameItem from './components/PhotoFrame';
import DeletePhotoTab from "./components/DeletePhotoTab";
import { selectDisableBtn, setDisableBtn } from "../../redux/store/slice/disableBtn";
import { selectProjectData } from "../../redux/store/slice/projectData";
import { selectCurrentTrainInfo } from "../../redux/store/slice/currentTrainInfo";
import { selectSocketId } from "../../redux/store/slice/socketId";


export type selectCardClassType = {
  [key: string]: number
}

export type DatasetPropsType = {
  handleInitData: (data: GetAllProjectsType) => void;
  datasetInfoApiCallback: (datasetId: string) => void;
  getIterListCallback: () => void;
};

export type DeleteListItemType = {
  name: string;
  url: string
}

export type DeleteListType = {
  [key: number]: DeleteListItemType
}

export type IdSelectMapType = {
  [key: number]: Boolean;
}


function Dataset(props: DatasetPropsType) {
  const { getIterListCallback, handleInitData, datasetInfoApiCallback } = props;
  const dispatch = useDispatch();
  const { activeClassName, setActiveClassName, dataType, datasetId, combinedClass } = useContext(MainContext);
  const currentIter = useSelector(selectIteration).iteration;
  const currentTab = useSelector(selectCurrentTab).tab;
  const disableBtn = useSelector(selectDisableBtn).disableBtn;
  const projectData = useSelector(selectProjectData).projectData;
  const trainData = useSelector(selectCurrentTrainInfo).currTrain;
  const socketId = useSelector(selectSocketId).socketId;
  const [cardNumberLength, setCardNumberLength] = useState(0);
  const [currIndex, setCurrIndex] = useState<number | any>(0);
  const [imgDataList, setImgDataList] = useState<string[]>([]);
  const [currentClass, setCurrentClass] = useState<selectCardClassType>({});
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [openDeleteTab, setOpenDeleteTab] = useState(false);
  const [anchorMoreButton, setAnchorMoreButton] = useState<null | HTMLElement>(null);
  const [searchValue, setSearchValue] = useState<ClassListType | null>(null);
  const { imgLabelData, getImgLabelAPICallback } = useFetchLabel(datasetId, imgDataList[currIndex], currentTab);
  const [selectPhotoList, setSelectPhotoList] = useState<any[]>([]);
  const [idSelectMap, setIdSelectMap] = useState<IdSelectMapType>({});

  const hideDelIterBtn = trainData[socketId] && trainData[socketId]?.status && currentIter === trainData[socketId]?.iteration;
  const workspaceInfo = projectData['workspace'];


  const checkCardNumber = useCallback((projectData: AllProjectDataType, activeIter: string) => {
    const checkedIter = projectData[activeIter] ? activeIter : 'workspace';
    const cardNumber = projectData[checkedIter].sortClass.length;
    setCardNumberLength(cardNumber);
  }, []);

  const handleImgClick = (e: MouseEvent<HTMLDivElement>) => {
    setCurrIndex(Number(e.currentTarget.id));
  };


  const selectImgTotal = useMemo(() => {
    let total: number;
    if (activeClassName === 'All') {
      total = workspaceInfo?.All
    }
    else if (activeClassName === 'Unlabeled') {
      total = workspaceInfo?.Unlabeled
    }
    else {
      total = workspaceInfo?.classInfo[activeClassName]?.nums
    }

    return total;
  }, [activeClassName, workspaceInfo]);


  const handleMoreButtonClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      setAnchorMoreButton(event.currentTarget);
    },
    [setAnchorMoreButton]
  );


  const handleMenuClose = useCallback(() => {
    setAnchorMoreButton(null);
  }, [setAnchorMoreButton]);


  const initDeleteData = useMemo(() => {
    const delInfo: Record<number, DeleteListItemType> = {};
    const selectListMap: Record<number, boolean> = {};

    imgDataList.map((url, index) => {
      const name = url.split("/").pop();
      delInfo[index] = {
        name: name ? name : '',
        url: url
      }
      selectListMap[index] = false;
    })

    setIdSelectMap(selectListMap)
    return {
      delInfo,
    };

  }, [imgDataList]);


  const photos = useCallback(() => {
    return (
      <StyledList
        height={693}
        width={705}
        itemCount={Math.ceil(imgDataList.length / 5)}
        itemSize={141}
        itemData={initDeleteData.delInfo}
      >
        {({ index, style, data }) => {
          return (
            <div
              key={index}
              style={{
                ...style,
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
              }}
            >
              {Array.from({ length: 5 }).map((_d, idx) => {
                const i = index * 5 + idx
                if (!initDeleteData.delInfo[i]) {
                  return null
                }

                return (
                  <PhotoFrameItem
                    key={i}
                    hoveredIndex={i}
                    value={initDeleteData.delInfo[i]}
                    selectPhotoList={selectPhotoList}
                    setSelectPhotoList={setSelectPhotoList}
                    currIndex={currIndex}
                    handleImgClick={handleImgClick}
                    idSelectMap={idSelectMap}
                    openDeleteTab={openDeleteTab}
                  />
                )
              })
              }
            </div>
          );
        }}
      </StyledList>
    )
  }, [currIndex, idSelectMap, imgDataList.length, initDeleteData.delInfo, openDeleteTab, selectPhotoList])

  const rightSideContent = useCallback(() => {
    if (currentIter !== 'workspace') {
      return (
        <PreviewBox
          currIndex={currIndex}
          setCurrIndex={setCurrIndex}
          imgDataList={imgDataList}
          activeIter={currentIter}
          imgLabelData={imgLabelData}
        />
      )
    } else {
      //is in workspace
      if ((selectPhotoList.length >= 0 && openDeleteTab)) {
        return (
          <DeletePhotoTab
            selectPhotoList={selectPhotoList}
            setSelectPhotoList={setSelectPhotoList}
            setCurrIndex={setCurrIndex}
            selectImgTotal={selectImgTotal}
            setIdSelectMap={setIdSelectMap}
            imgDataListLength={imgDataList.length}
            setOpenDeleteTab={setOpenDeleteTab}
            initDeleteData={initDeleteData}
          />
        )
      } else {
        return (
          <PreviewBox
            currIndex={currIndex}
            setCurrIndex={setCurrIndex}
            imgDataList={imgDataList}
            activeIter={currentIter}
            imgLabelData={imgLabelData}
          />
        )
      }
    }

  }, [currIndex, currentIter, imgDataList, imgLabelData, initDeleteData, openDeleteTab, selectImgTotal, selectPhotoList])


  const confirmInitData = useCallback((imgDataList: string[]) => {
    if (!workspaceInfo) return null;
    //workspaceInfo.sortClass.length === 0 因為有可能是有其他class只是數量都是0
    if (currentIter === 'workspace' && workspaceInfo && workspaceInfo.All === 0 && workspaceInfo.sortClass.length === 0) {
      return (
        <EmptyWrapper style={{ minHeight: 'calc(100vh - 150px)' }}>
          <EmptyText>Please upload dataset.</EmptyText>
          <StyledUploadBtn
            style={{ margin: '0' }}
            onClick={() => {
              setOpenUploadDialog(true);
            }}
          >Upload
          </StyledUploadBtn>
        </EmptyWrapper>
      )
    } else {
      return (
        <div style={{ display: 'flex', width: '1200px' }}>
          <Left>
            <CardWrapper>
              <SliderCard
                cardNumberLength={cardNumberLength}
                currentClass={currentClass}
                setCurrentClass={setCurrentClass}
                activeClassName={activeClassName}
                setActiveClassName={setActiveClassName}
                setImgDataList={setImgDataList}
              />
              <PhotoContainer>
                {imgDataList.length === 0 ?
                  <EmptyDatasetImgContainer>
                    <div>No images</div>
                  </EmptyDatasetImgContainer>
                  :
                  photos()
                }
              </PhotoContainer>
            </CardWrapper>
          </Left>
          <Right>
            {rightSideContent()}
          </Right>
        </div>
      )
    }
  }, [activeClassName, cardNumberLength, currentClass, currentIter, photos, rightSideContent, setActiveClassName, workspaceInfo])


  useEffect(() => {
    if (openDeleteTab) {
      dispatch(setDisableBtn(true));
    } else {
      dispatch(setDisableBtn(false));
    }
  }, [dispatch, openDeleteTab]);

  useEffect(() => {
    checkCardNumber(projectData, currentIter)
  }, [currentIter, checkCardNumber, projectData]);


  useEffect(() => {
    //切到label再切回dataset會導致reference改變而被重新設成0
    //disable currentTab in reference可以避免切換到label就被觸發
    if (currentIter && activeClassName && currentTab === 'Dataset') setCurrIndex(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeClassName, currentIter]);


  useEffect(() => {
    if (selectPhotoList.length > 0) setOpenDeleteTab(true)
  }, [selectPhotoList.length]);

  useEffect(() => {
    if (currIndex + 1 > imgDataList.length) {
      setCurrIndex(0)
    }
  }, [currIndex, imgDataList.length]);



  return (
    <>
      <div
        style={{
          display: currentTab === 'Label' ? 'none' : '',
          visibility: currentTab === 'Label' ? 'hidden' : 'visible'

        }}>
        <Title>Dataset
          <div style={{ position: 'absolute', left: '94px', top: '-3.5px' }}>
            <ProjectTag className={'green'} text={dataType} />
          </div>
          <ControlBtnContainer>
            <StyledMoreButton
              hide={currentIter === 'workspace' || hideDelIterBtn}
              onClick={(e) => {
                handleMoreButtonClick(e);
              }}
            />
            {workspaceInfo && workspaceInfo.All === 0 && workspaceInfo.sortClass.length === 0 ?
              null
              :
              <StyledUploadBtn
                className={currentIter === 'workspace' ? '' : 'hide'}
                onClick={() => {
                  setOpenUploadDialog(true);
                }}
                disabled={disableBtn}
              >Upload
              </StyledUploadBtn>
            }
          </ControlBtnContainer>
        </Title>
        {confirmInitData(imgDataList)}

        <DatasetDialogs
          combinedClass={combinedClass}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          datasetInfoApiCallback={datasetInfoApiCallback}
          anchorMoreButton={anchorMoreButton}
          openUploadDialog={openUploadDialog}
          setOpenUploadDialog={setOpenUploadDialog}
          handleMenuClose={handleMenuClose}
          activeIter={currentIter}
          setActiveClassName={setActiveClassName}
          getIterListCallback={getIterListCallback}
          handleInitData={handleInitData}
        />
      </div>

      {currentTab === 'Label' ?
        <div style={{ marginTop: '24px' }}>
          <LabelPage
            tab={currentTab}
            combinedClass={combinedClass}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            datasetInfoApiCallback={datasetInfoApiCallback}
            imgDataList={imgDataList}
            currIndex={currIndex}
            setCurrIndex={setCurrIndex}
            handleImgClick={handleImgClick}
            currentClass={currentClass}
            imgLabelData={imgLabelData}
            getImgLabelAPICallback={getImgLabelAPICallback}
            setImgDataList={setImgDataList}
          />
        </div>
        :
        <></>
      }
    </>
  );
}

export default Dataset;
