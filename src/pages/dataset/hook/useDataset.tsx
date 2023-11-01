import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDatasetListAPI, getImgLabelAPI, getIterListAPI, ResGetImgLabelType, toGetClassAndNumberAPI } from '../../../constant/API';
import { closeLoading } from '../../../redux/store/slice/loading';
import { selectLastColorId, setLastColorIdAction } from '../../../redux/store/slice/lastColorId';
import { setProjectDataAction } from '../../../redux/store/slice/projectData';

export type ClassInfoType = {
  [key: string]: {
    name: string,
    inputValue: string,
    class_id: number,
    color_id: number,
    color_hex: string,
    nums: number
  },
}

export type AllProjectDataType = {
  [key: string]: {
    All: number,
    Unlabeled: number,
    classInfo: ClassInfoType,
    iterName: string,
    sortClass: string[],
    classNumber: Record<string, number>;
  }
};


async function getDatasetInfo(projectId: string, isLabelPage?: boolean) {
  if (!projectId || projectId === 'allProjects') return;
  const iterationInfoList = [];
  const projectData: Record<string, any> = {};
  //如果是label page就一定是在workspace做的，不須再多打getDatasetListAPI跟跑loop拿toGetClassAndNumberAPI
  if (isLabelPage) {
    await toGetClassAndNumberAPI(projectId, 'workspace')
      .then(({ data }) => {
        if (data) {
          const result = data.data;
          let clsInfo: any = {}
          const clsNb: Record<string, number> = {};
          result.sort_list.map((cls) => {
            clsInfo = { ...result.classes_info };
            clsInfo[cls].name = cls;
            clsInfo[cls].inputValue = cls;
            clsNb[cls] = result.classes_info[cls].nums
          });

          projectData['workspace'] = {
            iterName: 'workspace',
            All: result.All,
            Unlabeled: result.Unlabeled,
            classInfo: clsInfo,
            sortClass: result.sort_list,
            classNumber: clsNb
          }

          iterationInfoList.push({
            iterName: 'workspace',
            All: result.All,
            Unlabeled: result.Unlabeled,
            classInfo: clsInfo,
            sortClass: result.sort_list,
            classNumber: clsNb
          });
        }
      })
      .catch((res) => {
        console.log('isLabelPage-err', res);
      })
  } else {
    const iterListData = await getDatasetListAPI(projectId);
    const iterNameList = Object.values(iterListData.data.data.folder_name);

    for (let i = 0; i < iterNameList.length; i++) {
      try {
        const data = await toGetClassAndNumberAPI(projectId, iterNameList[i]);
        const result = data.data.data;

        let clsInfo: any = {}
        const clsNb: Record<string, number> = {};
        result.sort_list.map((cls) => {
          clsInfo = { ...result.classes_info };
          clsInfo[cls].name = cls;
          clsInfo[cls].inputValue = cls;
          clsNb[cls] = result.classes_info[cls].nums
        });

        projectData[iterNameList[i]] = {
          iterName: iterNameList[i],
          All: result.All,
          Unlabeled: result.Unlabeled,
          classInfo: clsInfo,
          sortClass: result.sort_list,
          classNumber: clsNb
        }

        iterationInfoList.push({
          iterName: iterNameList[i],
          All: result.All,
          Unlabeled: result.Unlabeled,
          classInfo: clsInfo,
          sortClass: result.sort_list,
          classNumber: clsNb
        })

      } catch (err) {
        console.log('getDatasetInfo Error!', err);
        //暫時放入空的值以顯示頁面，要另外判斷是API錯誤不然是呈現空狀態的畫面
        // iterationInfoList.push({ iterName: 'workspace', All: 0, Unlabeled: 0, classInfo: {}, sortClass: [], classNumber: {} })
        projectData['workspace'] = {
          iterName: 'workspace',
          All: 0,
          Unlabeled: 0,
          classInfo: {},
          sortClass: [],
          classNumber: 0
        }
      }
    }
  }


  return {
    projectData,
    iterationInfoList
  };
}

type CombinedClass = {
  name: string;
  class_id: string;
  inputValue: string;
  color_hex: string;
  color_id: string;
  nums: number;
}


export const useFetchIterationInfo = (datasetId: string) => {
  //for classification upload select class list
  const [combinedClass, setCombinedClass] = useState<CombinedClass[]>([]);
  const lastColorId = useSelector(selectLastColorId).lastColorId;
  const dispatch = useDispatch();

  const datasetInfoApiCallback = useCallback((datasetId: string, isLabelPage?: boolean) => {
    getDatasetInfo(datasetId, isLabelPage)
      .then((data) => {
        if (data) {
          dispatch(setProjectDataAction(data.projectData))

          const workData = data.projectData['workspace']
          const workDataSortClass: string[] = workData['sortClass']

          setCombinedClass(workDataSortClass.map((cls: string) => (
            {
              name: cls,
              class_id: String(workData['classInfo'][cls].class_id),
              inputValue: cls,
              color_hex: workData['classInfo'][cls].color_hex,
              color_id: String(workData['classInfo'][cls].color_id),
              nums: workData['classInfo'][cls].nums
            }))
          )
        }
      })
      .finally(() => dispatch(closeLoading()))
  }, [dispatch]);



  //換project要重設
  useEffect(() => {
    if (!lastColorId) {
      const allColorId = combinedClass.map((item) => {
        return Number(item.color_id)
      })
      if (allColorId.sort().at(-1) !== undefined) {
        dispatch(setLastColorIdAction(String(allColorId.sort().at(-1))))
      } else {
        dispatch(setLastColorIdAction(''))
      }
    }

  }, [combinedClass, dispatch, lastColorId, datasetId]);


  useEffect(() => {
    datasetInfoApiCallback(datasetId);
    dispatch(setLastColorIdAction(''));
  }, [datasetInfoApiCallback, datasetId, dispatch]);


  return {
    combinedClass,
    datasetInfoApiCallback
  };
}

export const useFetchLabel = (id: string, path: string, tab: string) => {
  const [imgLabelData, setImgLabelData] = useState<ResGetImgLabelType>({});

  const getImgLabelAPICallback = useCallback(() => {
    getImgLabelAPI(id, path)
      .then(({ data }) => {
        setImgLabelData(data.data)
      })
      .catch(({ response }) => {
        //如果API有錯誤改成Unlabeled就可以被過濾掉
        setImgLabelData({
          'Unlabeled': {
            class_id: 0,
            nums: 0,
            color_hex: '',
            color_id: 0
          }
        })

        console.log("getImgLabelAPI Error", response)
      });

  }, [path, id]);



  useEffect(() => {
    if (!id || !path || !tab) return;
    getImgLabelAPICallback();
  }, [getImgLabelAPICallback, path, tab, id]);

  return {
    imgLabelData,
    getImgLabelAPICallback,
  };
}

export const useGetIterationList = (datasetId: string) => {
  const [lastIter, setLastIter] = useState<string>('');
  const [iterLengthPass, setIterLengthPass] = useState<boolean>(false);

  const getIterListCallback = useCallback(() => {
    getIterListAPI(datasetId)
      .then(({ data }) => {

        const theLastOne = data.data.folder_name.length - 1;

        if (data.data.folder_name[theLastOne]===undefined){
          setLastIter(data.data.folder_name[theLastOne]);
          
        }else{
          const theKey=Object.keys(data.data.folder_name[theLastOne])[0];
          if (theKey==='0'){
            setLastIter(data.data.folder_name[theLastOne]);
          
          }else{
            setLastIter(theKey);
           
          }
         
         
        }

        
        if (data.data.folder_name.length <= 20) setIterLengthPass(true);
      })
      .catch(({ response }) => console.log('getIterListAPI-Error', response.data))


    // getIterListAPI(datasetId)
    //   .then(({ data }) => {
    //     const theLastOne = data.data.folder_name.length - 1;

    //     console.log('data.data.folder_name[theLastOne]',data.data.folder_name[theLastOne])

    //     setLastIter(data.data.folder_name[theLastOne]);
    //     if (data.data.folder_name.length <= 20) setIterLengthPass(true);
    //   })
    //   .catch(({ response }) => console.log('getIterListAPI-Error', response.data))
  }, [datasetId]);



  useEffect(() => {
    if (!datasetId) return;
    getIterListCallback();
  }, [datasetId, getIterListCallback]);

  return {
    iterLengthPass,
    lastIter,
    getIterListCallback
  };
}


