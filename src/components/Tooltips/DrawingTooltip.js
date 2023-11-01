import React, { useRef, useState, useEffect } from 'react';
import Tooltip from '@mui/joy/Tooltip';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Chip from '@mui/joy/Chip';

const DrawingTooltip = ({ children, title, keyword }) => {

    return (
      
                <Tooltip
                    title={
                        <Box sx={{ display: 'flex', gap: 1, width: '100%', mt: 0, backgroundColor: 'transparent', height: 28  }}>

                            <Chip sx={{ ml: 0, mt: 0, fontSize: '15px', padding: '0px 0px 4px 0px', height: 20, lineHeight: 20, backgroundColor: 'transparent', color: 'white' }}>
                                {title}
                            </Chip>

                            <Box sx={{ backgroundColor: '#979CB5', width: keyword === 'delete' ? '48px' : '20px', height: '20px', padding: '0px 0px 0px 6px', borderRadius: '4px', mt: 0, fontSize: '13px' }}>{keyword}</Box>
                        </Box>

                    }
                    placement="right"
                    slotProps={{
                        root: {
                            sx: {
                                backgroundColor: '#16272ECC',
                                padding: '8px 8px 0px 8px',
                                borderRadius: 6,
                                ml:-2
                               
                            },
                        },
                    }}
                >
                    {children}
                </Tooltip>
          
        
    );
};

export default DrawingTooltip;