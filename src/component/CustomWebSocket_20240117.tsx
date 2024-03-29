import { useCallback, useEffect, useState, MouseEvent, useContext,useRef } from "react";
import styled, { CSSProperties } from 'styled-components';
import { useDispatch, useSelector } from "react-redux";
import webSocket, { io } from 'socket.io-client';
import { apiHost, socketHost } from "../constant/API/APIPath";
import { createAlertMessage } from '../redux/store/slice/alertMessage';
import { customAlertMessage } from '../utils/utils';

type WebSocketProps = {
    onSuccess: () => void;
    onExportMessage:(myType:number,myMessage:string,myId:string)=>void;
    onImportMessage:(myType:number,myMessage:string,myId:string)=>void;
};

const CustomWebSocket = (props: WebSocketProps) => {

    const [ws1, setWs1] = useState<any>(null);
    const [ws2, setWs2] = useState<any>(null);

    const dispatch = useDispatch();

    const connectWebSocket = () => {

        if (ws1) ws1.disconnect();
        if (ws2) ws2.disconnect();
        setWs1(webSocket(`${socketHost}/export`, {autoConnect: true,transports: ["websocket", "polling"]}))
        setWs2(webSocket(`${socketHost}/import`, {autoConnect: true,transports: ["websocket", "polling"]}))
       
    }

    const initWebSocket1 = () => {
        //對 getMessage 設定監聽，如果 server 有透過 getMessage 傳送訊息，將會在此被捕捉
        ws1.on('export', (message: any) => {
            console.log('------ export message -----')
            console.log(message)
            const myObj = JSON.parse(message);
            let messageType = 2;
            if (myObj.message.toLowerCase().indexOf('packaging') >= 0) messageType = 2;    
            if (myObj.message.toLowerCase().indexOf('waiting') >= 0) messageType = 2;
            if (myObj.message.toLowerCase().indexOf('verifying') >= 0) messageType = 2;
            if (myObj.message.toLowerCase().indexOf('failure') >= 0) messageType = 1;
            if (myObj.message.toLowerCase().indexOf('success') >= 0) {
                messageType = 0;
                const myFilename = myObj.data.zip_name;
                const myUrl = `${apiHost}/download/${myFilename}`;
                console.log('export success!!!')
                console.log('myUrl', myUrl)

                //props.onSuccess(myFilename, myUrl)

                const link = document.createElement('a');
                link.href = myUrl;
                link.setAttribute(
                    'download',
                    myFilename,
                );
                // Append to html link element page
                document.body.appendChild(link);
                // Start download
                link.click();
                // Clean up and remove the link
                document.body.removeChild(link);
                connectWebSocket();

            };

            //dispatch(createAlertMessage(customAlertMessage(messageType, `${myObj.data.project_name} ${myObj.message}`)));

            props.onExportMessage(messageType,`${myObj.data.project_name} ${myObj.message}`,myObj.data.project_name)

        })

    
    }

    const initWebSocket2 = () => {
        //對 getMessage 設定監聽，如果 server 有透過 getMessage 傳送訊息，將會在此被捕捉
      

        ws2.on('import', (message: any) => {
            console.log(new Date())
            console.log(message)
            const myObj = JSON.parse(message);
            let messageType = 2;
            if (myObj.message.toLowerCase().indexOf('packaging') >= 0) messageType = 2;  
            if (myObj.message.toLowerCase().indexOf('waiting') >= 0) messageType = 2;
            if (myObj.message.toLowerCase().indexOf('verifying') >= 0) messageType = 2;
            if (myObj.message.toLowerCase().indexOf('failure') >= 0) messageType = 2;
            if (myObj.message.toLowerCase().indexOf('success') >= 0) {
                messageType = 0;
               
                console.log('import success!!!')

                props.onSuccess()

                connectWebSocket();

               
            };

            //dispatch(createAlertMessage(customAlertMessage(messageType, `Import Project ${myObj.message}`)));

            props.onImportMessage(messageType,`Import project - ${myObj.message}`, 'ImportProject')

        })
    }

    useEffect(()=>{
        if(ws1){
            //連線成功在 console 中打印訊息
            console.log('export listening success connect!')
            //設定監聽
            initWebSocket1()
        }

        if(ws2){
            //連線成功在 console 中打印訊息
            console.log('import listening success connect!')
            //設定監聽
            initWebSocket2()
        }

    },[ws1,ws2])

    useEffect(() => {

        console.log('websocket start...')
        connectWebSocket();

    }, []);



    return (
        <>
           
        </>
    )
}

export default CustomWebSocket;