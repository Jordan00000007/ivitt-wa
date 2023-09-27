import axios from 'axios';
import APIPath from './APIPath';


export type  toGetDatasetImgType = {
  iteration: string,
  class_name: string,
};

export type  ResToGetDatasetImgType = {
  img_path: string[],
  length: number,
};

export type  ResToGetDatasetImgAPIType = {
  status: number,
  message: string,
  data: ResToGetDatasetImgType
};

// toGetDatasetImg: filter_dataset
export const toGetDatasetImgAPI = (Id: string, info: toGetDatasetImgType) => 
axios.post<ResToGetDatasetImgAPIType>(APIPath.dataset.toGetDatasetImg(Id), info);


export type  ResGetFolderListType = {
  folder_name: string[];
};

export type  ResGetFolderNameAPIType = {
  status: number,
  message: string,
  data: ResGetFolderListType
};

// getDatasetList: get_dataset
export const getDatasetListAPI = (Id: string) => axios.get<ResGetFolderNameAPIType>(APIPath.dataset.getDatasetList(Id));

// get iteration List: get_iteration
export const getIterListAPI = (Id: string) => axios.get<ResGetFolderNameAPIType>(APIPath.dataset.getIterList(Id));


export type  ClsInfoType = {
  [key: string]:{
    color_id: number,
    color_hex: string,
    class_id: number,
    nums:number,
  }
};

export type  ResGetClassAndNumberType = {
  All: number,
  Unlabeled: number,
  classes_info: ClsInfoType,
  sort_list:string[],
};

export type  ResGetClassAndNumberAPIType = {
  status: number,
  message: string,
  data: ResGetClassAndNumberType
};

export const toGetClassAndNumberAPI = (Id: string, info: string) => 
axios.post<ResGetClassAndNumberAPIType>(APIPath.dataset.toGetClassAndNumber(Id), {iteration: info});


export type  DeleteIterationType = {
  data: {
    iteration: string;
  }
};

// delete iteration: delete_iteration
export const deleteIterationAPI = (Id: string, iterName:DeleteIterationType) => axios.delete(APIPath.dataset.deleteIteration(Id), iterName);


//upload dataset image:upload_dataset
export const uploadDatasetImgAPI = (Id: string, data: object, config?:object) => 
axios.post(APIPath.dataset.uploadDatasetImg(Id), data, config);


export type  DeleteImgType = {
  data: {
    image_info: {
      [key: string]: string[];
    }
  }};

// delete img: delete_img
export const deleteDatasetImgAPI = (Id: string, imgData:DeleteImgType) => axios.delete(APIPath.dataset.deleteDatasetImg(Id), imgData);

// delete ALL img: delete_all_img
export const deleteAllDatasetImgAPI = (Id: string) => axios.delete(APIPath.dataset.deleteAllDatasetImg(Id));
