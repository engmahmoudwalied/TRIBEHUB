// src/scenes/Loading.js
import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

const Loading = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh" // ملء الشاشة بالكامل
      bgcolor="#000" // لون خلفية هادئ
    >
      <Typography variant="h6" color="white" marginTop={2}>
        Please wait...
      </Typography>
      <Box
        sx={{
          width: "100px",
          height: "5px",
          backgroundColor: "#2221",
          borderRadius: "5px",
          position: "relative",
          marginTop: "20px",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "100%",
            backgroundColor: "orange",
            position: "absolute",
            top: 0,
            left: 0,
            animation: "loading 1.5s infinite",
          }}
        />
      </Box>

      <style jsx>{`
        @keyframes loading {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </Box>
  );
};

export default Loading;