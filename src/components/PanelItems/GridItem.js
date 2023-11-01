import React, { useState, useEffect, useImperativeHandle, forwardRef, useContext } from 'react';
import log from "../../utils/console";
import styled from 'styled-components';

import { useSelector, useDispatch } from "react-redux";
import { map, find, filter, includes, cloneDeep } from 'lodash-es';

import { apiHost } from '../../constant/API/APIPath';

import { MainContext } from '../../pages/Main';

import { getAllProjectsAPI, toGetDatasetImgAPI, getBboxAPI, toGetClassAndNumberAPI, favoriteLabelAPI, addClassAPI } from '../../constant/API';

import { selectCurrentBbox, setLabelIndex } from "../../redux/store/slice/currentBbox";
import { selectCurrentClassInfo, setClassEditingIndex } from "../../redux/store/slice/currentClassInfo";

import { selectCurrentIdx, setCurrentIdx } from "../../redux/store/slice/currentIdx";


const GridItem = forwardRef((props, ref) => {

    const dispatch = useDispatch();

    const { datasetId, dataType, combinedClass, activeClassName, setActiveClassName } = useContext(MainContext);

    const currentIdx = useSelector(selectCurrentIdx).idx;

    const GUTTER_SIZE = 10;

    const [selected, setSelected] = useState(false);

    const [imagePath, setImagePath] = useState('');

    const [dataSet, setDataSet] = useState({box_info:[],img_shape:[300,400]});




    useImperativeHandle(ref, () => ({

    }));

    useEffect(() => {

        if ((dataType === 'object_detection')&&(imagePath!=='')) {

            // if (!props.dataSet.loaded){
            //     const myIdx=props.columnIndex + props.rowIndex * 3;
            
            //     getBboxAPI(datasetId, { image_path:imagePath })
            //     .then(({ data }) => {
    
                    
            //         //log('currentDataSet',dataSet)
            //         const myDataSet=cloneDeep(dataSet);
            //         myDataSet.box_info=data.data.box_info;
            //         myDataSet.img_shape=data.data.img_shape;
            //         myDataSet.loaded=true;
            //         setDataSet(myDataSet)
                  
            //     })
            //     .catch((error) => {
            //         log(error);
            //     });
            // }

          


        }

    }, [imagePath]);

    useEffect(() => {
      
        setImagePath(props.dataSet.img_path.replace("./","/"));
        setDataSet(props.dataSet);

    }, []);

    useEffect(() => {

        log('currentIdx change =>',currentIdx)

        // const myIdx=props.columnIndex + props.rowIndex * 3;
        // if (currentIdx===myIdx){
        //     props.onDataLoaded(dataSet,myIdx)
        // }
      

    }, [datasetId]);

    return (

        <div
            className="my-grid-item"
            style={{
                ...props.style,
                backgroundColor: '#f1f1f1',
                border: '0px solid #979CB580',
                left: props.style.left + GUTTER_SIZE,
                top: props.style.top + GUTTER_SIZE,
                width: props.style.width - GUTTER_SIZE,
                height: props.style.height - GUTTER_SIZE,
            }}
        >
            {((props.columnIndex + props.rowIndex * 3) < props.length) ?
                <div style={{ position: 'relative' }}>
                    <div className='d-flex align-items-center justify-content-center'
                        style={{ cursor: 'pointer', width: 80, height: 80, border: (currentIdx === (props.columnIndex + props.rowIndex * 3)) ? '2px solid #FF1111' : '0px' }}
                        onClick={() => {
                            dispatch(setCurrentIdx(props.columnIndex + props.rowIndex * 3));
                            //props.onDataLoaded(dataSet,props.columnIndex + props.rowIndex * 3)

                            // onclick close other menu
                            //classSelectorRef.current.setAllMenuClose();


                            // dispatch(setAutoBox([]));
                            // checkAutoBox(dataSetList[columnIndex + rowIndex * 3].img_path.slice(dataSetList[columnIndex + rowIndex * 3].img_path.indexOf('//')));

                        }}
                    >
                        <img src={`${apiHost}/display_img/${props.dataSet.img_path}`} style={{ maxWidth: '100%', maxHeight: '100%' }} className="my-thumb-image"></img>
                    </div>
                    {
                        (dataSet.box_info.length > 0) &&
                        <div style={{ position: 'absolute', bottom: 0, right: 3 }}>
                            <img src={require('../../assets/Labeled.png')} />
                        </div>
                    }
                </div>
                :
                <></>
            }
        </div>
    );
});

export default GridItem;
