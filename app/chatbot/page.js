"use client";

import React, { useState } from 'react';
import { AppBar, Box, IconButton, TextField, Toolbar, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import Message from './message'; 

const ChatbotLayout = () => {
    const [messages, setMessages] = useState([
        { sender: 'ai', text: 'Hello! How can I assist you today?' },
    ]);
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (input.trim()) {
            // Add user's message
            setMessages([...messages, { sender: 'user', text: input }]);

            // Simulate AI response
            setTimeout(() => {
                setMessages(prevMessages => [...prevMessages, { sender: 'ai', text: 'This is an AI response.' }]);
            }, 1000);

            setInput(''); // Clear input field
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: 'calc(100vh - 40px)',
                width: '500px',
                border: '1px solid #ddd',
                borderRadius: '16px',
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#fff',
                position: 'fixed',
                right: '80px',
                top: '10px',
                bottom: '10px',
            }}
        >
            <AppBar 
                position="static" 
                sx={{ 
                    backgroundColor: '#007bff',
                    borderTopLeftRadius: '16px', 
                    borderTopRightRadius: '16px', 
                }}
            >
                <Toolbar>
                    <Typography variant="h6" color="white">
                        Your AI customer support!
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box
                sx={{
                    flex: 1,
                    padding: '10px',
                    overflowY: 'auto',
                    backgroundColor: '#f7f7f7',
                    borderBottom: '1px solid #ddd',
                }}
            >
                {messages.map((message, index) => (
                    <Message key={index} sender={message.sender} text={message.text} />
                ))}
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    padding: '10px',
                    borderTop: '1px solid #ddd',
                    backgroundColor: '#fff',
                    borderBottomLeftRadius: '16px',
                    borderBottomRightRadius: '16px',
                }}
            >
                <TextField
                    variant="outlined"
                    placeholder="Type a message..."
                    fullWidth
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    sx={{
                        marginRight: '10px',
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '10px',
                        },
                    }}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            handleSend();
                        }
                    }}
                />
                <IconButton color="primary" aria-label="send" onClick={handleSend}>
                    <SendIcon />
                </IconButton>
            </Box>
        </Box>
    );
};

export default ChatbotLayout;
