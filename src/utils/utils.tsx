import { ImageWHProps } from "../pages/label/hook/useLabelPage";
import { idTrainStatusType } from "../pages/model/hook/useModelData";

export function checkIsFunction(func: unknown) {
  if (typeof func === 'function') return true;
  return false;
}

export function safeRunFunction(func: any, params?: any) {
  if (checkIsFunction(func) && params === undefined) return func();
  else if (checkIsFunction(func) && params !== undefined) return func(params);
}


export function customAlertMessage(type: string, text: string) {
  if (type === 'success') {
    return {
      message: text,
      alertType: 'success',
      show: true
    }
  } else if (type === 'convert') {
    return {
      message: text,
      alertType: 'convert',
      show: true
    }
  } else {
    return {
      message: text,
      alertType: 'error',
      show: true
    }
  }
}


function padTo2Digits(num: number) {
  return num.toString().padStart(2, '0');
}


export function convertSecondsToMinutes(secondsData: number | string) {
  const secondsNumber = Number(secondsData);
  const minutes = Math.floor(secondsNumber / 60);
  const seconds = secondsNumber % 60;

  return minutes === 60
    ? `${minutes + 1}`
    : `${minutes}m ${padTo2Digits(seconds)}s`;
}



export function convertUnit(nb: number) {
  if (typeof nb === 'number' && !isNaN(nb)) {
    if (nb >= 1000) {
      return Number((nb / 1000).toFixed(0)) + `k`;
    } else {
      return nb
    }
  }
  else {
    return 0;
  }
};

export function checkTrainingStatus(trainObj: Record<string, idTrainStatusType>, currId: string, currIteration: string) {
  if (Object.keys(trainObj).length === 0) return false;

  if (trainObj[currId] && trainObj[currId].iteration === currIteration) {
    return true;
  } else {
    return false;
  }
};


export const calcCanvasRate = (imgData: ImageWHProps, bbox: number[]) => {
  const x_rate = imgData.width / imgData.naturalWidth;
  const y_rate = imgData.height / imgData.naturalHeight;

  const bboxData = {
    x: Math.round(bbox[0] * x_rate),
    y: Math.round(bbox[1] * y_rate),
    x1: Math.round(bbox[2] * x_rate),
    y1: Math.round(bbox[3] * x_rate),
    width: Math.round(bbox[2] * x_rate) - Math.round(bbox[0] * x_rate),
    height: Math.round(bbox[3] * y_rate) - Math.round(bbox[1] * y_rate),
  };

  return {
    bboxData
  }

};


