import axios from 'axios';
import APIPath from './APIPath';
import { ResType } from '.';


//get_method_training
export const getTrainMethodListAPI = () => axios.get<ResType>(APIPath.train.getTrainMethodList);


//get_default_param
export type  toGetParamType = {
  training_method: string,
};



export type  ResParamType = {
  training_param: {
    model: string,
    batch_size: number,
    step: number,
    input_shape: number[]
  }
};

export type  ResParamAPIType = {
  status: number,
  message: string,
  data: ResParamType
}

export const getDefaultParamAPI = (Id: string, info: toGetParamType) => 
axios.post<ResParamAPIType>(APIPath.train.getDefaultParam(Id), info);


//getModel
export type  ResModelType = {
  model:  string[];
};

export type  ResModelAPIType = {
  status: number,
  message: string,
  data: ResModelType
};

export const getModelAPI = (Id: string) => axios.get<ResModelAPIType>(APIPath.train.getModel(Id));


//getBatch
export type  ResBatchType = {
  batch_size:  number[];
};

export type  ResBatchAPIType = {
  status: number,
  message: string,
  data: ResBatchType
};


export const getBatchSizeAPI = (Id: string) => axios.get<ResBatchAPIType>(APIPath.train.getBatchSize(Id));

//create train

export type  CreateTrainType = {
  training_method:string;
  model: string,
  batch_size: number,
  step: number,
  input_shape: number[]
};

export type  ResCreateTrainType = {
  iter_name: string,
  prj_name: string,
  pre_trained: boolean
};

export type  ResCreateTrainAPIType = {
  status: number,
  message: string,
  data: ResCreateTrainType
};


export const createTrainingAPI = (Id: string, info: CreateTrainType) => 
axios.post<ResCreateTrainAPIType>(APIPath.train.createTraining(Id), info);


//downloadPreTrained

export const downloadPreTrainedAPI = (Id: string) => axios.get<ResType>(APIPath.train.downloadPreTrained(Id));


//getTrainingInfo
export type  ResGetTrainingInfoType = {
  effect_img_num: number,
  training_method: string,
  remaining_time: number
};

export type  ResGetTrainingInfoAPIType = {
  status: number,
  message: string,
  data: ResGetTrainingInfoType
};


export const getTrainingInfoAPI = (Id: string) => axios.get<ResGetTrainingInfoAPIType>(APIPath.train.getTrainingInfo(Id));


//startTraining
export const startTrainingAPI = (Id: string) => axios.get(APIPath.train.startTraining(Id));


//stopTraining
export const stopTrainingAPI = (Id: string) => axios.get(APIPath.train.stopTraining(Id));


//get current project training status
export type  GetCurrTrainType = {
  [key:string]: {
      iteration: number,
      status:boolean
   }
  }

export type  GetCurrTrainAPIType = {
    status: number,
    message: string,
    data: GetCurrTrainType
  }

export const projectTrainStatusAPI = () => axios.get(APIPath.train.projectTrainStatus);
