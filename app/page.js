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
        <Typography width={"100%"} textAlign={"center"} variant="h3" color={"white"} >
          Welcome to <span style={{ fontSize: "150px", fontWeight: "bold" }}>Aether</span>’s Customer Support!
        </Typography>
        <Box height='40px'></Box>
        <Typography width={"80%"} textAlign={"center"} variant="p" color={"white"}>
          Your journey to a sustainable wardrobe starts here. Whether you need assistance with an order,
          have questions about our products, or simply want to learn more about Aether’scommitment
          to eco-friendly fashion, our AI is here to help.
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