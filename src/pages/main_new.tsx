import { useNavigate, useParams } from 'react-router-dom';
import { MainWrapper, ProjectContainer } from "./pageStyle";
import { createContext, useEffect, useState } from 'react';
import Breadcrumb from '../component/Breadcrumbs';
import { AllProjectDataType, useFetchIterationInfo, useGetIterationList } from './dataset/hook/useDataset';
import { useDispatch, useSelector } from 'react-redux';
import { selectIdTitle } from '../redux/store/slice/currentTitle';
import { GetAllProjectsType } from '../constant/API';
import AlertMessage from '../component/AlertMessage';
import Loading from '../component/Loading';
import { selectCurrentTab, } from "../redux/store/slice/currentTab"
import { setHasIteration } from "../redux/store/slice/hasIteration"
import { selectIsTraining, setIsTraining } from "../redux/store/slice/isTraining"
import Sidebar from '../component/SideBar/Sidebar';
import Dataset from './dataset/Dataset';
import Model from './model/Model';
import { selectCurrentTrainInfo } from '../redux/store/slice/currentTrainInfo';
import { setSocketIdAction } from '../redux/store/slice/socketId';
import { ClassListType } from '../component/Select/CreateSearchSelect';
import { useGetCurrTrainInfo } from './model/hook/useModelData';
import { selectProjectData } from '../redux/store/slice/projectData';
import AutoLabel from '../pages/autoLabel';


export type selectCardClassType = {
  [key: string]: number
}

export type MainPropsType = {
  handleInitData: (data: GetAllProjectsType) => void;
};

type MousePositionType = {
  x: 0,
  y: 0
};

export const MainContext = createContext<{
  activeClassName: string;
  setActiveClassName: (clsName: string) => void;
  datasetInfoApiCallback: (datasetId: string, isLabelPage?: boolean) => void;
  handleInitData: (data: GetAllProjectsType) => void;
  datasetId: string;
  dataType: string;
  combinedClass: ClassListType[];
}>({
  activeClassName: '',
  setActiveClassName: () => undefined,
  datasetInfoApiCallback: () => undefined,
  handleInitData: () => undefined,
  datasetId: '',
  dataType: '',
  combinedClass: [],
});


function Main(props: MainPropsType) {
  const { handleInitData } = props;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const trainingStatus = useSelector(selectIsTraining).isTraining;
  const allIdTitle = useSelector(selectIdTitle).idTitle;
  const currentTab = useSelector(selectCurrentTab).tab;
  const trainData = useSelector(selectCurrentTrainInfo).currTrain;
  const projectData = useSelector(selectProjectData).projectData;
  const { id: datasetId = '', type: dataType = '' } = useParams();
  const { combinedClass, datasetInfoApiCallback } = useFetchIterationInfo(datasetId);
  const { lastIter, getIterListCallback } = useGetIterationList(datasetId);
  const { getCurrTrainingInfo } = useGetCurrTrainInfo();
  const [activeClassName, setActiveClassName] = useState('All');


  const handelSidebarList = (projectData: AllProjectDataType) => {
    let filteredList = [''];
    if (projectData) {
      filteredList = Object.keys(projectData)?.filter((name => name !== 'workspace'))
    }
    return filteredList;
  }

  const datasetBreadcrumbs = [
    {
      href: '/allProjects',
      content: 'All Projects',
    },
    {
      href: ``,
      content: allIdTitle[datasetId] ? `${allIdTitle[datasetId]}` : '...',
    }
  ];


  useEffect(() => {
    //在這邊設redux 讓switchBtnGroup can disable model
    if (handelSidebarList(projectData).length > 0) {
      dispatch(setHasIteration(true));
    } else {
      //沒加的話刪掉最後一個iter會判斷錯誤
      dispatch(setHasIteration(false));
    }
  }, [dispatch, projectData]);



  useEffect(() => {
    //如果是在training要重拉資料更新畫面
    //導向model是做在train dialog把currTab改成model
    if (trainingStatus === '') return;

    if (trainingStatus === 'start') {
      datasetInfoApiCallback(datasetId)
      dispatch(setIsTraining('doing'))
    }

    if (trainingStatus === 'stop') {
      datasetInfoApiCallback(datasetId);
      getIterListCallback();
      setTimeout((() => {
        getCurrTrainingInfo();
        dispatch(setIsTraining(''));
      }), 2000)
    }

    //同時train的時候，如果有一個先好，socketLog那邊會把setIsTraining改成done
    //還沒train好的會因為已經被改成done有些資料沒重拉
    //所以這邊加上如果是done但還是有在train的話，就再次把done改成doing
    if (trainingStatus === 'done' && trainData[datasetId]) {
      dispatch(setIsTraining('doing'))
    }
  }, [datasetId, datasetInfoApiCallback, dispatch, getCurrTrainingInfo, getIterListCallback, trainData, trainingStatus]);


  useEffect(() => {
    dispatch(setSocketIdAction(datasetId));
  }, [datasetId, dispatch]);


  if (projectData === undefined) return <></>

  else return (
    <MainContext.Provider
      value={{
        activeClassName, setActiveClassName,
        datasetInfoApiCallback, handleInitData,
        datasetId, dataType,
        combinedClass
      }}
    >
      <Sidebar
        sidebarList={handelSidebarList(projectData)}
        currentTab={currentTab}
      />


      {currentTab === 'Dataset' || currentTab === 'Model' ?
        <ProjectContainer noOverFlow={true}>
          <MainWrapper>
            <AlertMessage />
            <Loading />
            <Breadcrumb
              className={''}
              breadcrumbs={datasetBreadcrumbs}
              onHrefUpdate={(href: string) => { navigate(href); }}
            />
            {currentTab === 'Dataset' ?
              <Dataset
                handleInitData={handleInitData}
                datasetInfoApiCallback={datasetInfoApiCallback}
                getIterListCallback={getIterListCallback} />
              :
              <></>
            }
            {/* {currentTab === 'Label' ?
             <AutoLabel></AutoLabel>
            : <></>} */}
            {currentTab === 'Model' ?
              <Model datasetInfoApiCallback={datasetInfoApiCallback} lastIter={lastIter} />
              : <></>}
          </MainWrapper>
        </ProjectContainer>
        :
        <></>
      }
      {currentTab === 'Label' ?
        <AutoLabel
          // handleInitData={handleInitData}
          // datasetInfoApiCallback={datasetInfoApiCallback}
          // getIterListCallback={getIterListCallback}
        ></AutoLabel>
        :
        <></>
      }

    </MainContext.Provider>
  );
}

export default Main;
