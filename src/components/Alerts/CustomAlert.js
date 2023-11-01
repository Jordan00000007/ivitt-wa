import InfoIcon from '@mui/icons-material/Info';
import log from "../../utils/console";
import WarningIcon from '@mui/icons-material/Warning';
import ReportIcon from '@mui/icons-material/Report';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import React, { useState, useEffect,useImperativeHandle,forwardRef  } from 'react';
import Box from '@mui/joy/Box';
import Alert from '@mui/joy/Alert';


import { ReactComponent as IconSuccess } from '../../assets/Feedback_Icon_Success.svg';
import { ReactComponent as IconFail } from '../../assets/Feedback_Icon_Fail.svg';
import { ReactComponent as IconLoading } from '../../assets/Feedback_Icon_Loading.svg';



const CustomAlert = forwardRef((props, ref) => {

    const [show, setShow] = useState(false);
    const [interval, setInterval] = useState(3000);
    const containerRef = React.useRef(null);
    const iconArr = [<IconSuccess />, <IconFail />, <IconLoading />]


    useImperativeHandle(ref, () => ({
        setShowTrue: (myInterval) => {
            setShow(true);
            if (myInterval===undefined) myInterval=interval;
            setTimeout(() => {
                setShow(false);
               
            }, myInterval); 
        },
        setShowKeep: () => {
            setShow(true);
        },
        setShowClose: () => {
            setShow(false);
        }
    }));

    return (
        
        <Box sx={{ display: 'flex', gap: 0, flexDirection: 'column', zIndex: 5}} className='my-alert-message' ref={containerRef} style={{ display: show ? 'block' : 'none',paddingTop:'0px' }}>         
                <Alert
                    sx={{ alignItems: 'flex-between',  width: '1200px', backgroundColor: '#16272E', color: '#F8F8F8' }}
                    startDecorator={React.cloneElement(iconArr[props.type], {
                        style: { position: 'relative', top: 0,left:5},
                        className:(props.type===2)?'rotating-svg':''
                    })}
                    variant="soft"
                    
                >
                    <div className='roboto-b1 mt-1' >
                        {props.message}
                    </div>
                </Alert>
        </Box>
    );
});


export default CustomAlert