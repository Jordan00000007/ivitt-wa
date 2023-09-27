import axios from 'axios';
import APIPath from './APIPath';


//upload evaluate
export type  ResUploadEvalType = {
  eval_img:  string[]
};

export type  ResUploadEvalAPIType = {
  status: number,
  message: string,
  data: ResUploadEvalType
}

export const uploadEvalImagesAPI = (Id: string, info: any) => 
axios.post<ResUploadEvalAPIType>(APIPath.evaluate.uploadEvalImages(Id), info);


//evaluate
export type  evalType = {
  iteration: string,
  threshold: number
};

export type  DataType = {
      class: string,
      confidence: number,
      index:number,
      bbox: number[]
};


export type  ResEvalType = {
  detections:{
    [key: string]:DataType[]
  }
};

export type  ResEvalAPIType = {
  status: number,
  message: string,
  data: ResEvalType
}

export const getEvaluateAPI = (Id: string, info: evalType) => 
axios.post<ResEvalAPIType>(APIPath.evaluate.getEvaluate(Id), info);


