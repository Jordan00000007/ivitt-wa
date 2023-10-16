import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef, useContext } from 'react';
import { useSelector, useDispatch } from "react-redux";
import OutsideClickHandler from 'react-outside-click-handler';
import ReactHover, { Trigger, Hover } from "react-hover";
import { faChevronUp, faChevronDown, faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { cloneDeep,filter } from 'lodash-es';


import log from "../../utils/console";
import { ReactComponent as Label_AI } from '../../assets/Label_AI.svg';
import { ReactComponent as Label_Man } from '../../assets/Label_Man.svg';
import { ReactComponent as Icon_More } from '../../assets/Icon_More.svg';
import CustomInput from '../../components/Inputs/CustomInput';
import ColorfulPicker from '../../components/ColorPicker/ColorfulPicker';
import { selectCurrentClassInfo, setClassInfo, setClassEditingIndex, setClassSelectedIndex, setFavLabels } from "../../redux/store/slice/currentClassInfo";
import { MainContext } from '../../pages/Main';
import { renameClassAPI,deleteClassAPI,updateBboxAPI,addClassAPI,classChangeColorAPI,favoriteLabelAPI,toGetDatasetImgAPI,getBboxAPI } from '../../constant/API';

import { selectCurrentBbox, setCurrentBbox,setAutoBox } from '../../redux/store/slice/currentBbox';


const ClassEditPanel = forwardRef((props, ref) => {

    const [isHover, setIsHover] = useState(false);

    const { datasetId,activeClassName } = useContext(MainContext);



    const colorPaletteRef = useRef(null);

    const dispatch=useDispatch();

    const classInfo = useSelector(selectCurrentClassInfo).classInfo;
    const classEditingIndex = useSelector(selectCurrentClassInfo).classEditingIndex;
    const classSelectedIndex = useSelector(selectCurrentClassInfo).classSelectedIndex;
    const favLabels = useSelector(selectCurrentClassInfo).favLabels;

    const currentBbox = useSelector(selectCurrentBbox).bbox;
    const autoBox = useSelector(selectCurrentBbox).autobox;
    const imageName = useSelector(selectCurrentBbox).imageName;

    const handleSetColor = (myColor) => {
        log('set color ='+myColor)
        
        const myClassInfo=cloneDeep(classInfo);
        myClassInfo[classEditingIndex].color_hex=myColor;
        dispatch(setClassInfo(myClassInfo));

        


    }

    const handleTextChange = (newName, oldName) => {
       
        const myClassInfo = cloneDeep(classInfo);
        myClassInfo.forEach((item) => {
            if (item.class_name === oldName)
                item.class_name = newName;
        })

        dispatch(setClassInfo(myClassInfo))

        log('modify bbox')
        const myCurrentBbox=cloneDeep(currentBbox);
        myCurrentBbox.forEach((item,idx)=>{
            log(item.class_name)
            if (item.class_name===oldName){
                myCurrentBbox[idx].class_name=newName;
            }
        })
        dispatch(setCurrentBbox(myCurrentBbox));

        log('modify autobox')
        const myAutoBox=cloneDeep(autoBox);
        myAutoBox.forEach((item,idx)=>{
            log(item.class_name)
            if (item.class_name===oldName){
                myAutoBox[idx].class_name=newName;
            }
        })
        dispatch(setAutoBox(myAutoBox));
        

        log('modify favorite label name');
        const myFavLabels=cloneDeep(favLabels);
        myFavLabels.forEach((item,idx)=>{
            log(item.class_name)
            if (item.class_name===oldName){
                myFavLabels[idx].class_name=newName;
            }
        })
        dispatch(setFavLabels(myFavLabels));


    }



    const handleClasssDelete=(evt)=>{
        log('handle class delete')

        try {

            // if (classSelectedIndex===classEditingIndex){
            //     dispatch(setClassSelectedIndex(-1));
            // }

            dispatch(setClassSelectedIndex(-1));
           
            const myClassName=classInfo[classEditingIndex].class_name


            // (1) Update Local Class Info
            const myClassInfo=cloneDeep(classInfo);
            myClassInfo.splice(classEditingIndex,1);
            dispatch(setClassInfo(myClassInfo));
            dispatch(setClassEditingIndex(-1));
            props.onDeleteClassDone();

            // (2) Update Local BBox 
            const myCurrentBox=cloneDeep(currentBbox);
            const myFilterBox=filter(myCurrentBox, function(o) { return o.class_name!==myClassName; });
            dispatch(setCurrentBbox(myFilterBox))


             // (3) Update Server Class Info
            deleteClassAPI(datasetId, myClassName)
            .then(({ data }) => {
                log('delete classs success');

                favoriteLabelAPI(datasetId)
                .then(({ data }) => {
                    const myData=data.data;
                    const myArr=[];
                    Object.keys(myData).forEach(function(k){
                        log(myData[k]);
                        myArr.push(myData[k]);
                    });      
                    dispatch(setFavLabels(myArr));
                }).catch(({ response }) => {
                    dispatch(setFavLabels([]));
                    log(response.data.message);
                });


            }).catch(({ response }) => {
                log('--- delete classs failed ---');
                log(response.data.message);
            });


            // (4) Update Server BBox
            const myPayload={};
            myPayload.image_name=imageName;
            myPayload.box_info=myFilterBox;
            myPayload.confirm=0;

            log('myPayload')
            log(myPayload)

            updateBboxAPI(datasetId, myPayload)
            .then(({ status }) => {
                log('updateBboxAPI-res', status);
            })
            .catch(({ response }) => {
                log('updateBboxAPI-Error', response.data);
            })


            // (5) Update Local Auto Box
            const myAutoBox=cloneDeep(autoBox);
            const myFilterAutoBox=filter(myAutoBox, function(o) { return o.class_name!==myClassName; });
            dispatch(setAutoBox(myFilterAutoBox))


            // (6) Reload All Data for counting label number

           
    
          
                 
        } catch (error) {
            log(error)
        }
    }

    useEffect(() => {

    

    }, []);


    return (

        (classEditingIndex>=0)?
        <div className='my-class-dialog' >
            <div className='container'>
                <div className='row' style={{ padding: 10 }}>
                    <div className='col-12 p-0'>
                        <CustomInput width="180" height="34" defaultValue={classInfo[classEditingIndex].class_name} onChange={handleTextChange}></CustomInput> 
                    </div>
                </div>
                <div className='row' style={{ padding: 0 }}>
                    <div className='col-12 p-0'>
                        <div className='my-hint-text'>Edit color palette</div>
                    </div>
                </div>
                <div className='row' style={{ paddingTop: 5, paddingLeft: 10, paddingRight: 10 }}>
                    <div className='col-12 p-0'>
                        <ColorfulPicker defaultColor={classInfo[classEditingIndex].color_hex} onChange={handleSetColor} ref={colorPaletteRef}></ColorfulPicker>
                    </div>
                </div>

            </div>

            <hr className='my-divider'></hr>
            <div className='container'>
                <div className='row' style={{ paddingTop: 0, paddingLeft: 10, paddingRight: 10 }}>
                    <div className='col-12 p-0'>
                        <div className='my-delete-button' onClick={handleClasssDelete}>Delete</div>
                    </div>
                </div>
            </div>
        </div>
        :
        <></>
    )
});

export default ClassEditPanel;