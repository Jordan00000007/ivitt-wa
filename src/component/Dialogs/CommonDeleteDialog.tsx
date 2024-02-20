import { useEffect,useState } from 'react';
import Dialog, { DialogProps } from '../Dialogs/Dialog';
import { safeRunFunction } from '../../utils/utils';
import { Title, ActionContainer, StyledButton, StyledButtonRed, TipText } from './commonDialogsStyle';
import { deleteIterationAPI, deleteProjectAPI } from '../../constant/API';
import { ReactComponent as Icon_Danger } from '../../assets/Icon_Danger.svg';
import { getTrainingListAPI,delTrainingListAPI, stopTaskAPI } from '../../constant/API';
import { filter,cloneDeep } from 'lodash-es';



type APITypes = 'project' | 'iteration';

type Attribute = {
    id: string;
    name: string;
};

const APISwitch = (type: APITypes, attribute: Attribute) => {
    switch (type) {
        case 'project':
            return deleteProjectAPI(attribute.id);
        case 'iteration':
            return deleteIterationAPI(attribute.id, {
                data: {
                    iteration: attribute.name
                }
            });
        default:
            break;
    }
};

type DeleteDialogProps = DialogProps & {
    APIAttribute: Attribute;
    type: APITypes;
    handleDeleteSuccess?: () => void;
    handleDeleteFail: (err: any) => void;
    handleDeleteStart?: () => void;
    handleDeleteFinally?: () => void;
};

const CommonDeleteDialog = (props: DeleteDialogProps) => {
    const { open, APIAttribute, type, handleClose, handleDeleteSuccess, handleDeleteFail,
        handleDeleteStart, handleDeleteFinally, ...restProps } = props;

    const [showAlert, setShowAlert] = useState(false);
    const [taskList, setTaskList] = useState<any>([]);

    const checkTrainingSchedule = () => {
       
        const projectId=APIAttribute.id;

        getTrainingListAPI()
        .then(({ data }) => {

            if (data.status === 200) {
               
                if (Object.keys(data.data).length > 0){

                    const scheduleArr:any=[];
                    if (Object.keys(data.data).length !== 0) {
                        const myScheduleArr = data.data.task_list;
                        Object.entries(myScheduleArr).forEach(([idx, obj])=>{
                            
                            Object.entries(obj).forEach(([key, value])=>{                
                               
                                const myItem:any={
                                    idx:idx,
                                    taskId:key,
                                    ...value,
                                    
                                }
                                scheduleArr.push(myItem);    
                             
                            });
                        });
                    } 
                    

                    const filterArr=filter(scheduleArr, function (o) { return o.project_uuid === projectId });
                    if (filterArr) setTaskList(filterArr);

                    //console.log('filterArr',filterArr)
                    //console.log('filterArr',filterArr)

                    if (filterArr.length>0){
                        setShowAlert(true);
                    }else{
                        setShowAlert(false);
                    }
                }

            } else {
                console.log('getTrainingListAPI-Error', data.message);

            }

          

        })
        .catch(({ response }) => {
            console.log('getTrainingListAPI-Error', response.data);
        })

    }

    const checkTrainingSchedule_xxx = () => {
        console.log('check traing schedule...');
        console.log(APIAttribute)
        const projectId=APIAttribute.id;

        getTrainingListAPI()
        .then(({ data }) => {

            if (data.status === 200) {
                console.log('data.data.task_list', data.data.task_list);
                const scheduleArr:any=[];
                if (Object.keys(data.data).length !== 0) {
                    const myScheduleArr = data.data.task_list;
                    Object.entries(myScheduleArr).forEach(([key, value])=>{
                        Object.entries(value).forEach(([key, value])=>{                
                            const myItem={
                                ...value,
                                taskId:key,
                            }
                            scheduleArr.push(myItem)
                        });
                    });
                } 
                //console.log('scheduleArr', scheduleArr);
                //console.log(filter(scheduleArr, function (o) { return o.project_uuid === projectId }))
                const filterArr=filter(scheduleArr, function (o) { return o.project_uuid === projectId });
                if (filterArr.length>0){
                    setShowAlert(true);
                    return true;
                }else{
                    setShowAlert(false);
                    return false;
                }

            } else {
                console.log('getTrainingListAPI-Error', data.message);
                return false;
            }

          

        })
        .catch(({ response }) => {
            console.log('getTrainingListAPI-Error', response.data);
        })

    }


    const handleCancel = () => {
        handleClose();
    };

    const closeProject=()=>{
        const apiCaller = APISwitch(type, APIAttribute);
        safeRunFunction(handleDeleteStart);
        if (apiCaller) {
            apiCaller
                .then(() => {
                    safeRunFunction(handleDeleteSuccess);
                })
                .catch((err) => {
                    safeRunFunction(handleDeleteFail(err));
                })
                .finally(() => {
                    safeRunFunction(handleDeleteFinally);
                });
        } else {
            safeRunFunction(handleDeleteFail);
            safeRunFunction(handleDeleteFinally);
        }

        handleCancel();
    }

    const handleDelete = () => {

        if (type==='project'){

            const myPromise:any=[];

            taskList.forEach((ele:any) => {
                console.log("---")
                console.log(ele)
                if (ele.idx!=="0"){
                    // delete task

                    myPromise.push(delTrainingListAPI({data: {task_uuid: ele.taskId }}));
                    // delTrainingListAPI({ data: { task_uuid: ele.taskId } })
                    // .then(({ data }) => {
    
                    //     if (data.status === 200) {
                    //         console.log('delTrainingListAPI-Success', data);
                           
                    //     } else {
                    //         console.log('delTrainingListAPI-Error', data);
                    //     }

                       
                    //     //myTaskList = filter(myTaskList, function (o) { return o === `iteration${myIteration}` })
    
                    // })
                    // .catch(({ response }) => {
    
                    //     console.log('delTrainingListAPI-Error', response);
                       
                    // })

                }else{

                    myPromise.push(stopTaskAPI({ task_uuid: ele.taskId }));
                    // stop task
                    // stopTaskAPI({ task_uuid: ele.taskId })
                    // .then(({ data }) => {
    
                    //     if (data.status === 200) {
                    //         console.log('stopTaskAPI-Success', data);
                           
                    //     } else {
                    //         console.log('stopTaskAPI-Error', data);
                    //     }
    
                    // })
                    // .catch(({ response }) => {
    
                    //     console.log('stopTaskAPI-Error', response);
                       
                    // })
                   

                }
            });

            Promise.allSettled(myPromise)
            .then((results) => {
                closeProject();
            });
        }else{
            closeProject();
        }


       
    };

    useEffect(() => {

        checkTrainingSchedule();

    }, [APIAttribute.id]);


 
    return (
        <Dialog open={open} handleClose={handleClose} {...restProps}>
            <Title>{'Are you sure ?'} </Title>
            <TipText>The {APIAttribute.name} will be deleted.</TipText>
            {
                (showAlert)?
                <div className='my-delete-warning d-flex flex-row align-items-center gap-1'>
                    <Icon_Danger></Icon_Danger>
                    <div style={{ paddingTop: 3 }}>This project is in training schedule.</div>
                </div>
                :
                <></>
            }
           
            <ActionContainer>
                <StyledButton onClick={handleCancel}>
                    {'Cancel'}
                </StyledButton>
                <StyledButtonRed onClick={handleDelete}>
                    {'Delete'}
                </StyledButtonRed>
            </ActionContainer>
        </Dialog>
    );
};

export default CommonDeleteDialog;
