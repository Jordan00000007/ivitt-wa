import React, { useRef, useState, useEffect } from 'react';
import Tooltip from '@mui/material/Tooltip';
import log from "../../utils/console";

const CustomTooltip = ({ children, placement, customClassName }) => {
    const [isOverflowed, setIsOverflow] = useState(false);
    const textElementRef = useRef();
    useEffect(() => {

        setIsOverflow(textElementRef.current.scrollWidth > textElementRef.current.clientWidth);
    }, [children]);
    return (
        <Tooltip title={children} disableHoverListener={!isOverflowed} placement={placement ? placement : 'top'} arrow={true} >
            <div
                ref={textElementRef}
                className={customClassName+' '+'text-truncate'}
            >
                {children}
            </div>
        </Tooltip>
    );
};

export default CustomTooltip;