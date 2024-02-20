import React, { useEffect, useRef, useState } from 'react';
import Dialog, { DialogProps } from '../Dialogs/DialogExport';
import { customAlertMessage } from '../../utils/utils';
import { ActionContainer, StyledButton, StyledButtonRed, Title } from './commonDialogsStyle';
import InputTextField from '../Input/InputTextField';
import { GetAllProjectsType, getAllProjectsAPI, renameProjectAPI, getAutoLabelIterationAPI, exportAPI } from '../../constant/API';
import { createAlertMessage } from '../../redux/store/slice/alertMessage';
import { useDispatch } from 'react-redux';
import { closeLoading, openLoading } from '../../redux/store/slice/loading';
import Checkbox from '@mui/joy/Checkbox';
import Box from '@mui/joy/Box';
import { extendTheme, CssVarsProvider } from '@mui/joy/styles';
import { checkboxClasses } from '@mui/material';
import { findIndex, cloneDeep } from 'lodash-es';
import { StreamOptions } from 'stream';

export type ExportDialogProps = DialogProps & {
    open: boolean;
    projectId: string;
    currentProjectName: string;
    handleInitData: (data: GetAllProjectsType) => void
};

const CommonExportDialog = (props: ExportDialogProps) => {
    const { open, projectId, currentProjectName, handleInitData, handleClose, ...restProps } = props;
    const dispatch = useDispatch();
    const [name, setName] = useState('');
    const [errorItem, setErrorItem] = useState<boolean>(false);
    const errRef = useRef<any | null>(null);
    const [iterationData, setIterationData] = useState<any>([]);

    const theme1 = extendTheme({
        components: {
            JoyCheckbox: {
                styleOverrides: {
                    checkbox: {
                        color: 'white',
                        [`&.${checkboxClasses.checked}`]: {
                            backgroundColor: '#16272ED9',
                        },
                        [`&.${checkboxClasses.indeterminate}`]: {
                            backgroundColor: '#16272ED9',
                        },
                    },
                    label: {
                        color: '#16272E',
                        fontSize: 20,
                        fontFamily: 'roboto',
                        fontWeight: 500,
                    }
                },
            },
        },
    });

    const theme2 = extendTheme({
        components: {
            JoyCheckbox: {
                styleOverrides: {
                    checkbox: {
                        color: 'white',
                        [`&.${checkboxClasses.checked}`]: {
                            backgroundColor: '#16272ED9',
                        },
                        [`&.${checkboxClasses.indeterminate}`]: {
                            backgroundColor: '#16272ED9',
                        },
                    },
                    label: {
                        color: '#16272E',
                        fontSize: 16,
                        fontFamily: 'roboto',
                    }
                },
            },
        },
    });

    const handleCancel = () => {
        handleClose();
        setName('');
        errRef.current = false;
        setErrorItem(false)
    };

    const handleSave = () => {

        console.log('export ...')

        const myData = cloneDeep(iterationData);
        const selectedIterArr: string[] = [];
        myData.forEach((item: [string, String, Boolean]) => {
            if (item[2]) {
                selectedIterArr.push(item[0]);
            }
        });

        const myPayload: any = {};
        myPayload.uuid = projectId;
        myPayload.change_workspace = selectedIterArr[selectedIterArr.length - 1];
        myPayload.iteration = selectedIterArr;

        console.log('export myPayload --->')
        console.log(myPayload)



        handleClose();

        // if (name === '') {
        //     errRef.current = true;
        //     setErrorItem(true);
        //     dispatch(createAlertMessage(customAlertMessage('error', 'Project name can not be empty')));
        //     return;
        // }

        // dispatch(openLoading())
        exportAPI(myPayload)
            .then(({data}) => {

                console.log('export result')
                console.log(data)
                
            })
            .catch(({ response }) => {
                dispatch(createAlertMessage(customAlertMessage('error', response.data.message ? response.data.message : 'Internal server error')));

            })
            .finally(() => {
                dispatch(closeLoading());
            })




    };


    useEffect(() => {
        if (!errRef.current) return;
        if (name !== '') {
            setErrorItem(false);
        }
    }, [name]);

    useEffect(() => {

        if (projectId !== '') {

            getAutoLabelIterationAPI(projectId)
                .then(({ data }) => {

                    try {

                        console.log('getAutoLabelIterationAPI-res');
                        let IterationArr: [number, string, boolean][] = [];
                        //console.log(data.data.folder_name)
                        data.data.folder_name.forEach((item, idx) => {

                            if (typeof item === "string") {
                                
                                const data_key:string=item;
                                const data_index=parseInt(data_key.replace("iteration",""));
                                IterationArr.push([data_index, item, false])
                            } else {
                                //console.log('object detection project');
                                const data_keyArr = Object.keys(item);
                                if (data_keyArr.length > 0) {
                                    const data_key = data_keyArr[0];
                                    const data_index=parseInt(data_key.replace("iteration",""));
                                    const data_mAP = item[data_key].mAP;
                                    const data_class = item[data_key].class;
                                    IterationArr.push([data_index, `${data_key} ( mAP = ${data_mAP}, class = ${data_class} )`, false])

                                }
                            }


                        })
                        setIterationData(IterationArr);

                    } catch (error) {
                        console.log(error)
                    }


                })
                .catch(({ response }) => {
                    console.log('getAutoLabelIterationAPI-Error', response);

                })
        }

    }, [projectId]);


    const [checked, setChecked] = React.useState([true, false]);

    const handleChange1 = (event: any) => {
        setChecked([event.target.checked, event.target.checked]);
    };

    const handleChange2 = (event: any) => {
        setChecked([event.target.checked, checked[1]]);
    };

    const handleChange3 = (event: any) => {
        setChecked([checked[0], event.target.checked]);
    };

    const handleIterationItemChange = (event: any) => {
        //setChecked([checked[0], event.target.checked]);
        
        const myData = cloneDeep(iterationData);
        const myIndex = findIndex(myData, (item: [number, String, Boolean]) => {
            return item[0] === parseInt(event.target.value.replace("iteration",""));
        });
       
        if (myIndex >= 0) {
            myData[myIndex][2] = event.target.checked;
            setIterationData(myData);
        }

    };

    const handleIterationAllChange = (event: any) => {
        const myData = cloneDeep(iterationData);
        myData.forEach((item: [string, String, Boolean]) => {
            item[2] = event.target.checked;
        });
        setIterationData(myData);

    };

    const getAllCheckChecked = () => {
        let myAns = true;
        const myData = cloneDeep(iterationData);
        myData.forEach((item: [string, String, Boolean]) => {
            if (!item[2]) myAns = false;
        });
        if (myData.length===0){
            return false;
        }else{
            return myAns;
        }
        
    };

    const getAllCheckIndeterminate = () => {
        let myCounter = 0;
        const myData = cloneDeep(iterationData);
        myData.forEach((item: [string, String, Boolean]) => {
            if (item[2]) myCounter++;
        });
        if ((myCounter > 0) && (myCounter < myData.length)) {
            return true;
        }
        else {
            return false;
        }
    }

    const getCheckedCount = () => {
        let myCounter = 0;
        const myData = cloneDeep(iterationData);
        myData.forEach((item: [string, String, Boolean]) => {
            if (item[2]) myCounter++;
        });
        return myCounter;
    }






    const children = (
        // <Box sx={{ display: 'flex', flexDirection: 'column', ml: 0, gap: 0, mt: 0 ,height:278}}>
        <div style={{ height: 272, overflowY: 'auto', overflowX: 'hidden', padding: '0px 0px 0px 0px' }} className='my-iteration-panel'>
            {
                iterationData.map((item: [string, string, boolean], idx: number) => (
                    <div key={`iteration_${idx}`} style={{ height: 44, width: 402, background: '#FAFAFD', padding: '0px 13px', borderBottom: '1px solid #979CB580' }} className='d-flex align-items-center'>
                        <Checkbox checked={item[2]} onChange={handleIterationItemChange} label={item[1]} value={item[0]} />
                    </div>
                ))
            }
        </div>
    );

    return (
        <Dialog open={open} handleClose={handleCancel} {...restProps}>
            <Title>{currentProjectName} </Title>
            <div className='container'>
                <div className='row'>
                    <div className='col-12 p-0' >

                        <div style={{ width: 420, height: 337, backgroundColor: '#FAFAFD', border: '1px solid #979CB580' }}>
                            <div style={{ height: 55, borderBottom: '1px solid #979CB580', padding: '2px 16px 0px 19px' }} className='d-flex align-items-center justify-content-between'>
                                <CssVarsProvider theme={theme1}>
                                    <Checkbox
                                        label="All Iterations"
                                        checked={getAllCheckChecked()}
                                        indeterminate={getAllCheckIndeterminate()}
                                        onChange={handleIterationAllChange}
                                    />
                                </CssVarsProvider>
                                <div style={{ color: '#16272E99', fontSize: 15, padding: '2px 0px 0px 0px' }}>
                                    {getCheckedCount()}/{iterationData.length} selected
                                </div>
                            </div>
                            <div style={{ height: 282, padding: '0px 4px 0px 6px', overflowY: 'hidden', overflowX: 'hidden' }}>
                                <CssVarsProvider theme={theme2}>
                                    {children}
                                </CssVarsProvider>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
            <ActionContainer>
                <StyledButton onClick={handleCancel}>
                    {'Cancel'}
                </StyledButton>
                <StyledButtonRed onClick={handleSave} disabled={(getCheckedCount() > 0) ? false : true}>
                    {'Export'}
                </StyledButtonRed>
            </ActionContainer>
        </Dialog>
    );
};

export default CommonExportDialog;
