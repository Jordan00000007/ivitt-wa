import axios from 'axios';
import APIPath from './APIPath';

export type  GetAllProjectsType = {
  [key:string]: {
      project_name: string,
      platform: string,
      type: string,
      effect_img_nums: number,
      total_img_nums: number,
      cover_img: string,
      iteration: number,
      create_time: number
   }
  }

export type  GetAllProjectsAPIType = {
    status: number,
    message: string,
    data: GetAllProjectsType
  }

export const getAllProjectsAPI = () => axios.get<GetAllProjectsAPIType>(APIPath.projects.getInitProject);


export type CreateProjectType = {
  project_name: string,
  platform: string,
  type: string
};

export const createProjectAPI = (info:CreateProjectType) => axios.post(APIPath.projects.createProject, info);

export const renameProjectAPI = (Id: string, data:string) => axios.put(APIPath.projects.renameProject(Id), {new_name: data});

export const deleteProjectAPI = (Id: string) => axios.delete(APIPath.projects.deleteProject(Id));

export const getPlatformListAPI = () => axios.get(APIPath.projects.getPlatformList);


export type  ResTypeListType = {
  status: number,
  message: string,
  data: {
    type: string[]
  }
};

export const getTypeListAPI = () => axios.get<ResTypeListType>(APIPath.projects.getTypeList);

export type  ExportType = {
  uuid: string,
  change_workspace: string,
  iteration : string[];
};

export const exportAPI = (info:ExportType) => axios.post(APIPath.projects.export, info);


export type  ImportType = {
  
  custom_name : FormData,
 
 
};

export const importAPI = (info:FormData) => axios.post(APIPath.projects.import, info,  { headers:{'Content-Type': 'multipart/form-data'}});


