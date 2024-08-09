"use client";

import React, { useEffect, useState } from 'react';
import { AppBar, Avatar, Box, Button, IconButton, TextField, Toolbar, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import Message from './message';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Image } from '@mui/icons-material';

const ChatbotLayout = () => {

    // handling session data in the app
    const { data: session, status } = useSession()
    const router = useRouter()
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push('/')  // Redirect to chatbot route after sign-in
        }
    }, [status])

    console.log(session);

    // setting initial message for the chatbot
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hello! How can I assist you today?' },
    ]);
    const [input, setInput] = useState('');

    // handling user input and reading from the returned stream
    const handleSend = () => {
        if (input.trim()) {
            // Add user's message & empty AI message to read from stream into
            setMessages((messages) => [
                ...messages,
                { role: 'user', content: input },
                { role: 'assistant', content: '' },
            ]);

            // sending POST request to backend
            const response = fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify([...messages, { role: 'user', content: input }]),
            }).then(async (res) => {
                // create reader and decoder for stream
                const reader = res.body.getReader()
                const decoder = new TextDecoder()

                // read stream
                let result = ''
                return reader.read().then(function processText({ done, value }) {
                    if (done) {
                        return result
                    }
                    const text = decoder.decode(value || new Int8Array(), { stream: true })
                    setMessages((messages) => {
                        let lastMessage = messages[messages.length - 1]
                        let otherMessages = messages.slice(0, messages.length - 1)
                        return [
                            ...otherMessages,
                            {
                                ...lastMessage,
                                content: lastMessage.content + text
                            },
                        ]
                    })
                    return reader.read().then(processText);
                }
                )
            })
            setInput(''); // Clear input field
        }
    };


    if (status === 'authenticated') {

        return (
            <>
                {/* Header */}
                <Box sx={{ minHeight: '5vh', display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '10px' }}>
                    <Typography variant="h5">Welcome, <span style={{ fontWeight: 'bold' }}>{session?.user?.name}</span></Typography>
                    <Button color='primary' variant='contained' onClick={() => signOut({ callbackUrl: '/' })}>
                        <Avatar sx={{ width: 24, height: 24, marginRight: '10px' }} alt="Remy Sharp" src={session?.user?.image} />
                        <Typography >Sign Out</Typography>
                    </Button>
                </Box>
                {/* Body */}
                <Box sx={{ height: '95vh', display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
                    {/* Chatbot */}
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            height: 'calc(100vh - 100px)',
                            width: '500px',
                            border: '1px solid #ddd',
                            borderRadius: '16px',
                            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                            backgroundColor: '#fff',
                            marginX: '20px',
                            // position: 'fixed',
                            // right: '80px',
                            // top: '10px',
                            // bottom: '10px',
                        }}
                    >
                        <AppBar
                            position="static"
                            sx={{
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
                                <Message key={index} sender={message.role} text={message.content} />
                            ))}
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
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
                            <IconButton sx={{ width: '50px', height: '50px' }} color="primary" aria-label="send" onClick={handleSend}>
                                <SendIcon />
                            </IconButton>
                        </Box>
                    </Box>
                </Box>
            </>
        );
    }
}

export default ChatbotLayout;
