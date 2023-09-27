import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getAllProjectsAPI, GetAllProjectsType, getPlatformListAPI, getTypeListAPI } from '../../../constant/API';
import { setIdTitle } from "../../../redux/store/slice/currentTitle";
import { closeLoading, openLoading } from '../../../redux/store/slice/loading';
import { setPlatformIdMap } from '../../../redux/store/slice/projectPlatform';

export type allProjectsType = {
  id: string,
  name: string,
  type: string,
  platform: string,
  coverImg: string,
  effectImgNum: number,
  totalImgNum: number,
  iteration: number,
  createTime: number
};

export const useAllProjectInit = (path: string) => {
  const dispatch = useDispatch();
  const [initData, setInitData] = useState<allProjectsType[]>([]);
  const [noInitData, setNoInitData] = useState<boolean>(false);

  const handleInitData = useCallback((data: GetAllProjectsType) => {
    const idMap: Record<string, string> = {};
    const platformMap: Record<string, string> = {};


    const projectInfo = Object.entries(data).map((item) => {
      const id = item[0];
      const value = item[1];
      idMap[id] = value.project_name;
      platformMap[id] = value.platform;
      return {
        id: id,
        name: value.project_name,
        type: value.type,
        platform: value.platform,
        coverImg: value.cover_img,
        effectImgNum: value.effect_img_nums,
        totalImgNum: value.total_img_nums,
        iteration: value.iteration,
        createTime: value.create_time
      }
    });

    setInitData(projectInfo);
    dispatch(setIdTitle(idMap));
    dispatch(setPlatformIdMap(platformMap));

  }, [dispatch]);


  useEffect(() => {
    //如果在dataset重整會有init順序問題，導致錯誤，所以只有在allProjects才直接呼叫
    dispatch(openLoading());
    if (path.includes('allProjects')) {
      getAllProjectsAPI()
        .then(({ data }) => {
          handleInitData(data.data)
        })
        .catch(({ message }) => {
          console.log('getAllProjectsAPI-Error!', message);
          setNoInitData(true)
        })
        .finally(() => dispatch(closeLoading()));
    } else {
      //如果完全沒再呼叫一次，header會拿不到title，因為重整redux會被清掉
      setTimeout((() => {
        getAllProjectsAPI()
          .then(({ data }) => handleInitData(data.data))
          .catch(({ message }) => {
            console.log('getAllProjectsAPI-Error!', message);
            setNoInitData(true)
          })
          .finally(() => dispatch(closeLoading()))
      }), 700)

    }
  }, [dispatch, handleInitData, path]);



  return {
    noInitData,
    initData,
    handleInitData
  }
}


export const useAddProjectList = () => {
  const [typeList, setTypeList] = useState<string[]>([]);
  const [platformList, setPlatformList] = useState([]);

  useEffect(() => {
    getPlatformListAPI()
      .then(({ data }) => setPlatformList(data.data.platform))
      .catch(({ message }) => console.log('getPlatformListAPI-Error!', message))
  }, []);

  useEffect(() => {
    getTypeListAPI()
      .then(({ data }) => setTypeList(data.data.type))
      .catch(({ message }) => console.log('getTypeListAPI-Error!', message))
  }, []);

  return {
    typeList, platformList
  };
}