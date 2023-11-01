import React, { useState, useEffect, useImperativeHandle, forwardRef, useContext } from 'react';
import { useSelector, useDispatch } from "react-redux";
import log from "../../utils/console";
import styled from 'styled-components';

import { map, find, filter, includes, cloneDeep, findIndex } from 'lodash-es';

import { selectCurrentClassInfo, setClassInfo, setFavLabels } from "../../redux/store/slice/currentClassInfo";
import { selectCurrentBbox, setCurrentBbox } from "../../redux/store/slice/currentBbox";

import { favoriteLabelAPI, updateBboxAPI,editImgClassAPI } from '../../constant/API';

import { MainContext } from '../../pages/Main';

const ClassButton = styled.div(props => ({
    background: props.$background,
    border: '1px solid #FFFFFF66',
    borderRadius: 5,
    height: 28,
    padding: '2px 12px 4px 12px',
    fontSize: 16,
    color: 'white',
    cursor: 'pointer',
    border: '1px solid #FFFFFF66',
}));


const ClassButtonPanel = forwardRef((props, ref) => {

    const [disabled, setDisabled] = useState(false);

    const [combinedClassArr, setCombinedClassArr] = useState([]);

    const classInfo = useSelector(selectCurrentClassInfo).classInfo;
    const favLabels = useSelector(selectCurrentClassInfo).favLabels;

    const currentBbox = useSelector(selectCurrentBbox).bbox;
    const labelIndex = useSelector(selectCurrentBbox).labelIndex;
    const imageName = useSelector(selectCurrentBbox).imageName;

    const { datasetId, dataType } = useContext(MainContext);

    const dispatch = useDispatch();

    const handleClassSelect = (myItem) => {

        props.onClick(myItem.class_name);

        if (dataType === 'object_detection') {
            if (labelIndex >= 0) {
                const myCurrentBbox = cloneDeep(currentBbox);

                myCurrentBbox[labelIndex].class_name = myItem.class_name;
                myCurrentBbox[labelIndex].color_hex = myItem.class_color;
                myCurrentBbox[labelIndex].class_id = myItem.class_id;

                // (1) Update Local Data
                dispatch(setCurrentBbox(myCurrentBbox));

                // (2) Update Server Data
                const myPayload = {};
                myPayload.image_name = imageName;
                myPayload.box_info = myCurrentBbox;
                myPayload.confirm = props.confirmStatus;

                updateBboxAPI(datasetId, myPayload)
                    .then(({ status }) => {
                        log('updateBboxAPI-res', status);

                    })
                    .catch(({ response }) => {
                        log('updateBboxAPI-Error', response.data);
                    })


            }
        }

        if (dataType === 'classification') {
            //const myIndex=findIndex(classInfo
            const myIndex = findIndex(classInfo, function (o) { return o.class_name === myItem.class_name; });

            log('myIndex', myIndex)
            log('classInfo[myIndex]',classInfo[myIndex])
            log('currentBbox', currentBbox)

            const myOldClassName=(currentBbox.length>0)?currentBbox[0].class_name:"Unlabeled";
            const myNewClassName=classInfo[myIndex].class_name;

            log('myOldClassName', myOldClassName)
            log('myNewClassName', myNewClassName)

            const myBoxInfo=cloneDeep(classInfo[myIndex]);
            myBoxInfo.bbox=[0,0,0,0]

            dispatch(setCurrentBbox([myBoxInfo]));

    
            

            // update to server
            const myPayload = {};
            myPayload.images_info = { [myOldClassName] : [imageName] };
            myPayload.class_name = myNewClassName;

            log('myPayload', myPayload)

            editImgClassAPI(datasetId, myPayload)
            .then(({ data }) => {
                log('update class to classification success', data)

                favoriteLabelAPI(datasetId)
                .then(({ data }) => {
                    const myData = data.data;
                    const myArr = [];
                    Object.keys(myData).forEach(function (k) {
                        myArr.push(myData[k]);
                    });
                    dispatch(setFavLabels(myArr));
                }).catch(({ response }) => {
                    log(response.data.message);
                    dispatch(setFavLabels([]));
                });

                props.onClassChange([myBoxInfo],myNewClassName,myOldClassName)

            }).catch(({ response }) => {
                log(response.data.message);
            });

        }


    };

    const getClassName = (myClassId) => {

        if (classInfo.length > 0) {
            const res = filter(classInfo, (obj) => {
                if (parseInt(obj.class_id) === parseInt(myClassId)) return true;
            })

            return res[0].class_name;
        } else {
            return 'N/A';
        }
    }

    const getClassColor = (myClassName) => {

        if (classInfo.length > 0) {

            const res = filter(classInfo, (obj) => {
                if (obj.class_name === myClassName) return true;
            })

            if (res[0] !== undefined) return res[0].color_hex;

            return '#ffffff';
        } else {
            return '#ffffff';
        }
    }

    useImperativeHandle(ref, () => ({


    }));


    useEffect(() => {


        favoriteLabelAPI(datasetId)
            .then(({ data }) => {
                const myData = data.data;
                const myArr = [];
                Object.keys(myData).forEach(function (k) {
                    myArr.push(myData[k]);
                });
                dispatch(setFavLabels(myArr));
            }).catch(({ response }) => {
                dispatch(setFavLabels([]));
                log(response.data.message);
            });

    }, []);

    return (

        <div className='d-flex flex-row gap-2'>
            {
                favLabels.map((item, idx) => (

                    <div className='my-class-button' style={{ backgroundColor: getClassColor(item.class_name) }} key={idx} onClick={(event) => handleClassSelect(item, event)} name="classButton">{item.class_name}</div>
                ))
            }

        </div>

    );
});

export default ClassButtonPanel;
