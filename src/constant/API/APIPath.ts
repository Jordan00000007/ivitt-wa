// const host = window.location.host;
// export const apiHost = `http://${host}/ivit`;
// export const socketHost = `http://${host}`;

// export const apiHost = `http://172.16.92.124:6550`;
// export const socketHost = `${apiHost}`;

export const apiHost:string = `http://192.168.8.134:6530`;
export const socketHost:string = `${apiHost}`;

//http://10.204.16.134:6538/allProjects




const APIPath = {
  projects: {
    getInitProject: `${apiHost}/init_project`,
    createProject: `${apiHost}/create_project`,
    renameProject: (Id: string) => `${apiHost}/${Id}/rename_project`,
    deleteProject: (Id: string) => `${apiHost}/${Id}/delete_project`,
    getPlatformList: `${apiHost}/get_platform`,
    getTypeList: `${apiHost}/get_type`,
    export: `${apiHost}/export`,
    import: `${apiHost}/import`,
    
  },
  dataset:{
    toGetDatasetImg: (Id: string) => `${apiHost}/${Id}/filter_dataset`,
    getDatasetList: (Id: string) => `${apiHost}/${Id}/get_dataset`,
    getIterList: (Id: string) => `${apiHost}/${Id}/get_iteration`,
    toGetClassAndNumber: (Id: string) => `${apiHost}/${Id}/iter_class_num`,
    deleteIteration: (Id: string) => `${apiHost}/${Id}/delete_iteration`,
    uploadDatasetImg: (Id: string) => `${apiHost}/${Id}/upload`,
    deleteDatasetImg: (Id: string) => `${apiHost}/${Id}/delete_img`,
    deleteAllDatasetImg: (Id: string) => `${apiHost}/${Id}/delete_all_img`,
  },
  label:{
    getImgLabel: (Id: string, path:string) => `${apiHost}/get_img_cls_nums/${Id}/${path}`,
    getColorBar: `${apiHost}/get_color_table`,
    addClass: (Id: string) => `${apiHost}/${Id}/add_class`,
    deleteClass: (Id: string) => `${apiHost}/${Id}/delete_class`,
    renameClass: (Id: string) => `${apiHost}/${Id}/rename_class`,
    getBbox: (Id: string) => `${apiHost}/${Id}/get_bbox`,
    updateBbox: (Id: string) => `${apiHost}/${Id}/update_bbox`,
    editImgClass: (Id: string) => `${apiHost}/${Id}/edit_img_class`,
    classChangeColor: (Id: string) => `${apiHost}/${Id}/class_change_color`,
    favoriteLabel: (Id: string) => `${apiHost}/${Id}/favorite_label`,
    getIteration: (Id: string) => `${apiHost}/${Id}/get_iteration`,
    autolabeling: (Id: string) => `${apiHost}/${Id}/autolabeling`,
    inferAutolabeling: (Id: string) => `${apiHost}/${Id}/autolabeling/infer`,
    threshold: (Id: string) => `${apiHost}/${Id}/threshold`,
    confirmStatus: (Id: string) => `${apiHost}/${Id}/confirm_status`,
    autolabelStatus: (Id: string) => `${apiHost}/${Id}/autolabel_status`,
    clearAutolabeling: (Id: string) => `${apiHost}/${Id}/clear_autolabeling`,
    getAutoLabelIterList: (Id: string) => `${apiHost}/${Id}/autolabel_get_iteration`,
  
    
  },
  model:{
    getMetrics: (Id: string) => `${apiHost}/${Id}/metrics_history`,
    getCurve: (Id: string) => `${apiHost}/${Id}/curve_history`,
    getModelInfo: (Id: string) => `${apiHost}/${Id}/get_model_info`,
    checkBestModel: (Id: string) => `${apiHost}/${Id}/check_best_model`,
  },
  train:{
    getTrainMethodList: `${apiHost}/get_method_training`,
    getDefaultParam: (Id: string) => `${apiHost}/${Id}/get_default_param`,
    getModel: (Id: string) => `${apiHost}/${Id}/get_model`,
    getBatchSize: (Id: string) => `${apiHost}/${Id}/get_batch_size`,
    createTraining: (Id: string) => `${apiHost}/${Id}/create_training_iter`,
    downloadPreTrained: (Id: string) => `${apiHost}/${Id}/download_pretrained`,
    getTrainingInfo: (Id: string) => `${apiHost}/${Id}/get_training_info`,
    startTraining: (Id: string) => `${apiHost}/${Id}/start_training`,
    stopTraining: (Id: string) => `${apiHost}/${Id}/stop_training`,
    projectTrainStatus: `${apiHost}/prj_training_status`,
    history: ()=>`${apiHost}/history`,
    trainingTask: ()=>`${apiHost}/training_schedule`,
    delTrainingTask: ()=>`${apiHost}/training_schedule`,
    
    stopTask: ()=>`${apiHost}/stop_task`,
  },
  evaluate:{
    uploadEvalImages: (Id: string) => `${apiHost}/${Id}/upload_eval_img`,
    getEvaluate: (Id: string) => `${apiHost}/${Id}/evaluate`,
  },
  export:{
    getExportPlatform: (Id: string,arch:string) => `${apiHost}/${Id}/get_export_platform/${arch}`,
    startExport: (Id: string) => `${apiHost}/${Id}/start_converting`,
    stopConverting: (Id: string) => `${apiHost}/${Id}/stop_converting`,
    getShareUrl: (Id: string) => `${apiHost}/${Id}/share_api`,
    exportIcap: (Id: string) => `${apiHost}/${Id}/export_icap`,
    getExportStatus: `${apiHost}/export_status`,
  },
}


export default APIPath;