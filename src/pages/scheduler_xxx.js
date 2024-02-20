import React, { useState, useEffect, useImperativeHandle, forwardRef,  useRef, useMemo } from 'react';

import log from "../utils/console";
//import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/js/dist/tab.js';
import '../css/App.css';
import { useDispatch, useSelector } from 'react-redux';
import Stack from '@mui/joy/Stack';
import LinearProgress from '@mui/joy/LinearProgress';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { apiHost } from '../constant/API/APIPath';
import { EmptyWrapper, SchedulerHeadContainer, SchedulerHeadWrapper, SchedulerBodyContainer, SchedulerBodyWrapper } from "./pageStyle";
import StatusButton from '../components/Buttons/StatusButton';
import CustomButton from '../components/Buttons/CustomButton';
import CustomChart from '../components/Charts/CustomChart';
import { ReactComponent as Icon_Reorder } from '../assets/Icon_Reorder.svg';
import Cursor_Hand_Open from '../assets/Cursor_Hand_Open.png';
import Cursor_Hand_Hold from '../assets/Cursor_Hand_Hold.png';
import { Grayscale } from 'konva/lib/filters/Grayscale';


const Scheduler = forwardRef((props, ref) => {


    const [imgDataList, setImgDataList] = useState([]);
    const [imgBoxList, setImgBoxList] = useState([]);
    const [dataSetList, setDataSetList] = useState([]);


    const dispatch = useDispatch();

    useImperativeHandle(ref, () => ({

    }));


    const [items, setItems] = useState(['B', 'C', 'D', 'Apple', 'Orange', 'G', 'H','I', 'J', 'K', 'L', 'M', 'N', 'O']);

    const currentTableColumnWidth=[120,120,300,300,300,100];
    const historyTableColumnWidth=[];

    //const [items, setItems] = useState(['B', 'C', 'D', 'E']);

    const getItemStyle = (isDragging, draggableStyle) => ({
        //...draggableStyle,
        // cursor: isDragging ?  `url(${Cursor_Hand_Open});` :  `url(${Cursor_Hand_Hold});`,
        cursor: 'url(Cursor_Hand_Hold)' ,
        width:100,
        backgroundColor:'#ff0000'
    });


    useEffect(() => {



    }, []);

    return (
        <>
            <SchedulerHeadContainer noOverFlow={false}>
                <SchedulerHeadWrapper>
                    <div className="my-scheduler-title">Scheduler</div>

                    <div style={{ position: 'relative', height: 86 }}>
                        <div style={{ position: 'absolute', top: 5 }}>

                            <ul className="nav nav-tabs flex-nowrap" id="myTab" role="tablist">
                                <li className="nav-item" role="presentation">
                                    <button className="my-nav-link roboto-h4 active" id="current-tab" data-bs-toggle="tab" data-bs-target="#current" type="button" role="tab" aria-controls="info" aria-selected="true">Current</button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button className="my-nav-link roboto-h4" id="history-tab" data-bs-toggle="tab" data-bs-target="#history" type="button" role="tab" aria-controls="log" aria-selected="false">History</button>
                                </li>
                            </ul>

                        </div>
                    </div>

                </SchedulerHeadWrapper>
            </SchedulerHeadContainer>

            <SchedulerBodyContainer noOverFlow={true} >
                <SchedulerBodyWrapper>

                    <div className="tab-content" id="myTabContent">
                        <div className="tab-pane fade show active" id="current" role="tabpanel" aria-labelledby="current-tab">
                            <div className='my-tab-container d-flex flex-row justify-content-between'>

                                <div className='my-training-panel d-flex flex-column' style={{backgroundColor:'white'}}>
                                    <div className='my-training-panel-section-1'>
                                        <div className='d-flex flex-column' style={{padding:24}}>
                                            <div  className='d-flex flex-row justify-content-between' style={{fontWeight:500,fontSize:22}}>
                                                <div>Poject A</div>
                                                <div>40%</div>
                                            </div>
                                            <div  className='d-flex flex-row justify-content-between' style={{paddingTop:15,paddingBottom:15}}>
                                                    <Stack spacing={12} sx={{ flex: 1 }}>
                                                        <LinearProgress determinate value={40} size="lg"/>
                                                    </Stack>        
                                            </div>
                                            <div  className='d-flex flex-row justify-content-between'  style={{fontWeight:400,fontSize:13,color:'#000000D9',fontFamily:'Roboto'}}>
                                                <div>Started at 08:21 AM</div>
                                                <div>2hr 25min. left</div>
                                            </div>
                                            <div  className='d-flex flex-row justify-content-between' style={{paddingTop:15,paddingBottom:0}}>
                                                <div><CustomButton name="stop" width={116} height={32}/></div>
                                                <div><CustomButton name="view" width={116} height={32}/></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='my-training-panel-section-2'>
                                        <CustomChart />
                                       
                                    </div>
                                    <div className='my-training-panel-section-3'>
                                        <div className='d-flex flex-column' style={{padding:'24px 20px'}}>
                                            <div  className='d-flex flex-row justify-content-between' style={{fontWeight:500,fontSize:22,paddingBottom:5}}>
                                                <div>Information</div>
                                            </div>
                                            
                                            <div  className='d-flex flex-row justify-content-start'  style={{fontFamily:'Roboto',borderBottom:'1px solid #0000001F',paddingLeft:8}}>
                                                <div className='d-flex align-items-center' style={{fontSize:14,color:'#979CB5',width:120,height:34,paddingTop:3}}>Model type</div>
                                                <div className='d-flex align-items-center' style={{fontSize:14,color:'#16272E',paddingTop:3}}>Object detection</div>
                                            </div>
                                            <div  className='d-flex flex-row justify-content-start'  style={{fontFamily:'Roboto',borderBottom:'1px solid #0000001F',paddingLeft:8}}>
                                                <div className='d-flex align-items-center' style={{fontSize:14,color:'#979CB5',width:120,height:34,paddingTop:3}}>Platform</div>
                                                <div className='d-flex align-items-center' style={{fontSize:14,color:'#16272E',paddingTop:3}}>Intel</div>
                                            </div>
                                            <div  className='d-flex flex-row justify-content-start'  style={{fontFamily:'Roboto',borderBottom:'1px solid #0000001F',paddingLeft:8}}>
                                                <div className='d-flex align-items-center' style={{fontSize:14,color:'#979CB5',width:120,height:34,paddingTop:3}}>Dataset count</div>
                                                <div className='d-flex align-items-center' style={{fontSize:14,color:'#16272E',paddingTop:3}}>36</div>
                                            </div>
                                            <div  className='d-flex flex-row justify-content-start'  style={{fontFamily:'Roboto',borderBottom:'1px solid #0000001F',paddingLeft:8}}>
                                                <div className='d-flex align-items-center' style={{fontSize:14,color:'#979CB5',width:120,height:34,paddingTop:3}}>Training method</div>
                                                <div className='d-flex align-items-center' style={{fontSize:14,color:'#16272E',paddingTop:3}}>Quick train</div>
                                            </div>
                                       
                                        </div>
                                    </div>

                                </div>



                                <div className='my-table' style={{ width: 880, height: 662 }}>
                                    <div className='my-thead'>
                                        <div className='my-thead-th' style={{ width: currentTableColumnWidth[0] }}></div>
                                        <div className='my-thead-th' style={{ width: currentTableColumnWidth[1] }}>Order</div>
                                        <div className='my-thead-th' style={{ width: currentTableColumnWidth[2] }}>Project name</div>
                                        <div className='my-thead-th' style={{ width: currentTableColumnWidth[3] }}>Status</div>
                                        <div className='my-thead-th' style={{ width: currentTableColumnWidth[4] }}>Step</div>
                                        <div className='my-thead-th' style={{ width: currentTableColumnWidth[5] }}></div>
                                    </div>
                                    <div className='my-tbody'>


                                        <div className='my-tbody-row'>
                                            <div className='my-tbody-td' style={{ width: currentTableColumnWidth[0] }}></div>
                                            <div className='my-tbody-td' style={{ width: currentTableColumnWidth[1] }}>1</div>
                                            <div className='my-tbody-td' style={{ width: currentTableColumnWidth[2] }}>Project A</div>
                                            <div className='my-tbody-td' style={{ width: currentTableColumnWidth[3] }}><StatusButton name="training" /></div>
                                            <div className='my-tbody-td' style={{ width: currentTableColumnWidth[4] }}>256/2000</div>
                                            <div className='my-tbody-td' style={{ width: currentTableColumnWidth[5] }}>...</div>
                                        </div>


                                        <DragDropContext
                                            onBeforeCapture={(e) => console.log('onBeforeCapture: ', e)}
                                            onBeforeDragStart={(e) => console.log('onBeforeDragStart: ', e)}
                                            onDragStart={(e) => console.log('onDragStart: ', e)}
                                            onDragUpdate={(e) => console.log('onDragUpdate: ', e)}
                                            onDragEnd={result => {
                                                console.log(result);
                                                const { source, destination, draggableId } = result;
                                                if (!destination) {
                                                    return;
                                                }

                                                let arr = Array.from(items);
                                                console.log(arr);
                                                const [remove] = arr.splice(source.index, 1);
                                                arr.splice(destination.index, 0, remove);
                                                setItems(arr);
                                                log('arr', arr)
                                            }}
                                        >

                                            <Droppable droppableId="drop-id">
                                                {(provided,snapshot) => (
                                                    <div ref={provided.innerRef} {...provided.droppableProps}>
                                                        {items.map((item, i) => (
                                                            <div key={item} >
                                                                <Draggable draggableId={item} index={i}>
                                                                    {(provided,snapshot) => (
                                                                        <div
                                                                            {...provided.draggableProps}
                                                                            ref={provided.innerRef}

                                                                        >
                                                                            <div className='my-tbody-row' style={{ backgroundColor: (i % 2 === 1) ? '#FFFFFF' : '#F8F8F8' }}>

                                                                                <div className='my-tbody-td d-flex justify-content-center' style={{ width: currentTableColumnWidth[0] }}  {...provided.dragHandleProps}> 

                                                                                
                                                                                    <Icon_Reorder fill={'#16272E2E'} />
                                                                                </div>
                                                                                <div className='my-tbody-td' style={{ width: currentTableColumnWidth[1] }}>{i + 2}</div>
                                                                                <div className='my-tbody-td' style={{ width: currentTableColumnWidth[2] }}>Project {item}</div>
                                                                                <div className='my-tbody-td' style={{ width: currentTableColumnWidth[3] }}><StatusButton name="waiting" /></div>
                                                                                <div className='my-tbody-td' style={{ width: currentTableColumnWidth[4], fontWeight: 300 }}>0/2000</div>
                                                                                <div className='my-tbody-td' style={{ width: currentTableColumnWidth[5] }}>...</div>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </Draggable>
                                                            </div>
                                                        ))}
                                                        {provided.placeholder}
                                                    </div>
                                                )}
                                            </Droppable>

                                        </DragDropContext>










                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="tab-pane fade" id="history" role="tabpanel" aria-labelledby="history-tab" style={{ backgroundColor: 'red' }}>
                            <div className='my-tab-container'>

                                <div className='my-table'>
                                    <div className='my-thead'>
                                        <div className='my-thead-th'>Poject name</div>
                                        <div className='my-thead-th'>Iteration</div>
                                        <div className='my-thead-th'>Status</div>
                                        <div className='my-thead-th'>Duration</div>
                                        <div className='my-thead-th'>End time</div>
                                    </div>
                                    <div className='my-tbody'>
                                        <div className='my-tbody-row'>
                                            <div className='my-tbody-td'>Poject A</div>
                                            <div className='my-tbody-td'>12</div>
                                            <div className='my-tbody-td'><StatusButton name="finish" /></div>
                                            <div className='my-tbody-td'>2 hr 54 min</div>
                                            <div className='my-tbody-td'>2023/11/16 09:36</div>
                                        </div>
                                        <div className='my-tbody-row'>
                                            <div className='my-tbody-td'>Poject B</div>
                                            <div className='my-tbody-td'>---</div>
                                            <div className='my-tbody-td'><StatusButton name="stop" /></div>
                                            <div className='my-tbody-td'>2 hr 54 min</div>
                                            <div className='my-tbody-td'>2023/11/16 09:36</div>
                                        </div>
                                        <div className='my-tbody-row'>
                                            <div className='my-tbody-td'>Poject C</div>
                                            <div className='my-tbody-td'>---</div>
                                            <div className='my-tbody-td'><StatusButton name="fail" /></div>
                                            <div className='my-tbody-td'>2 hr 54 min</div>
                                            <div className='my-tbody-td'>2023/11/16 09:36</div>
                                        </div>

                                        <div className='my-tbody-row'>
                                            <div className='my-tbody-td'>Poject D</div>
                                            <div className='my-tbody-td'>2</div>
                                            <div className='my-tbody-td'><StatusButton name="finish" /></div>
                                            <div className='my-tbody-td'>2 hr 54 min</div>
                                            <div className='my-tbody-td'>2023/11/16 09:36</div>
                                        </div>
                                        <div className='my-tbody-row'>
                                            <div className='my-tbody-td'>Poject A</div>
                                            <div className='my-tbody-td'>8</div>
                                            <div className='my-tbody-td'><StatusButton name="finish" /></div>
                                            <div className='my-tbody-td'>2 hr 54 min</div>
                                            <div className='my-tbody-td'>2023/11/16 09:36</div>
                                        </div>
                                        <div className='my-tbody-row'>
                                            <div className='my-tbody-td'>Poject A</div>
                                            <div className='my-tbody-td'>2</div>
                                            <div className='my-tbody-td'><StatusButton name="finish" /></div>
                                            <div className='my-tbody-td'>2 hr 54 min</div>
                                            <div className='my-tbody-td'>2023/11/16 09:36</div>
                                        </div>
                                        <div className='my-tbody-row'>
                                            <div className='my-tbody-td'>Poject A</div>
                                            <div className='my-tbody-td'>8</div>
                                            <div className='my-tbody-td'><StatusButton name="finish" /></div>
                                            <div className='my-tbody-td'>2 hr 54 min</div>
                                            <div className='my-tbody-td'>2023/11/16 09:36</div>
                                        </div>
                                        <div className='my-tbody-row'>
                                            <div className='my-tbody-td'>Poject A</div>
                                            <div className='my-tbody-td'>2</div>
                                            <div className='my-tbody-td'><StatusButton name="finish" /></div>
                                            <div className='my-tbody-td'>2 hr 54 min</div>
                                            <div className='my-tbody-td'>2023/11/16 09:36</div>
                                        </div> 
                                        <div className='my-tbody-row'>
                                            <div className='my-tbody-td'>Poject A</div>
                                            <div className='my-tbody-td'>8</div>
                                            <div className='my-tbody-td'><StatusButton name="finish" /></div>
                                            <div className='my-tbody-td'>2 hr 54 min</div>
                                            <div className='my-tbody-td'>2023/11/16 09:36</div>
                                        </div>
                                        <div className='my-tbody-row'>
                                            <div className='my-tbody-td'>Poject A</div>
                                            <div className='my-tbody-td'>2</div>
                                            <div className='my-tbody-td'><StatusButton name="finish" /></div>
                                            <div className='my-tbody-td'>2 hr 54 min</div>
                                            <div className='my-tbody-td'>2023/11/16 09:36</div>
                                        </div>
                                        <div className='my-tbody-row'>
                                            <div className='my-tbody-td'>Poject A</div>
                                            <div className='my-tbody-td'>8</div>
                                            <div className='my-tbody-td'><StatusButton name="finish" /></div>
                                            <div className='my-tbody-td'>2 hr 54 min</div>
                                            <div className='my-tbody-td'>2023/11/16 09:36</div>
                                        </div>
                                        <div className='my-tbody-row'>
                                            <div className='my-tbody-td'>Poject A</div>
                                            <div className='my-tbody-td'>2</div>
                                            <div className='my-tbody-td'><StatusButton name="finish" /></div>
                                            <div className='my-tbody-td'>2 hr 54 min</div>
                                            <div className='my-tbody-td'>2023/11/16 09:36</div>
                                        </div> 

                                    </div>
                                </div>







                            </div>
                        </div>
                    </div>


                </SchedulerBodyWrapper>
            </SchedulerBodyContainer>




        </>

    );
});

export default Scheduler;
