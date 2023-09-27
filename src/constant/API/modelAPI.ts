import axios from 'axios';
import APIPath from './APIPath';
import { ResType } from '.';


export type  ToGetModelType = {
    iteration: string,
};
  
export type  ResGetMetricsType = {
    precision: number,
    recall: number,
    [key: string]:number,
};

export type  ResGetMetricsAPIType = {
  status: number,
  message: string,
  data: ResGetMetricsType
}

  

//getMetrics
export const toGetMetricsAPI = (Id: string, info: ToGetModelType) => 
axios.post<ResGetMetricsAPIType>(APIPath.model.getMetrics(Id), info);


//getCurve
export type ResGetCurveType = {
    [key: string]:{
        step: number,
        status: {
          [key: string]:number,
        }
    }
  };

export type  ResGetCurveAPIType = {
    status: number,
    message: string,
    data: ResGetCurveType
}
  

  export const getCurveAPI = (Id: string, info: ToGetModelType) => 
  axios.post<ResGetCurveAPIType>(APIPath.model.getCurve(Id), info);


//getInfo
export type  ResGetModelInfoType = {
    model: string,
    batch_size: number,
    step: number,
    input_shape: number[],
    spend_time: number | string,
    training_method: string,
    gpu: string[],
    effect_img_nums: number
  };

export type  ResGetModelInfoAPIType = {
    status: number,
    message: string,
    data: ResGetModelInfoType
}
  

  export const getModelInfoAPI = (Id: string, info: ToGetModelType) => 
  axios.post<ResGetModelInfoAPIType>(APIPath.model.getModelInfo(Id), info);


//check_best_model

  export const checkBestModelAPI = (Id: string, info: ToGetModelType) => 
  axios.post<ResType>(APIPath.model.checkBestModel(Id), info);