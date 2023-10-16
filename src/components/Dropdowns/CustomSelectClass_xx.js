import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef, useContext } from 'react';
import { useSelector, useDispatch } from "react-redux";
import OutsideClickHandler from 'react-outside-click-handler';
import ReactHover, { Trigger, Hover } from "react-hover";
import { faChevronUp, faChevronDown, faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { cloneDeep } from 'lodash-es';


import log from "../../utils/console";
import { ReactComponent as Label_AI } from '../../assets/Label_AI.svg';
import { ReactComponent as Label_Man } from '../../assets/Label_Man.svg';
import { ReactComponent as Icon_More } from '../../assets/Icon_More.svg';
import CustomInput from '../../components/Inputs/CustomInput';
import ColorfulPicker from '../../components/ColorPicker/ColorfulPicker';
import { selectCurrentBbox, setLabelIndex, setCurrentBbox, setImageName, setClassInfo,setClassEditingIndex } from "../../redux/store/slice/currentBbox";
import { MainContext } from '../../pages/Main';
import { renameClassAPI } from '../../constant/API';



const CustomSelectClass = forwardRef((props, ref) => {


    const [placeHolder, setPlaceHolder] = useState(props.placeHolder);
    const [expandClassMenu, setExpandClassMenu] = useState(false);

    const [dialogTop, setDialogTop] = useState(36);
    const [dialogOrder, setDialogOrder] = useState(-1);
    const [dialogItem, setDialogItem] = useState(['-1', 'N/A', '#ff0000']);

    const [selectedItem, setSelectedItem] = useState([]);

    const [localClassInfo, setLocalClassInfo] = useState([]);


    const classInfo = useSelector(selectCurrentBbox).classInfo;


    const buttonRef = useRef(null);

    const dispatch = useDispatch();



    const { datasetId } = useContext(MainContext);


    const handleSelectChange = (event, value) => {

        log('select change');

    };

    const handleChange = (event, value) => {

        log(event);

    };

    const handleClick = (event, value) => {

        log(event);

    };

    //handleSourceMenuClick

    const handleClassMenuClick = (event, value) => {

        expandClassMenu ? setExpandClassMenu(false) : setExpandClassMenu(true);

    };

    useEffect(() => {

        if (selectedItem.length === 0) {
            if ((classInfo.length - 1) >= props.defaultValue) {
                setSelectedItem(classInfo[props.defaultValue]);

            }
        }

    }, [props.defaultValue, classInfo]);

    useImperativeHandle(ref, () => ({
        setSelectedItem: (myItem) => {
            log('set selected item')
            log(myItem)
            setSelectedItem(myItem);
        }
    }));

    useEffect(() => {

        setLocalClassInfo(classInfo)

    }, [classInfo]);


    const handleClassMenuOutsideClick = () => {

        // if (dialogOrder < 0) {
        //     setExpandClassMenu(false);
        // } else {
        //     setDialogOrder(-1);
        // }
    }

    const handleClassSelected = (myClassItem) => {



        log(myClassItem)

        // classInfo.forEach(ele => {
        //     if (ele.class_id === myClassItem.class_id) {
        //         setSelectedItem(ele);
        //         dispatch(setClassEditingIndex(-1))
        //         setExpandClassMenu(false);
        //         props.onChange(ele);
        //     }

        // });

    }

    const handleClassItemHover = (order) => {
        log('class item hover')
        //setIsOpen(false);
        //if (dialogOrder !== order) dispatch(setClassEditingIndex(-1));

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
            setIsOpen(false);
        }

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
        log('handle edit class dialog open...')
        log(order)
        if (dialogOrder === order) {
            
            dispatch(setClassEditingIndex(-1))
        } else {
            dispatch(setClassEditingIndex(order))
        }
    }

    const handleDialogOutsideClick = () => {
        log('handle dialog outside click')
    }

    const handleTextChange = (myClassInfo) => {

        log('handle text change')
        log(myClassInfo)

        setLocalClassInfo(myClassInfo)


        // renameClassAPI(datasetId,myPayload)
        // .then(({ status }) => {
        //     log('renameClassAPI-res', status);
        //     datasetInfoApiCallback(datasetId,true)

        // })
        // .catch(({ response }) => {
        //     log('renameClassAPI-Error', response.data);
        // })






    }


    return (

        <div style={{ width: 240, height: 52 }}>
            <style>
                {`
                .my-input-group { 
                    position: relative; 
                    height: 32px;
                }
                
                .my-source-input { 
                    display: block; 
                    background: #fff; 
                    padding: 10px 40px 10px 28px; 
                    width: 240px; 
                    height: 36px;
                    border: 1px solid ${(expandClassMenu) ? '#979CB5' : '#979CB580'};
                    border-radius: 6px !important;
                    font-size: 16px;
                    color: #16272E;
                  
                }
                .my-source-input:hover { 
                    border: 1px solid #979CB5;   
                    
                }
                .my-source-input:focus { 
                    border: 1px solid #979CB5!important;  
                    outline: none;
                    -webkit-box-shadow: none!important;
                    -moz-box-shadow: none!important;
                    box-shadow: none!important;
                 
                }
                .my-source-input-empty { 
                    display: block; 
                    background: #fff; 
                    padding: 10px 40px 10px 28px; 
                    width: 240px; 
                    height: 36px;
                    border: 1px solid ${(expandClassMenu) ? '#979CB5' : '#979CB580'};
                    border-radius: 6px !important;
                    font-size: 16px;
                   
                    color: #979CB5;
                   
                  
                }
                .my-source-input-button { 
                    color: var(--on_color_2);
                    position: absolute; 
                    display: block; 
                    left: 208px; 
                    top: 3px; 
                    height: 30px;
                    width: 30x;
                    z-index: 9; 
                    border:1px solid white!important;
                    background: white;
                  
                }
                .my-class-icon { 
                   
                    position: absolute; 
                    display: block; 
                    left: 10px; 
                    top: 4px; 
                    height: 30px;
                    width: 30x;
                    z-index: 9; 
                    
                    background: white;
                  
                }
                .my-chevron-icon {
                    margin: 0px;
                    color: #7B7B93;
                    width: 14px;
                    height: 14px;
                    font-size: 20px!important;
                
                }
                .my-edit-icon {
                    margin: 0px;
                    width: 28px;
                    height: 28px; 
                    border-radius: 4px;
                }
                .my-edit-icon:hover {
                    background-color: #979CB533;

                }
                .my-edit-icon-focus {
                    margin: 0px;
                    width: 28px;
                    height: 28px; 
                    border-radius: 4px;
                    background-color: #979CB533;
                }
               
                .my-hint-text{
                    text-align: left;
                    font-size: 13px;
                    font-family:Roboto;
                    letter-spacing: 0px;
                    color: #979CB5;
                    padding: 0px 10px;
                }
                .my-create-button{
                    text-align: right;
                    font-size: 15px;
                    font-family:Roboto;
                    color: #57B8FF;
                    cursor: pointer;
                
                }
                .my-new-class{
                    padding: 10px 10px 8px 10px;
                    height: 36px;
                    cursor:pointer;
                }
                .my-new-class:hover{
                    background-color:#E0F0FA;
                    
                }
                .my-class-item {
                    padding: 10px 10px 8px 10px;
                    height: 36px;
                    cursor:pointer;
                }
                .my-class-item:hover{
                    background-color:#E0F0FA;
                    
                }
                .my-class-item-focus {
                    padding: 10px 10px 8px 10px;
                    height: 36px;
                    cursor:pointer;
                    background-color:#E0F0FA;
                }
                .my-edit-button{
                    padding: 10px 10px 8px 10px;
                    height: 28px;
                    width: 28px;
                    background-color: #E0F0FA;
                    cursor:pointer;
                    border-radius: 4px;
                   
                }
                .my-edit-button:hover{
                  
                    background-color:#979CB533;
                    
                }
                .my-class-menu{
    
                    background: #FAFAFD;
                    box-shadow: 0px 3px 8px #00000029;
                    border: 1px solid #979CB580;
                    border-radius: 6px;
                    padding: 8px 0px;
                    
                
                }
                .my-class-dialog{
                    width:200px;
                    height:320px;
                    background-color: #FAFAFD;
                    box-shadow: 0px 3px 8px #00000029;
                    border: 1px solid #979CB53D;
                    border-radius: 6px;
                }
                .my-class-dialog .react-colorful {
                    height: 180px;
                    width: 180px;
                }
               
                .my-class-dialog .react-colorful__saturation-pointer,
                .my-class-dialog .react-colorful__hue-pointer,
                .my-class-dialog .react-colorful__alpha-pointer {
                    width: 20px;
                    height: 20px;
                    border-radius: 10px;
                }
                .my-divider {
                    /*color: #979CB53D*/
                    color: #979CB580;
                    height:1px;
                    borderWidth:0px;
                    margin-top:15px;
                    margin-bottom:10px;
                    
                }
                .my-delete-button {
                    text-align: left;
                    font-size: 16px;
                    font-family: Roboto;
                    letter-spacing: 0px;
                    color: #E61F23;
                }
                
                             
                `}
            </style>





            <div className="my-input-group" >
                <input type="text" className={(selectedItem.length === 0) ? "my-source-input-empty" : "my-source-input"} aria-label="Text input with dropdown button" placeholder='--- please select ---' value={selectedItem.class_name} style={{ cursor: 'pointer' }} />
                <button className="my-source-input-button" type="button" aria-expanded="false"
                    disabled={props.disabled}
                    onClick={handleClassMenuClick}
                    ref={buttonRef}
                >
                    {
                        expandClassMenu && <FontAwesomeIcon icon={faChevronDown} className="my-chevron-icon" transform="shrink-3" />
                    }
                    {
                        (!expandClassMenu) && <FontAwesomeIcon icon={faChevronUp} className="my-chevron-icon" transform="shrink-3" />
                    }

                </button>

                <Label_Man fill={(selectedItem.length === 0) ? '#16272E3D' : selectedItem.color_hex} className="my-class-icon"></Label_Man>
            </div>

         

            {
                expandClassMenu &&
                <div className='my-class-menu position-relative'>
                    <OutsideClickHandler onOutsideClick={handleClassMenuOutsideClick}>
                        <div >
                            <div className='my-hint-text'>Typing to create class</div>
                            <div className='my-class-item d-flex flex-row justify-content-between align-items-center'>
                                <div className="d-flex flex-row align-items-center">
                                    <div style={{ marginRight: 5 }}>
                                        <Label_Man fill={'#16272E3D'}></Label_Man>
                                    </div>
                                    <div>---</div>
                                </div>
                                <div className='my-create-button'>Create</div>
                            </div>




                            {
                                localClassInfo.map((item, idx) => {
                                    return (
                                        <CustomClassItem key={`class_item_${idx}`} order={idx} onFocus={dialogOrder === idx} item={item} onSelected={handleClassSelected} onHover={(event) => handleClassItemHover(idx)} onOpen={handleDialogOpen}></CustomClassItem>

                                    );
                                })
                            }


                        </div>
                    </OutsideClickHandler>
                </div>
            }


        </div>

    );
});

export default CustomSelectClass;