'use client'
import { Box, Button, Divider, Icon, TextField, Typography } from '@mui/material'
import GoogleIcon from '@mui/icons-material/Google';
import React, { useEffect, useState } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const GoogleLogIn = () => {

    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (status === "authenticated") {
            router.push('/chatbot')  // Redirect to chatbot route after sign-in
        }
    }, [status])

    return (
        <Box padding={5} sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <Typography textAlign={"center"} variant="h2" fontWeight={"bold"} color={"primary"} marginBottom={5}>
                Get Started
            </Typography>
            <Button variant='outlined' onClick={() => signIn('google')}>
                <GoogleIcon sx={{ marginRight: 1 }} />
                <Typography>LogIn with Google</Typography>
            </Button>
        </Box>
    )
}

export default GoogleLogIn


