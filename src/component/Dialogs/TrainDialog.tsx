import { FormEventHandler, useCallback, useEffect, useRef, useState } from 'react';
import { SelectChangeEvent } from '@mui/material';
import { useDispatch } from "react-redux";
import { createAlertMessage } from '../../redux/store/slice/alertMessage';
import { setCurrentTab } from '../../redux/store/slice/currentTab';
import { setIteration } from '../../redux/store/slice/currentIteration';
import { setIsTraining } from '../../redux/store/slice/isTraining';
import Dialog, { DialogProps } from './Dialog';
import { customAlertMessage } from '../../utils/utils';
import { Title, ActionContainer, StyledButton, StyledButtonRed } from './commonDialogsStyle';
import InputTextField from '../Input/InputTextField';
import SelectMenu from '../Select/SelectMenu';
import { createTrainingAPI, downloadPreTrainedAPI, getBatchSizeAPI, getDefaultParamAPI, getModelAPI, getTrainMethodListAPI, startTrainingAPI, addTrainingTaskAPI, getTrainingListAPI } from '../../constant/API/trainAPI';
import { GetAllProjectsType, getDatasetListAPI } from '../../constant/API';
import { filter, set } from 'lodash-es';
import { setSocketIdAction } from '../../redux/store/slice/socketId';
import { useGetCurrTrainInfo } from '../../pages/model/hook/useModelData';
import { apiHost } from '../../constant/API/APIPath';
import { io } from 'socket.io-client'
import { closeLoading, openLoading } from '../../redux/store/slice/loading';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useNavigate } from 'react-router-dom';
import { socketHost } from '../../constant/API/APIPath';


type AddDialogProps = DialogProps & {
    tipText: string;
    id: string;
    handleInitData: (data: GetAllProjectsType) => void;
    setAlertTrain: (data: boolean) => void;
};


type ConfigListType = {
    modelList: string[],
    batchSize: number[]
};

const selectListInitial = {
    batchSize: [],
    modelList: []
}

const formInitial = {
    model: '',
    batch_size: 1,
    width: 0,
    height: 0,
    channel: 0,
    step: 0
}

type ErrorItem = {
    trainMethod: boolean;
    inputWidth: boolean;
    inputHeight: boolean;
    inputChannel: boolean;
    step: boolean;
}

const TrainDialog = (props: AddDialogProps) => {
    const { open, id, tipText, setAlertTrain, handleClose, handleInitData, ...restProps } = props;
    const { getCurrTrainingInfo } = useGetCurrTrainInfo();
    const dispatch = useDispatch();
    const [trainMethodList, setTrainMethodList] = useState<string[]>([]);
    const [trainMethod, setTrainMethod] = useState('');
    const [selectList, setSelectList] = useState<ConfigListType>(selectListInitial);
    const [form, setForm] = useState(formInitial);
    const [preTrainWs, setPreTrainWs] = useState<any>(null);
    const errRef = useRef<any | null>(null);
    const [errorItem, setErrorItem] = useState<ErrorItem>({
        trainMethod: false,
        inputWidth: false,
        inputHeight: false,
        inputChannel: false,
        step: false
    });

    const navigator = useNavigate();

    const getDefaultParams = useCallback((currentMethod: string) => {
        getDefaultParamAPI(id, { training_method: currentMethod })
            .then(({ data }) => {
                const param = data.data.training_param;
                setForm({
                    model: param.model,
                    batch_size: param.batch_size,
                    width: param.input_shape[0],
                    height: param.input_shape[1],
                    channel: param.input_shape[2],
                    step: param.step,
                
                });
            })
    }, [id]
    );

    const handleMethodChange = (e: SelectChangeEvent<string>) => {
        e.preventDefault();
        setTrainMethod(e.target.value);
        getDefaultParams(e.target.value);
    };

    const handleOnChange = (e: SelectChangeEvent<string>) => {
        e.preventDefault();
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleCancel = () => {
        handleClose();
        setTrainMethod('');
        setForm(formInitial);
    };

    const hasPreTrainProcessing = useCallback(() => {
        startTrainingAPI(id)
            .then(({ data }) => {
                getCurrTrainingInfo();
            })
            .catch(({ response }) => console.log('getTrainingInfoAPI-Err', response.data.message))
    }, [getCurrTrainingInfo, id]
    );

    const listenPreTrainSocket = useCallback(() => {
        preTrainWs.on('pretrained', (message: any) => {

            console.log('pretrained message--->',message)

            if (message.includes('100%')) {
                dispatch(closeLoading());
                dispatch(setIsTraining('start'));
                hasPreTrainProcessing();
            }
        });
    }, [dispatch, hasPreTrainProcessing, preTrainWs])


    const noPreTrain = useCallback(() => {
        downloadPreTrainedAPI(id)
            .then((res) => {
                dispatch(openLoading());
                if (preTrainWs) {
                    listenPreTrainSocket();
                }
            })
            .catch((err) => {
                dispatch(closeLoading())
            })

    }, [dispatch, id, listenPreTrainSocket, preTrainWs]
    );



    const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
      
        let postData: any;
        if (trainMethod === '') {
            errRef.current = true;
            setErrorItem((curr) => { return { ...curr, trainMethod: true } })
            dispatch(createAlertMessage(customAlertMessage('error', 'Please select a method')));
            return
        }

        dispatch(openLoading());
        const formData = new FormData(e.currentTarget);

        const isZero = Number(formData.get('width')) === 0 || Number(formData.get('height')) === 0 || Number(formData.get('channel')) === 0 || Number(formData.get('step')) === 0;
        const notValid = isNaN(Number(formData.get('width'))) || isNaN(Number(formData.get('height'))) || isNaN(Number(formData.get('channel'))) || isNaN(Number(formData.get('step')));

        const errWidth = Number(formData.get('width')) === 0 || isNaN(Number(formData.get('width')));
        const errHeight = Number(formData.get('height')) === 0 || isNaN(Number(formData.get('height')));
        const errChannel = Number(formData.get('channel')) === 0 || isNaN(Number(formData.get('channel')));
        const errStep = Number(formData.get('step')) === 0 || isNaN(Number(formData.get('step')));

        if (trainMethod === 'Advanced Training') {
            if (notValid || isZero) {
                errRef.current = true;
                setErrorItem({
                    trainMethod: false,
                    inputWidth: errWidth ? true : false,
                    inputHeight: errHeight ? true : false,
                    inputChannel: errChannel ? true : false,
                    step: errStep ? true : false
                })
                dispatch(createAlertMessage(customAlertMessage('error', 'Please fill in all the columns or a valid number')));
                return
            }

            postData = {
                project_uuid: id,
                training_parameter: {
                    training_method: formData.get('trainMethod'),
                    model: formData.get('model'),
                    batch_size: Number(formData.get('batch_size')),
                    step: Number(formData.get('step')),
                    input_shape: [Number(formData.get('width')), Number(formData.get('height')), Number(formData.get('channel'))]
                }
            }
        } else {
            postData = {
                project_uuid: id,
                training_parameter: {
                    training_method: trainMethod,
                    model: form.model,
                    batch_size: form.batch_size,
                    step: form.step,
                    input_shape: [form.width, form.height, form.channel]
                }
            }
        }

        //dispatch(openLoading())

       

        getTrainingListAPI()
        .then(({ data }) => {

            //console.log('getTrainingListAPI-Success', data); 

            if (data.status === 200) {

                 addTrainingTaskAPI(id, postData)
                .then(({ data }) => {
                  
                })
                .catch(({ response }) => {
                    dispatch(createAlertMessage(customAlertMessage('error', response.data.message ? response.data.message : 'Internal server error')))
                })
             
                if (Object.keys(data.data).length !== 0) {
                    //console.log('has tasks'); 
                    navigator('./scheduler?new=true');
                }else{
                    //console.log('no tasks'); 
                    dispatch(setSocketIdAction(id));
                }
            } else {
                console.log('getTrainingListAPI-Error', data.message);
            }
        })
        .catch(({ response }) => {
            console.log('getTrainingListAPI-Error', response.data);
        })

       
    }

    const connectWebSocket = useCallback(() => {
        if (!preTrainWs) {
            setPreTrainWs(io(`${apiHost}/${id}/log`));
        }
    }, [id, setPreTrainWs, preTrainWs])


    useEffect(() => {
        if (id === 'allProjects' || !id) return;
        //connectWebSocket();

        return () => {
            if (preTrainWs) {
                preTrainWs.disconnect();
                //待測試
                preTrainWs.removeAllListeners(['pretrained'])
            }
        }
    }, [connectWebSocket, id, preTrainWs])

    useEffect(() => {
        if (!id) return;

        getTrainMethodListAPI()
            .then(({ data }) => setTrainMethodList(data.data.method_training))
            .catch((err) => console.log('getTrainMethodListAPI-Err', err));

        Promise.all([getModelAPI(id), getBatchSizeAPI(id)])
            .then((res) => {
                if (res) {
                    setSelectList({
                        modelList: res[0].data.data.model,
                        batchSize: res[1].data.data.batch_size,
                    })
                }
            })

          
    }, [id]);

    useEffect(() => {
        if (!errRef.current) return;
        if (trainMethod !== '' || String(form.width) !== '' || String(form.height) !== '' || String(form.channel) !== '' || String(form.step) !== '') {
            setErrorItem({
                trainMethod: trainMethod !== '' ? false : true,
                inputWidth: String(form.width) !== '' ? false : true,
                inputHeight: String(form.height) !== '' ? false : true,
                inputChannel: String(form.channel) !== '' ? false : true,
                step: String(form.step) !== '' ? false : true
            });
        }
    }, [form.channel, form.height, form.step, form.width, trainMethod]);

    useEffect(() => {

        getTrainMethodListAPI()
        .then(({ data }) => {
            setTrainMethodList(data.data.method_training);
            setTrainMethod('Quick Training');
            getDefaultParams('Quick Training');
        
        })
        .catch((err) => console.log('getTrainMethodListAPI-Err', err));

    }, []);

    useEffect(() => {

        const socket = io(`${socketHost}/schedule`);

        socket.on('connect', () => {
            //console.log('Connected to the server');
        });

        socket.on('task_sort', (message) => {


            const myTaskList = JSON.parse(message).task_sort;
            //console.log('myTaskList=====>', myTaskList);
          
           
        })

        socket.on('error_msg', (message) => {


            const error_msg = JSON.parse(message);

            const myTaskId=error_msg.task_uuid;
            const myProjectName=error_msg.project_name;
            const myMessage=error_msg.error_msg;

            dispatch(createAlertMessage(customAlertMessage('error', `${myProjectName} : ${myMessage}`)))

          
        })


        socket.on('training_data_status', (message) => {

            console.log('training_data_status=====>', message)

            const myStatus=JSON.parse(message);

            console.log(myStatus.iteration);

            const myLastIter=`iteration${myStatus.iteration}`;
            dispatch(setIteration(myLastIter));
            dispatch(setIsTraining('start'));
            dispatch(setCurrentTab("Model"));
            dispatch(closeLoading());
            handleCancel();
        })

        // 在組件卸載時斷開連接
        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <Dialog open={open} handleClose={() => { }} {...restProps}>
            <Title>Train</Title>
            <form onSubmit={handleSubmit}>
                <SelectMenu labelName={'Method of Training'} name={'trainMethod'} value={trainMethod} menuItemArray={trainMethodList} handleChange={handleMethodChange} error={errorItem.trainMethod} />
                
                {trainMethod === 'Advanced Training' ?
                    <>
                        <SelectMenu labelName={'Model'} name={'model'} value={form.model} menuItemArray={selectList.modelList} handleChange={handleOnChange} />
                        <SelectMenu labelName={'Batch'} name={'batch_size'} value={String(form.batch_size)} menuItemArray={(selectList.batchSize)} handleChange={handleOnChange} />
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '18px' }}>
                            <InputTextField
                                name={'width'}
                                style={{ width: '151px', marginRight: '8px' }}
                                labelName={'InputShape'}
                                value={form.width}
                                onChange={handleOnChange}
                                placeholder={'width'}
                                labelTooltipText={'Width and height must be a multiple of 32'}
                                labelIcon={<InfoOutlinedIcon sx={{ width: '18px', height: '18px' }} />}
                                error={errorItem.inputWidth}
                            />
                            <InputTextField
                                name={'height'}
                                style={{ marginTop: '22.5px', width: '151px', marginRight: '8px' }}
                                labelName={''}
                                value={form.height}
                                onChange={handleOnChange}
                                placeholder={'height'}
                                error={errorItem.inputHeight}
                            />
                            <InputTextField
                                labelName={''}
                                name={'channel'}
                                style={{ marginTop: '22.5px', width: '151px' }}
                                value={form.channel}
                                onChange={handleOnChange}
                                placeholder={'channel'}
                                error={errorItem.inputChannel}
                            />
                        </div>
                        <InputTextField
                            name={'step'}
                            labelName={'Step'}
                            value={form.step}
                            onChange={handleOnChange}
                            error={errorItem.step}
                        />
                    </>
                    : <></>
                }
                <ActionContainer style={{ marginTop: trainMethod === 'Advanced Training' ? '5%' : '23%' }}>
                    <StyledButton type='button' onClick={handleCancel}>
                        Cancel
                    </StyledButton>
                    <StyledButtonRed onClick={() => { }}>
                        Training
                    </StyledButtonRed>
                </ActionContainer>
            </form>
        </Dialog>
    );
};

export default TrainDialog;

