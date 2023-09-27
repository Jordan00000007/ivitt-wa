import axios from 'axios';
import APIPath from './APIPath';
import { ResType } from '.';


export type ResExportPlatformType = {
  export_platform: string[]
};

export type  ResExportPlatformAPIType = {
  status: number,
  message: string,
  data: ResExportPlatformType
}

export const getExportPlatformAPI = (Id: string,arch:string) => axios.get<ResExportPlatformAPIType>(APIPath.export.getExportPlatform(Id,arch));


export type startConvertType = {
  iteration: string,
  export_platform: string,
};

export const startExportAPI = (Id: string, info:startConvertType) => axios.post(APIPath.export.startExport(Id), info);


export const stopConvertingAPI = (Id: string) => axios.get<ResType>(APIPath.export.stopConverting(Id));


export type downloadZipType = {
  iteration: string,
};


export const getShareUrlAPI = (Id: string, info:downloadZipType) => axios.post<ResType>(APIPath.export.getShareUrl(Id), info);


export const exportIcapAPI = (Id: string, info:downloadZipType) => axios.post<ResType>(APIPath.export.exportIcap(Id), info);


export const getExportStatusAPI = () => axios.get<ResType>(APIPath.export.getExportStatus);
