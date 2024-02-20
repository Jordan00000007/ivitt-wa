
import log from "../../utils/console";
import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ReactComponent as IconSuccess } from '../../assets/Feedback_Icon_Success.svg';
import { ReactComponent as IconFail } from '../../assets/Feedback_Icon_Fail.svg';
import { ReactComponent as IconLoading } from '../../assets/Feedback_Icon_Loading.svg';

const CustomToast = forwardRef((props, ref) => {

    const iconArr = [<IconSuccess />, <IconFail />, <IconLoading className='my-rotating-svg' />]

    const dispatch = useDispatch();

    useImperativeHandle(ref, () => ({
        setMessage: (myType, myMessage, myTaskId) => {

            if (!toast.isActive(myTaskId)) {

                //log('new message',myMessage,myTaskId)

                toast(myMessage, {

                    icon: iconArr[myType],
                    toastId: myTaskId,
                    style: {
                        backgroundColor: '#16272E',
                        width: 1200,
                        height: 44,
                        minHeight: 44,
                        color: 'white',

                    }
                });
            } else {

                //log('update message',myMessage,myTaskId)

                toast.update(myTaskId, { render: myMessage, icon: iconArr[myType] })
            }



        },

    }));

    return (

        <ToastContainer
            position="bottom-center"
            autoClose={3000}
            hideProgressBar={true}
            newestOnTop={false}
            rtl={false}
            closeButton={false}
            pauseOnHover={false}
            pauseOnFocusLoss={false}
            bodyClassName={"my-toast-body"}
            style={{
                width: 1200,
                padding: 0,
                margin: 0,
            }}
        />
    );
});


export default CustomToast