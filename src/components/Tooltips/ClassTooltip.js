import React, { useRef, useState, useEffect } from 'react';
import Tooltip from '@mui/joy/Tooltip';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Chip from '@mui/joy/Chip';
import { extendTheme, CssVarsProvider } from '@mui/joy/styles';

const ClassTooltip = ({ children, title, keyword }) => {

    const theme1 = extendTheme({
        components: {
            JoyTooltip: {
                styleOverrides: {
                    root: ({ ownerState, theme }) => ({
                        borderColor: 'red',
                        backgroundColor: '#FFD8D9',
                        solidBg: 'green',
                    }),
                },
            },

        },
    });

    return (
        <CssVarsProvider theme={theme1}>
            <Tooltip
                
                title={
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            maxWidth: 210,
                            justifyContent: 'center',
                            p: 1,
                        }}
                    >
                        <Typography
                            fontSize="18px"
                            fontFamily="roboto"
                            fontWeight="500"
                            textColor="#16272E"

                        >
                            Create class
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, width: '100%', mt: 1 }}>

                            <div>
                                <Typography fontSize="13px" fontFamily="roboto" >
                                This is a textarea to teach user how to create the first class. Hope this can be simple and clear.
                                </Typography>
                            
                            </div>
                        </Box>
                    </Box>
                }


                arrow
                open
                placement="bottom"
                slotProps={{
                    root: {
                        sx: {
                            backgroundColor: '#FFD8D9',
                            padding: '10px 16px',
                            borderRadius: 6,
                            ml: -2,
                            mt: 3


                        },
                    },
                }}
            >
                {children}
            </Tooltip>
        </CssVarsProvider>
    );
};

export default ClassTooltip;