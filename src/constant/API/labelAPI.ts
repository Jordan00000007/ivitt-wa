import axios from 'axios';
import APIPath from './APIPath';
import { ResType } from '.';


export type  ResGetImgLabelType = {
    [key: string]: {
        color_id: number,
        color_hex: string,
        class_id?: number, //有些資料不需要
        nums: number
      }
};

export type  ResGetImgLabelAPIType = {
    status: number,
    message: string,
    data: ResGetImgLabelType
};


export const getImgLabelAPI = (id:string, path:string) => axios.get<ResGetImgLabelAPIType>(APIPath.label.getImgLabel(id,path));


export type  ResGetColorBarType = {
   [key: number]: string 
};

export type  ResGetColorBarAPIType = {
    status: number,
    message: string,
    data: ResGetColorBarType
};


export const getColorBarAPI = () => axios.get<ResGetColorBarAPIType>(APIPath.label.getColorBar);

export type  ResFavoriteLabelType = {
    [key: string]: {
        color_id: number,
        class_name: string,
        class_color: string, //有些資料不需要
      }
};

export type  ResFavoriteLabelAPIType = {
    status: number,
    message: string,
    data: ResFavoriteLabelType
};

//export const favoriteLabelAPI = () => axios.get<ResFavoriteLabelAPIType>(APIPath.label.favoriteLabel(Id));

export const favoriteLabelAPI = (Id: string) => 
axios.get<ResFavoriteLabelAPIType>(APIPath.label.favoriteLabel(Id));

export type  ResIterationItemType = {
    [key: string]: {
        mAP: number,
        class: number,
    }
};

export type  ResIterationType = {
    [key: string] : ResIterationItemType[]
};

export type  ResIterationAPIType = {
    status: number,
    message: string,
    data: ResIterationType
};

export const getIterationAPI = (Id: string) => 
axios.get<ResIterationAPIType>(APIPath.label.getIteration(Id));


export type  AddClassType = {
    class_name: string,
    color_id:number
};

export const addClassAPI = (Id: string, info: AddClassType) => 
axios.post<ResType>(APIPath.label.addClass(Id), info);

export type  AutoLabelingParameterType = {
    iteration: string,
    threshold:number
};

export const modifyAutoLabelingParameterAPI = (Id: string, info: AutoLabelingParameterType) => 
axios.put<ResType>(APIPath.label.autolabeling(Id), info);

export const getAutoLabelingParameterAPI = (Id: string) => 
axios.get<ResType>(APIPath.label.autolabeling(Id));

export const openAutoLabelingAPI = (Id: string, info: AutoLabelingParameterType) => 
axios.post<ResType>(APIPath.label.autolabeling(Id), info);

export type  InferAutoLabelingParameterType = {
    img_name: string
};

export const inferAutoLabelingAPI = (Id: string, info: InferAutoLabelingParameterType) => 
axios.post<ResType>(APIPath.label.inferAutolabeling(Id), info);

export type  ThresholdParameterType = {
    threshold: number,
    img_name: string,
};

export const thresholdAPI = (Id: string, info: ThresholdParameterType) => 
axios.post<ResType>(APIPath.label.threshold(Id), info);

export type  ConfrimStatusParameterType = {
    image_name: string
};

export const confirmStatusAPI = (Id: string, info: ConfrimStatusParameterType) => 
axios.post<ResType>(APIPath.label.confirmStatus(Id), info);

export type  AutoLabelStatusParameterType = {
};

export const setAutolabelStatusAPI = (Id: string, info: AutoLabelStatusParameterType) => 
axios.post<ResType>(APIPath.label.autolabelStatus(Id), info);

export const getAutolabelStatusAPI = (Id: string) => 
axios.get<ResType>(APIPath.label.autolabelStatus(Id));


export const deleteClassAPI = (Id: string, class_name: string) => 
axios.delete(APIPath.label.deleteClass(Id), {
data: {
  class_name,
}
});

export type  ChangeClassType = {
    class_name: string,
    color_id:number,
    color_hex:string,
};

export const classChangeColorAPI = (Id: string, info: ChangeClassType) => 
axios.post<ResType>(APIPath.label.classChangeColor(Id), info);


export type  RenameClassType = {
    class_name: string,
    new_name: string,
    color_id?:number
};

// export type  ClassType = {
//     class_name: string,
// };

export const renameClassAPI = (Id: string, info: RenameClassType) => 
axios.put(APIPath.label.renameClass(Id), info);


export type  GetBBoxType = {
    image_path: string,
};

export type  BBoxInfoType = {
    class_id: string,
    class_name: string,
    bbox:number[],
    color_id: string,
    color_hex: string
};

export type  ResBBoxType = {
    img_shape: number[],
    box_info:BBoxInfoType[]
};

export type  ResBBoxAPIType = {
    status: number,
    message: string,
    data: ResBBoxType
};


export const getBboxAPI = (Id: string, info: GetBBoxType) => axios.post<ResBBoxAPIType>(APIPath.label.getBbox(Id), info);


export type  UpdateBBoxInfoType = {
    class_id: string,
    class_name: string,
    bbox:number[],
};
export type  UpdateBBoxType = {
    image_name: string,
    box_info:UpdateBBoxInfoType[]
};

export const updateBboxAPI = (Id: string, info: UpdateBBoxType) => axios.post(APIPath.label.updateBbox(Id), info);


export type  EditImgClassType = {
    images_info: {
        [key: string]: string[]
    },
    class_name: string
  }

export const editImgClassAPI = (Id: string, info: EditImgClassType) => axios.post(APIPath.label.editImgClass(Id), info);

