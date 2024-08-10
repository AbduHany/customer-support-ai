"use client";

import React, { useEffect, useState } from 'react';
import { AppBar, Avatar, Box, Button, IconButton, TextField, Toolbar, Typography, Select, MenuItem, Icon } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import Message from './message';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import FeedbackView from './components/FeedbackView';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import FeedbackButton from './components/FeedbackButton';

const ChatbotLayout = () => {

    const [reviews, setReviews] = useState([]);

    // fetching reviews for the first time from DB
    const updateReviews = async () => {
        console.log('Fetching reviews...');
        try {
            const collectionRef = collection(db, 'reviews');
            const querySnapshot = await getDocs(collectionRef);
            const documents = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));
            setReviews(documents);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    }

    useEffect(() => {
        updateReviews();
    }, [])

    // handling session data in the app
    const { data: session, status } = useSession()
    const router = useRouter()
    const openingMessages = {
        en: "Hello! How can I assist you today?",
        es: "¡Hola! ¿Cómo puedo ayudarte hoy?",
        fr: "Bonjour ! Comment puis-je vous aider aujourd'hui ?",
        de: "Hallo! Wie kann ich Ihnen heute helfen?",
        zh: "你好！我今天怎么帮你？"
    };
    const toolbarMessages = {
        en: "Your AI Customer Support",
        es: "Tu soporte al cliente AI",
        fr: "Votre support client AI",
        de: "Ihr KI-Kundenservice",
        zh: "您的 AI 客户支持"
    };
    // setting initial message for the chatbot
    const [messages, setMessages] = useState([
        { role: 'assistant', content: openingMessages['en'] },
    ]);
    const [input, setInput] = useState('');
    // setting language
    const [botLanguage, setBotLanguage] = useState('en');
    const [toolbarMessage, setToolbarMessage] = useState(toolbarMessages['en'])

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push('/')  // Redirect to chatbot route after sign-in
        }
    }, [status])


    useEffect(() => {
        // Update the toolbar message and reset the chat
        setToolbarMessage(toolbarMessages[botLanguage]);
        setMessages([
            { role: 'assistant', content: openingMessages[botLanguage] }
        ]);
    }, [botLanguage]);


    // handling user input and reading from the returned stream
    const handleSend = () => {
        if (input.trim()) {
            // Add user's message & empty AI message to read from stream into
            setMessages((messages) => [
                ...messages,
                { role: 'user', content: input },
                { role: 'assistant', content: '' },
            ]);
            const selectedLanguage = botLanguage;
            // sending POST request to backend
            const response = fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }, body: JSON.stringify({
                    language: selectedLanguage,
                    messages: [...messages, { role: 'user', content: input }],
                }),
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
                <Box sx={{
                    minHeight: '5vh',
                    display: 'flex',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    padding: '10px',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: '20px',
                }}>
                    <Typography
                        textAlign={'center'}
                        variant="h5">
                        Welcome, <span style={{ fontWeight: 'bold' }}>{session?.user?.name}</span>
                    </Typography>
                    <Button
                        color='primary'
                        variant='contained'
                        onClick={() => signOut({ callbackUrl: '/' })}
                        sx={{
                            display: { xs: 'flex', md: 'none' },
                        }}
                    >
                        <Avatar sx={{ width: 24, height: 24, marginRight: '10px' }} alt="Profile Avatar" src={session?.user?.image} />
                        <Typography >Sign Out</Typography>
                    </Button>
                </Box>
                {/* Body */}
                <Box sx={{ height: '95vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Box
                        sx={{
                            flex: 1,
                            marginX: '20px',
                            display: { xs: 'none', sm: 'none', md: 'flex' },
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                            textAlign: 'center',
                            height: '100%',
                        }}>
                        <Typography fontSize={'120px'} fontWeight={'bold'}>Aether</Typography>
                        <Typography variant='h6' width={'50%'}>
                            Got any questions or need help? Our AI customer support is here to help.
                        </Typography>

                        <FeedbackButton setReviews={setReviews} />
                        <FeedbackView reviews={reviews} />
                        <Button
                            sx={{
                                marginTop: '100px',
                            }}
                            color='primary'
                            variant='contained'
                            onClick={() => signOut({ callbackUrl: '/' })}
                        >
                            <Avatar sx={{ width: 24, height: 24, marginRight: '10px' }} alt="Profile Avatar" src={session?.user?.image} />
                            <Typography >Sign Out</Typography>
                        </Button>
                    </Box>
                    {/* Chatbot */}
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            height: 'calc(100vh - 100px)',
                            border: '1px solid #ddd',
                            borderRadius: '16px',
                            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                            backgroundColor: '#fff',
                            marginX: '20px',
                            flex: 1,
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
                            <Toolbar
                                display="flex"
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    borderTopLeftRadius: '16px',
                                    borderTopRightRadius: '16px',
                                }}
                            >
                                <Typography variant="h6" color="inherit">
                                    {toolbarMessage}
                                </Typography>
                                <Select
                                    size='small'
                                    value={botLanguage}
                                    onChange={(e) => setBotLanguage(e.target.value)}
                                    variant="outlined"
                                    sx={{
                                        color: 'white',
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'white',
                                        },
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'white',
                                        },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'white',
                                        },
                                        '& .MuiSelect-icon': {
                                            color: 'white',
                                        },
                                    }}
                                    MenuProps={{
                                        PaperProps: {
                                            style: {
                                                backgroundColor: '#333',
                                                color: 'white',
                                            },
                                        },
                                    }}
                                >
                                    <MenuItem value="en">English</MenuItem>
                                    <MenuItem value="es">Spanish</MenuItem>
                                    <MenuItem value="fr">French</MenuItem>
                                    <MenuItem value="de">German</MenuItem>
                                    <MenuItem value="zh">Chinese</MenuItem>
                                </Select>
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
