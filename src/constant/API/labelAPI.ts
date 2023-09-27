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


export type  AddClassType = {
    class_name: string,
    color_id:number
};

export const addClassAPI = (Id: string, info: AddClassType) => 
axios.post<ResType>(APIPath.label.addClass(Id), info);


export const deleteClassAPI = (Id: string, class_name: string) => 
axios.delete(APIPath.label.deleteClass(Id), {
data: {
  class_name,
}
});


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

