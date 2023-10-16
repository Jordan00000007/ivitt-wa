import log from "./console";
const geometric = require("geometric");


const lineIntersectsPolygon=(myLine,myPolygon)=>{

    //const line=[[115,150],[1037,150]]
    //const polygon = [[476, 150],[546, 150],[546, 110],[566, 53],[574, 50],[576, 20],[578, 50],[586, 53],[606, 110],[606, 150],[676, 150],[676, 270],[476, 270]];

    let tmpPoly=[]
    myPolygon.forEach(ele => {
        tmpPoly.push([ele.x,ele.y])
    });

    return(geometric.lineIntersectsPolygon(myLine, tmpPoly));


}

export const lineInPolygon=(myLine,myPolygon)=>{

    //const line=[[115,150],[1037,150]]
    //const polygon = [[476, 150],[546, 150],[546, 110],[566, 53],[574, 50],[576, 20],[578, 50],[586, 53],[606, 110],[606, 150],[676, 150],[676, 270],[476, 270]];

    let tmpPoly=[]
    myPolygon.forEach(ele => {
        tmpPoly.push([ele.x,ele.y])
    });

    let ans=false;
    if ((geometric.pointInPolygon(myLine[0],tmpPoly))&&(geometric.pointInPolygon(myLine[1],tmpPoly))){
        ans=true;
    }
 
    return ans;

}

export const getMediaSize=(canvasSize,imageSize)=>{

    //const line=[[115,150],[1037,150]]
    //const polygon = [[476, 150],[546, 150],[546, 110],[566, 53],[574, 50],[576, 20],[578, 50],[586, 53],[606, 110],[606, 150],[676, 150],[676, 270],[476, 270]];
   
    if ((imageSize.height<=canvasSize.height)&&(imageSize.width<=canvasSize.width)){
        //log('case 1')
        return imageSize;
    }else if ((imageSize.height>canvasSize.height)&&(imageSize.width<=canvasSize.width)){
        //log('case 2')
        const newImageSize={};
        newImageSize.height=canvasSize.height;
        newImageSize.width=Math.floor(imageSize.width*canvasSize.height/imageSize.height);
        return newImageSize;
    }else if ((imageSize.height<=canvasSize.height)&&(imageSize.width>canvasSize.width)){
        //log('case 3')
        const newImageSize={};
        newImageSize.width=canvasSize.width;
        newImageSize.height=Math.floor(imageSize.height*canvasSize.width/imageSize.width);
        return newImageSize;
    }else if ((imageSize.height>canvasSize.height)&&(imageSize.width>canvasSize.width)){
        //log('case 4')
        const newImageSize1={};
        newImageSize1.width=canvasSize.width;
        newImageSize1.height=Math.floor(imageSize.height*canvasSize.width/imageSize.width);

        const newImageSize2={};
        newImageSize2.width=Math.floor(imageSize.width*canvasSize.height/imageSize.height);
        newImageSize2.height=canvasSize.height;
       
        return (newImageSize1.height<= canvasSize.height)?newImageSize1:newImageSize2;
    }else{
        //log('case 5')
        return imageSize;
    }
    
 
    //return {width:100,height:120};

}


export const getRboxFromBbox=(bbox,sizeInfo)=>{

    log('-- bbox ---')
    log(bbox)

    const myData={};
    const ratioX=sizeInfo.mediaWidth/sizeInfo.imageWidth;
    const ratioY=sizeInfo.mediaHeight/sizeInfo.imageHeight;
    myData.x=Math.round(bbox.bbox[0]*ratioX);
    myData.y=Math.round(bbox.bbox[1]*ratioY);
    myData.width=Math.round((bbox.bbox[2]-bbox.bbox[0])*ratioX);
    myData.height=Math.round((bbox.bbox[3]-bbox.bbox[1])*ratioY);
    myData.stroke=bbox.color_hex;
    myData.class_id=bbox.class_id;
    myData.class_name=bbox.class_name;
   
    return myData
}

export const getBboxFromRbox=(rbox,sizeInfo)=>{

    const myData={};
    const ratioX=sizeInfo.mediaWidth/sizeInfo.imageWidth;
    const ratioY=sizeInfo.mediaHeight/sizeInfo.imageHeight;
    myData.x1=Math.round(rbox.x/ratioX);
    myData.y1=Math.round(rbox.y/ratioY);
    myData.x2=Math.round((rbox.x+rbox.width)/ratioX);
    myData.y2=Math.round((rbox.y+rbox.height)/ratioY);
    myData.class_id=rbox.class_id;
    myData.class_name=rbox.class_name;

    return myData
}



export const checkPointInRect=(myPoint,myBbox,sizeInfo)=>{
  
    const ratioX=sizeInfo.mediaWidth/sizeInfo.imageWidth;
    const ratioY=sizeInfo.mediaHeight/sizeInfo.imageHeight;
    const x1=Math.min(Math.round(myBbox[0]*ratioX),Math.round(myBbox[2]*ratioX));
    const y1=Math.min(Math.round(myBbox[1]*ratioY),Math.round(myBbox[3]*ratioY));
    const x2=Math.max(Math.round(myBbox[0]*ratioX),Math.round(myBbox[2]*ratioX));
    const y2=Math.max(Math.round(myBbox[1]*ratioY),Math.round(myBbox[3]*ratioY));
    if ((myPoint.x >= x1) && (myPoint.x <= x2) && (myPoint.y >= y1) && (myPoint.y <= y2)) {
        return true;
    }else{
        return false;
    }
  
}

export default lineIntersectsPolygon;