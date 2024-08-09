'use client'
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import GoogleLogIn from "./components/GoogleLogIn";

export default function Home() {

  return (
    <Box sx={{
      width: "100%",
      height: "100vh",
      display: "flex",
    }}>
      {/* Black box */}
      <Box sx={{
        backgroundColor: "darkblue",
        padding: '50px',
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        display: {
          xs: "none",
          sm: "none",
          md: "flex",
        },
      }}>
        <Typography variant="h1" fontWeight={"bold"} color={"white"} >
          Welcome to Customer Support Bot
        </Typography>
      </Box>
      {/* White Box */}
      <Box sx={{
        backgroundColor: "white",
        flex: 1,
        flexDirection: "column",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}>
        <GoogleLogIn />
      </Box>
    </Box >
  );

}