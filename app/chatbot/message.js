import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import ReactMarkdown from 'react-markdown';


const Message = ({ sender, text }) => {
    const isAI = sender === 'assistant';

    return (
        <Box
            sx={{
                position: 'relative',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: isAI ? 'flex-start' : 'flex-end',
                marginBottom: '15px',
            }}
        >
            {isAI && (
                <Avatar
                    alt="AI"
                    src="image.png"
                    // sx={{ width: 24, height: 24, marginRight: '10px' }}
                    sx={{
                        width: 24,
                        height: 24,
                        position: 'relative',
                        bottom: 0,
                        top: 24,
                        left: 0,
                        marginRight: '10px',
                    }}
                />
            )}
            <Box
                sx={{
                    padding: '12px 25px',
                    borderRadius: '10px',
                    backgroundColor: isAI ? '#e0e0e0' : '#007bff',
                    color: isAI ? '#000' : '#fff',
                    maxWidth: '70%',
                }}
            >
                <ReactMarkdown>{text}</ReactMarkdown>
            </Box>
        </Box>
    );
};

export default Message;
