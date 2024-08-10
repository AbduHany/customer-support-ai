import { Star } from '@mui/icons-material';
import { Avatar, Box, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'

const FeedbackView = ({ reviews }) => {

    const addStar = (rating) => {

        let starsList = [];
        for (let i = 0; i < rating; i++) {
            starsList.push(<Star key={i} color='primary' />);
        }
        return starsList
    }

    return (
        <Box sx={{
            width: '80%',
            marginTop: '20px',
        }}>
            <Typography variant='h5' fontWeight={'bold'} color={'darkblue'} marginBottom={1}>What Our Customer Said About Us!</Typography>
            <Box sx={{
                overflowY: 'auto',
                backgroundColor: 'white',
                width: '100%',
                maxHeight: '400px',
                padding: '20px',
                border: '1px solid lightgrey',
                borderRadius: '5px',
            }}>
                {reviews.map((feedback, index) => {
                    return (
                        <Box
                            key={index}
                            padding={'10px'}
                            display={'flex'}
                            sx={{
                                marginBottom: '10px',
                                minHeight: '100px',
                                backgroundColor: '#f5f5f5',
                                borderRadius: '5px'
                            }}>
                            <Box
                                display={'flex'}
                                flexDirection={'column'}
                                alignItems={'center'}
                                sx={{
                                    width: '100px',
                                    marginRight: '20px'
                                }}
                            >
                                <Avatar
                                    alt={feedback.name}
                                    src={feedback.image}
                                    sx={{
                                        width: 60,
                                        height: 60,
                                        marginBottom: '4px'
                                    }} />
                                <Typography
                                    color={'darkblue'}
                                    fontWeight={'bold'}
                                    textAlign={'center'}
                                >
                                    {feedback.name}
                                </Typography>
                            </Box>
                            <Box
                                flex={1}
                                display={'flex'}
                                justifyContent={'space-between'}
                            >
                                <Typography
                                    width={'40%'}
                                    textAlign={'left'}
                                >
                                    {feedback.text}
                                </Typography>
                                <Box>
                                    {addStar(feedback.rating)}
                                </Box>
                            </Box>
                        </Box>
                    )
                })}
            </Box>
        </Box >
    )
}

export default FeedbackView