import { StyledBtnOutline, SubTitle, Title } from "../pageStyle";
import DriveFileRenameOutlineSharpIcon from '@mui/icons-material/DriveFileRenameOutlineSharp';
import { createContext, Dispatch, SetStateAction, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import AnnotationLabel from '../../component/Label/AnnotationLabel';
import NavigationIcon from '@mui/icons-material/Navigation';
import CheckBoxOutlineBlankOutlinedIcon from '@mui/icons-material/CheckBoxOutlineBlankOutlined';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CreateSearchSelect, { ClassListType } from '../../component/Select/CreateSearchSelect';
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentTab, setCurrentTab } from '../../redux/store/slice/currentTab';
import { apiHost } from '../../constant/API/APIPath';
import { Annotation, Class, ClassBlock, EditBar, EditButton, LabelEditIcon, LabelBlock, Main, MainPhoto, MainPhotoFrame, Photo, PhotoDisplay, PhotosFrame, SliderContainer } from './labelStyle';
import { ResGetImgLabelType } from '../../constant/API';
import { selectCardClassType } from '../dataset/Dataset';
import EditClassDialog from './components/EditClassDialog';
import { MainContext } from '../Main';
import { useGetBoxInfo } from './hook/useLabelPage';
import EditCanvas from './components/EditCanvas';
import StyledTooltip from '../../component/Tooltip';
import { FixedSizeList as List } from 'react-window';
import styled from 'styled-components';
import KeyboardArrowLeftSharpIcon from '@mui/icons-material/KeyboardArrowLeftSharp';
import { selectProjectData } from "../../redux/store/slice/projectData";
import log from "../../utils/console";

export const StyledList = styled(List)`
  &.hideBar{
    top: 10px;
    left: 6px;
    overflow-y: hidden !important;
    
    /* width */
    *::-webkit-scrollbar,
    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

export const SliderArrow = styled(KeyboardArrowLeftSharpIcon) <{ type: string }> `
  cursor: pointer;
  stroke-width: 0.3;
  stroke: ${props => props.theme.color.base_3};
  color:${props => props.theme.color.onColor_2};
  transform: ${({ type }) => (type === "right" ? "rotate(180deg)" : "")};

  &:hover {
    color:${props => props.theme.color.onColor_1};
  }

  &.hide {
    visibility: hidden;
    pointer-events: none;
  }
`;


export type LabelPropsType = {
  tab: string;
  combinedClass: ClassListType[];
  searchValue: ClassListType | null;
  setSearchValue: (value: ClassListType | null) => void;
  imgDataList: string[];
  currIndex: number;
  setCurrIndex: Dispatch<SetStateAction<number>>;
  handleImgClick: (e: any) => void;
  currentClass: selectCardClassType;
  imgLabelData: ResGetImgLabelType;
  getImgLabelAPICallback: () => void;
  datasetInfoApiCallback: (datasetId: string, isLabelPage?: boolean) => void;
  setImgDataList: (data: string[]) => void;
};

export type ImageProps = {
  width: number;
  height: number;
  naturalWidth: number;
  naturalHeight: number;
  imgName: string | undefined;
};

type DisableType = {
  [key: string]: boolean,
};



export const LabelPageContext = createContext<{
  targetIcon: 'target' | 'draw';
  setTargetIcon: (data: 'target' | 'draw') => void;
  actionIcon: 'delete' | '';
  setActionIcon: (data: 'delete' | '') => void;
  changed: boolean;
  setIsChanged: (data: boolean) => void;
}>({
  targetIcon: 'target',
  setTargetIcon: () => undefined,
  actionIcon: '',
  setActionIcon: () => undefined,
  changed: false,
  setIsChanged: () => undefined,
});


function LabelPage(props: LabelPropsType) {
  const { setImgDataList, datasetInfoApiCallback, imgLabelData, getImgLabelAPICallback, currentClass, handleImgClick, currIndex, setCurrIndex, tab, combinedClass, searchValue, setSearchValue, imgDataList } = props;
  const dispatch = useDispatch();
  const currentTab = useSelector(selectCurrentTab).tab;
  const projectData = useSelector(selectProjectData).projectData;
  const workspaceInfo = projectData['workspace']
  const { datasetId, dataType } = useContext(MainContext);
  const [changed, setIsChanged] = useState(false);
  const [targetIcon, setTargetIcon] = useState<'target' | 'draw'>('target');
  const [actionIcon, setActionIcon] = useState<'delete' | ''>('');
  const [openEditClass, setOpenEditClass] = useState(false);
  const [annotationList, setAnnotationList] = useState<ResGetImgLabelType>(imgLabelData);
  const [disableArrow, setDisableArrow] = useState<DisableType>({
    left: currIndex === 0,
    right: currIndex === imgDataList.length || imgDataList.length <= 9
  });
  const listRef = useRef<any | null>(null);
  const sliderIndexRef = useRef<any | null>(currIndex);

  const imgRef = useRef<any | null>(null);
  const [imgInfo, setImgInfo] = useState<ImageProps>({
    width: 0,
    height: 0,
    naturalWidth: 0,
    naturalHeight: 0,
    imgName: ''
  });

  const currPath = useMemo(() => {
    if (currentTab !== 'Label') return { image_path: `undefined` };
    return { image_path: `/${imgDataList[currIndex]}` }
  }, [currIndex, currentTab, imgDataList]);

  const { boxInfo } = useGetBoxInfo(datasetId, dataType, currPath, imgDataList);

  const handleImageLoad = (event: any) => {
    setImgInfo({
      width: event.target.clientWidth,
      height: event.target.clientHeight,
      naturalWidth: event.target.naturalWidth,
      naturalHeight: event.target.naturalHeight,
      imgName: imgDataList[currIndex].split("/").pop()
    })
  }

  const handleSliderClick = (type: 'left' | 'right', sliderIndx: number) => {
    const isMinIndex = sliderIndx - 9 <= 0;
    const isMaxIndex = sliderIndx + 9 >= imgDataList.length - 9;

    if (type === 'left') {
      if (isMinIndex) {
        sliderIndexRef.current = 0;
        setDisableArrow((curr) => { return { ...curr, left: true } })
        listRef.current.scrollToItem(sliderIndexRef.current, 'start');
        return;
      }
      sliderIndexRef.current = sliderIndexRef.current - 9;
      setDisableArrow((curr) => { return { ...curr, right: false } })
    } else {
      if (isMaxIndex) {
        sliderIndexRef.current = imgDataList.length - 9;
        setDisableArrow((curr) => { return { ...curr, right: true } })
        listRef.current.scrollToItem(sliderIndexRef.current, 'start');
        return;
      }
      sliderIndexRef.current = sliderIndexRef.current + 9;
      setDisableArrow((curr) => { return { ...curr, left: false } })
    }

    listRef.current.scrollToItem(sliderIndexRef.current, 'start');
  }


  const iconGenerate = useCallback((iconName: string) => {
    const hasSearchValue = searchValue ? true : false;

    if (iconName === 'target') return (
      <StyledTooltip place='right' title={'Select'}>
        <LabelEditIcon
          style={{ margin: '28px 6px 12px 0' }}
          isActive={targetIcon === 'target'}
        >
          <NavigationIcon
            style={{ rotate: '330deg' }}
            onClick={() => {
              setTargetIcon('target')
            }}
          />
        </LabelEditIcon>
      </StyledTooltip>
    )

    if (iconName === 'draw') return (
      <StyledTooltip place='right' title={hasSearchValue ? 'Draw' : 'Please select a class'}>
        <LabelEditIcon
          isActive={targetIcon === 'draw' && hasSearchValue}
          className={hasSearchValue ? '' : 'disabled'}
        >
          <CheckBoxOutlineBlankOutlinedIcon
            onClick={() => {
              if (hasSearchValue) setTargetIcon('draw')
            }}
          /></LabelEditIcon>
      </StyledTooltip>
    )

    if (iconName === 'delete') return (
      <StyledTooltip place='right' title={'Delete'}>
        <LabelEditIcon isActive={false}>
          <DeleteForeverIcon
            onClick={() => {
              setActionIcon('delete');
            }}
          /></LabelEditIcon>
      </StyledTooltip>
    )

  }, [searchValue, targetIcon])

  const initialAnnotationList = useCallback(() => {
    setAnnotationList(imgLabelData);
  }, [imgLabelData])


  useEffect(() => {
    initialAnnotationList();
  }, [initialAnnotationList]);



  useEffect(() => {
    if (openEditClass && changed) {
      datasetInfoApiCallback(datasetId, true);
    }
  }, [changed, datasetId, datasetInfoApiCallback, openEditClass])



  useEffect(() => {
    listRef.current.scrollToItem(currIndex, 'start');
    // eslint-disable-next-line react-hooks/exhaustive-deps

    log('--- currIndex ---')
    log(currIndex)

    log('--- datasetId ---')
    log(datasetId)

    log('--- dataType ---')
    log(dataType)

    log('--- projectData ---')
    log(projectData)

    log('--- img data ---')
    log(imgDataList[currIndex])
    log(`${apiHost}/display_img/${imgDataList[currIndex]}`)

    log('-- currPath ---')
    log(currPath)

    log('-- currentClass ---')
    log(currentClass)

    log('-- imgInfo ---')
    log(imgInfo)

    log('-- combinedClass ---')
    log(combinedClass)

    log('-- annotationList ---')
    log(annotationList)



    
   

  }, [])

  useEffect(() => {
   
    log('-- boxInfo ---')
    log(boxInfo)
    

  }, [boxInfo])


  return (
    <LabelPageContext.Provider
      value={{
        targetIcon, setTargetIcon,
        actionIcon, setActionIcon,
        changed, setIsChanged
      }}
    >
      <div style={{ display: tab === 'Label' ? '' : 'none' }}>
        <Title style={{ position: 'relative' }}>Label_xxx
          <StyledBtnOutline onClick={() => {
            dispatch(setCurrentTab("Dataset"));
            setSearchValue(null)
            datasetInfoApiCallback(datasetId);
          }}>Back
          </StyledBtnOutline>
        </Title>
        <Main>
          <LabelBlock>
            <EditBar>
              {dataType === 'classification' ?
                <>
                  <LabelEditIcon
                    style={{ margin: '28px 6px 12px 0' }}
                    isActive={false}
                    className={'disabled'}
                  >
                    <NavigationIcon style={{ rotate: '330deg' }} />
                  </LabelEditIcon>
                  <LabelEditIcon
                    isActive={false}
                    className={'disabled'}
                  >
                    <CheckBoxOutlineBlankOutlinedIcon />
                  </LabelEditIcon>

                  <LabelEditIcon isActive={false} className={'disabled'}>
                    <DeleteForeverIcon />
                  </LabelEditIcon>
                </>
                :
                <>
                  {iconGenerate('target')}
                  {iconGenerate('draw')}
                  {iconGenerate('delete')}
                </>
              }
            </EditBar>
            <PhotoDisplay>
              <MainPhotoFrame>
                <EditCanvas
                  canvasId={String(currIndex)}
                  boxInfo={boxInfo}
                  currentClass={currentClass}
                  imgInfo={imgInfo}
                  combinedClass={combinedClass}
                  searchValue={searchValue}
                  annotationList={annotationList}
                  setAnnotationList={setAnnotationList}
                  datasetInfoApiCallback={datasetInfoApiCallback}
                />
                {currentTab === 'Label' &&
                  <MainPhoto ref={imgRef} onLoad={handleImageLoad} src={`${apiHost}/display_img/${imgDataList[currIndex]}`} loading="lazy" />
                }
              </MainPhotoFrame>

              <SliderContainer>
                <SliderArrow
                  type='left'
                  className={disableArrow.left ? 'hide' : ''}
                  onClick={() => {
                    handleSliderClick('left', sliderIndexRef.current)
                  }}
                />
                <StyledList
                  height={90}
                  width={800}
                  itemCount={imgDataList.length}
                  itemSize={90}
                  itemData={imgDataList}
                  layout={'horizontal'}
                  className={'hideBar'}
                  ref={listRef}
                >
                  {({ index, style, data }) => {

                    log('--- index ---')
                    log(index)

                    log('--- style ---')
                    log(style)

                    log('--- data ---')
                    log(data)


                    return (
                      <div
                        key={index}
                        style={{ ...style }}
                      >
                        <PhotosFrame key={index} id={String(index)} active={imgDataList[index] === imgDataList[currIndex]} onClick={(e) => handleImgClick(e)} >
                          <Photo src={`${apiHost}/display_img/${imgDataList[index]}`} />
                        </PhotosFrame>
                       
                      </div>
                    );
                  }}

                </StyledList>
                <SliderArrow
                  type='right'
                  className={disableArrow.right ? 'hide' : ''}
                  onClick={() => {
                    handleSliderClick('right', sliderIndexRef.current)
                  }}
                />
              </SliderContainer>
            </PhotoDisplay>
          </LabelBlock>
          <ClassBlock>
            <Class>
              <SubTitle>Class
                <EditButton
                  onClick={() => setOpenEditClass(true)}
                  disabled={Object.keys(workspaceInfo['classNumber']).length <= 0}
                >
                  <DriveFileRenameOutlineSharpIcon />
                </EditButton>
              </SubTitle>
              <CreateSearchSelect
                id={datasetId}
                dataType={dataType}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                classList={combinedClass}
                hideLabel={true}
                labelPage={true}
                datasetInfoApiCallback={datasetInfoApiCallback}
                annotationList={annotationList}
                imgName={imgInfo.imgName}
                getImgLabelAPICallback={getImgLabelAPICallback}
                imgDataList={imgDataList}
                setImgDataList={setImgDataList}
                setAnnotationList={setAnnotationList}
                currIndex={currIndex}
              />
            </Class>
            <Annotation>
              <SubTitle>Annotation</SubTitle>
              {combinedClass.map(({ name, color_hex }, index) =>
                annotationList[name] ?
                  <AnnotationLabel
                    key={index + name}
                    color={annotationList[name].color_hex}
                    text={name}
                    value={annotationList[name].nums ? annotationList[name].nums : Number(annotationList[name])} />
                  : null
              )}
            </Annotation>
          </ClassBlock>
        </Main>
        {openEditClass &&
          <EditClassDialog
            open={openEditClass}
            handleClose={() => {
              setOpenEditClass(false);
            }}
            setOpenEditClass={setOpenEditClass}
            currentClass={currentClass}
            currIndex={currIndex}
            setCurrIndex={setCurrIndex}
            getImgLabelAPICallback={getImgLabelAPICallback}
            setSearchValue={setSearchValue}
            searchValue={searchValue}
            classList={combinedClass}
            setImgDataList={setImgDataList}
          />
        }

      </div>
    </LabelPageContext.Provider>
  );
}

export default LabelPage;
