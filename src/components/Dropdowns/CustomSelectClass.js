import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef, useContext } from 'react';
import { useSelector, useDispatch } from "react-redux";
import OutsideClickHandler from 'react-outside-click-handler';
import ReactHover, { Trigger, Hover } from "react-hover";
import { faChevronUp, faChevronDown, faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { cloneDeep, filter, findIndex } from 'lodash-es';
import ClassTooltip from '../../components/Tooltips/ClassTooltip';


import log from "../../utils/console";
import { ReactComponent as Label_AI } from '../../assets/Label_AI.svg';
import { ReactComponent as Label_Man } from '../../assets/Label_Man.svg';
import { ReactComponent as Icon_More } from '../../assets/Icon_More.svg';
import CustomInput from '../../components/Inputs/CustomInput';
import ClassEditPanel from '../../components/Panels/ClassEditPanel';
import ColorfulPicker from '../../components/ColorPicker/ColorfulPicker';

import { selectCurrentClassInfo, setClassEditingIndex, setClassSelectedIndex, setClassInfo, setClassInfoPrev,setFavLabels } from "../../redux/store/slice/currentClassInfo";
import { MainContext } from '../../pages/Main';
import { renameClassAPI, addClassAPI, toGetClassAndNumberAPI, classChangeColorAPI, editImgClassAPI, favoriteLabelAPI  } from '../../constant/API';
import { selectCurrentBbox, setLabelIndex, setAiLabelIndex, setCurrentBbox, setAutoBox } from "../../redux/store/slice/currentBbox";

import { selectCurrentIdx, setCurrentIdx } from "../../redux/store/slice/currentIdx";





const CustomSelectClass = forwardRef((props, ref) => {


    const [placeHolder, setPlaceHolder] = useState(props.placeHolder);
    const [expandClassMenu, setExpandClassMenu] = useState(false);

    const [dialogTop, setDialogTop] = useState(36);
    const [dialogOrder, setDialogOrder] = useState(-1);
    const [dialogItem, setDialogItem] = useState(['-1', '', '#ff0000']);

    const { datasetId, dataType, combinedClass, activeClassName, setActiveClassName } = useContext(MainContext);


    //const [selectedItem,setSelectedItem] =useState(null);
    //const [selectedIndex, setSelectedIndex] = useState(-1);

    const [currentClassInput, setCurrentClassInput] = useState('');

    const classEditPanelRef=useRef();


    const classInfo = useSelector(selectCurrentClassInfo).classInfo;
    const classInfoPrev = useSelector(selectCurrentClassInfo).classInfoPrev;
    const classEditingIndex = useSelector(selectCurrentClassInfo).classEditingIndex;
    const classSelectedIndex = useSelector(selectCurrentClassInfo).classSelectedIndex;

    const currentBbox = useSelector(selectCurrentBbox).bbox;
    const imageName = useSelector(selectCurrentBbox).imageName;

    const currentIdx = useSelector(selectCurrentIdx).idx;


    const buttonRef = useRef(null);
    const inputClassRef = useRef(null);


    const dispatch = useDispatch();


    const handleSelectChange = (event, value) => {

        log('select change');

    };

    const handleClassCreate = () => {

        log('handle class create')

        if (currentClassInput !== '') {

            try {

                // check class name exist or not
                const myIndex = findIndex(classInfo, function (o) { return o.class_name === currentClassInput; });

                if (myIndex >= 0) {
                    dispatch(setClassEditingIndex(-1));
                    dispatch(setClassSelectedIndex(myIndex));
                    setCurrentClassInput('');
                    setExpandClassMenu(false);
                } else {


                    const ids = [];
                    classInfo.map(object => {
                        if (parseInt(object.color_id) < 1000) {
                            ids.push(parseInt(object.color_id))
                        }

                    });

                    const myColorId = (ids.length > 0) ? (Math.max(...ids) + 1) : 0;

                    const myPayload = {};
                    myPayload.class_name = currentClassInput;
                    myPayload.color_hex = '';
                    myPayload.color_id = myColorId;

                    log('myPayload')
                    log(myPayload)

                    const myItem = {};

                    addClassAPI(datasetId, myPayload)
                        .then(({ data }) => {
                            log('create class success')

                            toGetClassAndNumberAPI(datasetId, 'workspace').then((data) => {

                                const classes_info = data.data.data.classes_info;
                                const myClassInfo = [];
                                let selectedIndex = -1;
                                Object.keys(classes_info).forEach(function (myKey, idx) {
                                    const myItem = {};
                                    myItem.class_name = myKey;
                                    myItem.class_id = classes_info[myKey].class_id;
                                    myItem.color_id = classes_info[myKey].color_id;
                                    myItem.color_hex = classes_info[myKey].color_hex;
                                    myClassInfo.push(myItem);
                                    if (currentClassInput === myKey) selectedIndex = idx;

                                });

                                dispatch(setClassInfo(myClassInfo));
                                dispatch(setClassEditingIndex(-1));
                                dispatch(setClassSelectedIndex(selectedIndex));
                                setExpandClassMenu(false);

                                //myClassInfo

                                if (dataType === 'classification') {
                                    if (selectedIndex >= 0) {
                                        dispatch(setCurrentBbox([myClassInfo[selectedIndex]]));
                                       

                                        // update to server
                                        const myOldClassName = (currentBbox.length>0)?currentBbox[0].class_name:"Unlabeled";
                                        const myNewClassName = myClassInfo[selectedIndex].class_name;

                                        const myPayload = {};
                                        myPayload.images_info = { [myOldClassName] : [imageName.replace("//", "")] };
                                        myPayload.class_name = myNewClassName;

                                        editImgClassAPI(datasetId, myPayload)
                                            .then(({ data }) => {
                                                log('update class to classification success', data)

                                                favoriteLabelAPI(datasetId)
                                                .then(({ data }) => {
                                                    const myData = data.data;
                                                    const myArr = [];
                                                    Object.keys(myData).forEach(function (k) {
                                                        log(myData[k]);
                                                        myArr.push(myData[k]);
                                                    });
                                                    dispatch(setFavLabels(myArr));
                                                }).catch(({ response }) => {
                                                    log(response.data.message);
                                                    dispatch(setFavLabels([]));
                                                });

                                                // Refresh Local Data    
                                               
                                                props.onClassChange([myClassInfo[selectedIndex]],myNewClassName,myOldClassName)

                                            }).catch(({ response }) => {
                                                log(response.data.message);
                                            });


                                        
                                    }
                                }


                            })


                        }).catch(({ response }) => {
                            log(response.data.message);
                        });


                    log('dataType',dataType)
                    if (dataType==='classification'){

                        log('currentBbox',currentBbox)
                        const myBoxInfo={};
                        myBoxInfo.bbox=[0,0,0,0];
                        myBoxInfo.class_id=myItem.class_id;
                        myBoxInfo.class_name=myItem.class_name;
                        myBoxInfo.color_hex=myItem.color_hex;
                        myBoxInfo.color_id=myItem.color_id;
                        log('myBoxInfo',myBoxInfo)
                        dispatch(setCurrentBbox([myBoxInfo]));
                        //props.onClassChange([myBoxInfo])

                    }




                }

            } catch (error) {
                log(error)
            }
        }

        setCurrentClassInput('');


    }

    const handleChange = (event, value) => {

        log(event);

    };

    const handleClick = (event, value) => {

        log(event);

    };

    //handleSourceMenuClick

    const handleClassMenuClick = (event, value) => {

        log('handle classs menu toggle')

        log('classSelectedIndex',classSelectedIndex)

        expandClassMenu ? setExpandClassMenu(false) : setExpandClassMenu(true);

    };

    useEffect(() => {
        log('classSelectedIndex')
        log(classSelectedIndex)

        if (classSelectedIndex === -1) {

            if (classInfo.length === 0) {
                dispatch(setClassEditingIndex(-2))
            }
            if (dataType === 'object_detection') {
                if ((classInfo.length - 1) >= props.defaultValue) {
                    log('set default selected class')
                    dispatch(setClassSelectedIndex(props.defaultValue))

                }
            }

        }

    }, [props.defaultValue, classInfo]);


    useImperativeHandle(ref, () => ({

        setSelectedIndex: (myClassIndex) => {

            dispatch(setClassSelectedIndex(myClassIndex))
        },

        setSelectedClassName: (myClassName) => {


            const myIndex = findIndex(classInfo, function (o) { return o.class_name === myClassName; });
            dispatch(setClassSelectedIndex(myIndex))


        },

        setAllMenuClose: () => {

            dispatch(setClassEditingIndex(-1))
            setExpandClassMenu(false);

        },

        setDeleteClassConfirm: () => {

           log('Set Delete Class Confirm')
           classEditPanelRef.current.setDeleteClassConfirm();

        },
    }));


    const handleClassMenuOutsideClick = (evt) => {

        log('handle out side click')
        log('classEditingIndex')
        log(classEditingIndex)

        if (!props.showDeleteConfirmModal){

        

        const actionName = evt.target.getAttribute('name');

        log('actionName')
        log(actionName)

        if (classEditingIndex === -2) {

            if (currentClassInput.length > 0) {
                log('create new class now')
                handleClassCreate();
            }

        }
        if (classEditingIndex >= 0) {

            dispatch(setClassEditingIndex(-1));
            setExpandClassMenu(true);



            // update class name to server
            classInfo.forEach((item, idx) => {

                if (item.class_name !== classInfoPrev[idx].class_name) {

                    if (item.class_name !== '') {
                        const myPayload = {};
                        myPayload.class_name = classInfoPrev[idx].class_name;
                        myPayload.new_name = item.class_name;

                        renameClassAPI(datasetId, myPayload)
                            .then(({ data }) => {
                                log('rename success')

                                props.onClassModifyDone();
                            });
                    } else {
                        dispatch(setClassInfo(classInfoPrev));
                    }

                }
            })

            // update class color to server

            classInfo.forEach((item, idx) => {

                if (item.color_hex !== classInfoPrev[idx].color_hex) {

                    const myPayload = {};
                    myPayload.class_name = item.class_name;
                    myPayload.color_hex = item.color_hex;
                    myPayload.color_id = '';

                    classChangeColorAPI(datasetId, myPayload)
                        .then(({ data }) => {
                            log('change class color success')
                        }).catch(({ response }) => {
                            log(response.data.message);
                        });
                }
            })



        } else {
            (actionName === 'classInputName') ? setExpandClassMenu(true) : setExpandClassMenu(false);
        }

        setCurrentClassInput('');

        }

    }

    const handleClassSelected = (myIndex) => {

        log('handle Class Selected')

        log(myIndex)

        setDialogOrder(-1);
        setExpandClassMenu(false);
        dispatch(setClassEditingIndex(-1));
        dispatch(setClassSelectedIndex(myIndex));
        inputClassRef.current.value = classInfo[myIndex].class_name;


        if (dataType === 'classification') {

            log('currentBbox', currentBbox)
            const myBoxInfo = {};
            myBoxInfo.bbox = [0, 0, 0, 0];
            myBoxInfo.class_id = classInfo[myIndex].class_id;
            myBoxInfo.class_name = classInfo[myIndex].class_name;
            myBoxInfo.color_hex = classInfo[myIndex].color_hex;
            myBoxInfo.color_id = classInfo[myIndex].color_id;

            log('myBoxInfo', myBoxInfo)
            dispatch(setCurrentBbox([myBoxInfo]));

            // const realIndex = dataSetList[currentIdx].idx;
            // imgBoxList[realIndex].box_info = myBox;

            const myOldClassName=(currentBbox.length>0)?currentBbox[0].class_name:"Unlabeled";
            const myNewClassName=classInfo[myIndex].class_name;

            log('myNewClassName',myNewClassName)
            log('myOldClassName',myOldClassName)

    
            // update to server
            const myPayload = {};
            myPayload.images_info = { [myOldClassName] : [imageName.replace("//", "")] };
            myPayload.class_name = myNewClassName;

            editImgClassAPI(datasetId, myPayload)
                .then(({ data }) => {
                    log('update class to classification success', data)

                    favoriteLabelAPI(datasetId)
                    .then(({ data }) => {
                        const myData = data.data;
                        const myArr = [];
                        Object.keys(myData).forEach(function (k) {
                            log(myData[k]);
                            myArr.push(myData[k]);
                        });
                        dispatch(setFavLabels(myArr));

                        props.onClassChange([myBoxInfo],myNewClassName,myOldClassName);

                    }).catch(({ response }) => {
                        log(response.data.message);
                        dispatch(setFavLabels([]));
                    });

                }).catch(({ response }) => {
                    log(response.data.message);
                });

        }

    }

    const handleClassItemHover = (order) => {
        if (classEditingIndex !== order) {
            dispatch(setClassEditingIndex(-1));
        }
    }

    const handleClassModifyDone = () => {

        dispatch(setClassEditingIndex(-1));
        props.onClassModifyDone();

    }

    const handleDeleteClass = () =>{
        props.onDeleteClass();
    }

    const CustomClassItem = ({ item, onSelected, onHover, onOpen, order, onFocus }) => {

        const [isHover, setIsHover] = useState(false);

        const [isOpen, setIsOpen] = useState(false);

        const handleClassItemOver = (evt) => {

            setIsHover(true);
            onHover();
        }

        const handleClassItemLeave = (evt) => {

            setIsHover(false);
            //setIsOpen(false);
        }

        const handleClassEditDialog = () => {
            log('open dialog')
            setIsOpen(true);
        }

        const handleDialogOutsideClick = () => {
            log('handle Dialog Outside Click')
            setIsOpen(false);
        }

        useEffect(() => {


        }, []);

        return (
            <div className={onFocus ? 'my-class-item-focus d-flex flex-row justify-content-between align-items-center' : 'my-class-item d-flex flex-row justify-content-between align-items-center'} onClick={() => onSelected(item)} onMouseOver={handleClassItemOver} onMouseLeave={handleClassItemLeave}>
                <div className="d-flex flex-row align-items-center" >
                    <div style={{ marginRight: 5 }}>
                        <Label_Man fill={item.color_hex}></Label_Man>
                    </div>
                    <div>{item.class_name}</div>
                </div>
                {
                    ((isHover) || (onFocus)) &&
                    <div className={onFocus ? 'my-edit-icon-focus' : 'my-edit-icon'} onClick={(event) => { onOpen(order, item); event.stopPropagation(); }}>
                        <Icon_More ></Icon_More>
                    </div>

                }
            </div>
        )
    }


    const handleDialogOpen = (order, item) => {
        log('classEditingIndex=' + order)
        if (classEditingIndex === order) {
            dispatch(setClassEditingIndex(-1))
        } else {
            setDialogTop(36 * order + 36);
            dispatch(setClassEditingIndex(order))
        }
        dispatch(setClassInfoPrev(classInfo));

    }

    const handleDialogOutsideClick = () => {
        log('handle dialog outside click')
    }

    const handleClassRename = (newName, oldName) => {
        log('handle class rename')
        log(newName)



    }

    const handleSelectedInputChange = (value) => {
        const checkValue=value.replace("+","").replace("/","").replace("?","").replace("%","").replace("#","").replace("&","").replace("=","").replace(" ","");
        setCurrentClassInput(checkValue)

        if (checkValue.length!== value.length){
            props.onAlert(1,'Illegal character input');
        }

    }

    const handleClassFocus = (event) => {
        event.stopPropagation();
        log('handle Class Focus')
        setCurrentClassInput('');
        setExpandClassMenu(true);
        dispatch(setClassSelectedIndex(-1))
        dispatch(setClassEditingIndex(-2))

    }


    const editingPanelRef = useRef(null);

    useEffect(() => {
        dispatch(setClassEditingIndex(-1))

        log('classSelectedIndex')
        log(classSelectedIndex)

        log('classEditingIndex')
        log(classEditingIndex)

    }, []);

    useEffect(() => {

        log('currentBbox change....')
        log(currentBbox)

        if (dataType === 'classification') {

            if (currentBbox.length === 0) {
                dispatch(setClassSelectedIndex(-1));
            } else {

                const myClassName = currentBbox[0].class_name;

                const myIndex = findIndex(classInfo, (ele) => {
                    return ele.class_name == myClassName;
                }, 0);
                dispatch(setClassSelectedIndex(myIndex));

            }

        }

    }, [currentBbox]);

    return (

        <div style={{ width: 240, height: 52 }}>
            <ClassTooltip expandClassMenu={expandClassMenu}>
                <div className="my-input-group" >
                    <input type="text" className="my-source-input" aria-label="Text input with dropdown button" placeholder='--- please select ---'
                        onChange={(evt) => handleSelectedInputChange(evt.target.value)}
                        onFocus={handleClassFocus}
                        value={(classSelectedIndex === -1) ? ((classEditingIndex === -2) ? currentClassInput : '') : (classInfo[classSelectedIndex] === undefined) ? '' : classInfo[classSelectedIndex].class_name}
                        ref={inputClassRef}
                        name="classInputName"
                        autoComplete="off"
                    />
                    <button className="my-source-input-button" type="button" aria-expanded="false"
                        disabled={props.disabled}
                        onClick={handleClassMenuClick}
                        ref={buttonRef}
                    >
                        {
                            expandClassMenu ?
                                <FontAwesomeIcon icon={faChevronUp} className="my-chevron-icon" transform="shrink-3" />
                                :
                                <FontAwesomeIcon icon={faChevronDown} className="my-chevron-icon" transform="shrink-3" />
                        }

                    </button>

                    <Label_Man fill={(classSelectedIndex === -1) ? '#16272E3D' : (classInfo[classSelectedIndex] === undefined) ? '#16272E3D' : classInfo[classSelectedIndex].color_hex} className="my-class-icon"></Label_Man>
                   
                    {
                        expandClassMenu &&
                        <div className='my-class-menu position-relative'>
                            <OutsideClickHandler onOutsideClick={handleClassMenuOutsideClick}>
                                <div >
                                    <div className='my-hint-text'>{(classInfo.length === 0) ? 'Typing to create class' : 'Select a class or create one'}</div>
                                    <div className='my-class-item d-flex flex-row justify-content-between align-items-center'>
                                        <div className="d-flex flex-row align-items-center">
                                            <div style={{ marginRight: 5 }}>
                                                <Label_Man fill={'#16272E3D'}></Label_Man>
                                            </div>
                                            <div className={(currentClassInput === '') ? 'my-class-display-empty' : 'my-class-display'}>
                                                {(currentClassInput === '') ? '---' : currentClassInput}
                                            </div>
                                        </div>
                                        <div className={(currentClassInput === '') ? 'my-create-button-empty' : 'my-create-button'} onClick={handleClassCreate}>Create</div>
                                    </div>

                                    {
                                        (classEditingIndex >= 0) &&

                                        <div style={{ position: 'relative' }}>
                                            <div style={{ position: 'absolute', left: 120, top: dialogTop }}>
                                                <ClassEditPanel data={props.data} dialogOrder={dialogOrder} onDeleteClassDone={handleClassModifyDone} onDeleteClass={handleDeleteClass} onAlert={props.onAlert} ref={classEditPanelRef}></ClassEditPanel>
                                            </div>
                                        </div>


                                    }


                                    {
                                        classInfo.map((item, idx) => {
                                            return (
                                                <CustomClassItem key={`class_item_${idx}`} order={idx} onFocus={classEditingIndex === idx} item={item} onSelected={() => handleClassSelected(idx)} onHover={(event) => handleClassItemHover(idx)} onOpen={handleDialogOpen}></CustomClassItem>

                                            );
                                        })
                                    }


                                </div>
                            </OutsideClickHandler>
                        </div>
                    }



                </div>
            </ClassTooltip>
        </div>

    );
});

export default CustomSelectClass;