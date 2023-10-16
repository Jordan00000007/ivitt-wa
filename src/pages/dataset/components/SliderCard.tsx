import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Slider from 'react-slick';
import styled from 'styled-components';
import DatasetSelectBtn from '../../../component/Buttons/DatasetSelectBtn';
import { toGetDatasetImgType, toGetDatasetImgAPI } from '../../../constant/API';
import { selectIteration, setIteration } from '../../../redux/store/slice/currentIteration';
import { selectCurrentTab } from '../../../redux/store/slice/currentTab';
import { selectDisableBtn } from '../../../redux/store/slice/disableBtn';
import { MainContext } from '../../Main';
import { selectCardClassType } from '../Dataset';
import { AllProjectDataType } from '../hook/useDataset';
import NoSliderCard from './NoSliderCard';
import { selectProjectData } from '../../../redux/store/slice/projectData';



export const ArrowBtn = styled.span<{ type: string }>`
  position: absolute;
  top: calc(50% - 6px);
  height: 8px;
  width: 8px;
  background: transparent;
  border-top: 2px solid ${props => props.theme.color.onColor_2};
  border-right: 2px solid ${props => props.theme.color.onColor_2};
  z-index: 10;
  cursor: pointer;
  right: ${({ type }) => (type === "right" ? "-4px" : "unset")};
  left: ${({ type }) => (type === "left" ? "-16px" : "unset")};
  transform: ${({ type }) => (type === "left" ? "rotate(-135deg)" : "rotate(45deg)")};


  &.slick-next:before {
    content: '';
  }
  &.slick-prev:before {
    content: '';
  }
  &.slick-disabled {
    display: none;
    visibility: hidden;
  }
  &:hover {
    border-top: 2px solid ${props => props.theme.color.onColor_1};
    border-right: 2px solid ${props => props.theme.color.onColor_1};
   
  }
`;

const SelectContainer = styled.div <{ noSlider: boolean }>`
  width: 670px;
  margin-bottom: 4px;
  margin-left: ${(props) => (props.noSlider ? '0' : '18px')};
`;


type SliderCardProps = {
  activeClassName: string;
  setActiveClassName: (data: string) => void;
  currentClass: selectCardClassType;
  setCurrentClass: (data: selectCardClassType) => void;
  // iterationInfoList: IterationInfo[];
  setImgDataList: (data: string[]) => void;
  cardNumberLength: number;
};


export async function getImgUrlList(projectId: string, requestData: toGetDatasetImgType) {
  try {
    const getPath = (await toGetDatasetImgAPI(projectId, requestData)).data;
    const pathList = getPath.data.img_path;
    const imgUrlList: string[] = [];
    pathList.forEach((item) => {
      imgUrlList.push(item.replace('./', ''));
    })
    return imgUrlList;
  } catch (err) {
    console.log('getImgUrlList-Error', err);
  }
}


const SliderCard = (props: SliderCardProps) => {
  const { id: datasetId = '' } = useParams();
  const dispatch = useDispatch();
  const { cardNumberLength, setImgDataList, currentClass, setCurrentClass } = props;
  const currentIter = useSelector(selectIteration).iteration;
  const currentTab = useSelector(selectCurrentTab).tab;
  const disableBtn = useSelector(selectDisableBtn).disableBtn;
  const projectData = useSelector(selectProjectData).projectData;
  const [total, setTotal] = useState(0);
  const [unlabeled, setUnlabeled] = useState(0);
  const { activeClassName, setActiveClassName } = useContext(MainContext);
  const [currSortClass, setCurrSortClass] = useState<string[]>([]);
  const sliderCardTotal = cardNumberLength + unlabeled;

  const workspaceInfo = projectData['workspace'];

  const settings = {
    infinite: false,
    arrows: true,
    slidesToShow: 4,
    slidesToScroll: 4,
    nextArrow: <ArrowBtn type='right' />,
    prevArrow: <ArrowBtn type='left' />
  };

  const handelSelectCardList = useCallback(
    (projectData: AllProjectDataType, activeIter: string) => {

      if (!projectData[activeIter]) {
        dispatch(setIteration('workspace'))
      };
      const checkedIter = projectData[activeIter] ? projectData[activeIter] : projectData['workspace'];
      setTotal(checkedIter.All);
      setUnlabeled(checkedIter.Unlabeled);
      setCurrentClass(checkedIter.classNumber);
      setCurrSortClass(checkedIter.sortClass);
    },
    [dispatch, setCurrentClass]
  );

  const checkNoLabeledCardNumber = (noLabel: number) => {
    if (noLabel <= 0) return;
    else {
      return (
        <DatasetSelectBtn
          isSlider={true}
          text={'Unlabeled'}
          number={noLabel}
          active={activeClassName === 'Unlabeled'}
          activeClassName={'Unlabeled'}
          onClick={() => setActiveClassName('Unlabeled')}
          disabled={activeClassName !== 'Unlabeled' && disableBtn}
        />
      )
    }
  }


  useEffect(() => {
    //分成兩個useEffect的話，新upload的圖片不會更新
    handelSelectCardList(projectData, currentIter)

    //如果是label就不重新拉圖片
    if (currentTab === 'Label') return;

    const reqData = {
      iteration: currentIter,
      class_name: activeClassName
    }

    console.log('--- try get image info url ---')
    console.log('--- currentIter ---')
    console.log(currentIter)
    console.log('--- activeClassName ---')
    console.log(activeClassName)


    getImgUrlList(datasetId, reqData).then((data) => {
      if (data) setImgDataList(data);
    })

  }, [activeClassName, currentIter, currentTab, datasetId, handelSelectCardList, projectData, setImgDataList]);

  useEffect(() => {
    //如果是All就不用做後續處理
    if (activeClassName === 'All' || currentTab !== 'Dataset') return;

    if (activeClassName === 'Unlabeled' && workspaceInfo) {
      if (workspaceInfo.Unlabeled === 0) setActiveClassName('All');
    } else {
      //如果把bbox清掉，又同時刪除class
      if (workspaceInfo && workspaceInfo.sortClass.indexOf(activeClassName) === -1) setActiveClassName('All');
    }

  }, [activeClassName, currentTab, setActiveClassName, workspaceInfo]);


  // const SliderLayer = useMemo(() => {
  //   if (cardNumberLength < 3) return <Slider {...settings} />;
  //   return <></>;
  // }, [cardNumberLength, settings])


  if (cardNumberLength < 3) return (
    <NoSliderCard
      currentClass={currentClass}
      setCurrentClass={setCurrentClass}
      setImgDataList={setImgDataList}
      countNumber={{
        total: total,
        unlabeled: unlabeled,
      }}
    />
  )



  return (
    <SelectContainer noSlider={sliderCardTotal <= 3}>
      <Slider {...settings}>
        <DatasetSelectBtn
          isSlider={true}
          text={'All'}
          number={total}
          active={activeClassName === 'All'}
          activeClassName={'All'}
          onClick={() => setActiveClassName('All')}
          disabled={activeClassName !== 'All' && disableBtn}
        />
        {checkNoLabeledCardNumber(unlabeled)}

        {currSortClass.map((item, index) => (
          <DatasetSelectBtn
            isSlider={true}
            key={item + index}
            text={item}
            number={currentClass[item]}
            active={activeClassName === item}
            activeClassName={activeClassName}
            onClick={() => {
              setActiveClassName(item)
            }}
            disabled={disableBtn && activeClassName !== item}
          />
        ))}
      </Slider>
    </SelectContainer>
  );
};

export default SliderCard;