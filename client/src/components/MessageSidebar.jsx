import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";

const MessageSidebar = ({ selectedFriend, handleClose, userId }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    // جلب الرسائل عند تحميل المكون
    fetchMessages();
  }, [selectedFriend]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(
        `/api/messages?friendId=${selectedFriend._id}`
      );
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSendMessage = async () => {
    if (message.trim()) {
      const newMessage = {
        sender: userId,
        receiver: selectedFriend._id,
        text: message,
        time: new Date(),
      };

      try {
        await fetch("/api/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newMessage),
        });

        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setMessage("");
        setIsDialogOpen(true);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  return (
    <Box
      sx={{
        position: "fixed",
        right: 0,
        top: 0,
        bottom: 0,
        width: "300px",
        backgroundColor: "#1E1E1E",
        color: "white",
        boxShadow: "-2px 0px 10px rgba(0, 0, 0, 0.3)",
        padding: "1rem",
        zIndex: 1100,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <IconButton
        onClick={handleClose}
        sx={{
          color: "white",
          position: "absolute",
          top: "1rem",
          right: "1rem",
        }}
      >
        <CloseIcon />
      </IconButton>

      <Typography
        variant="h6"
        fontWeight="500"
        mb="1.5rem"
        sx={{ color: "#FFD700" }}
      >
        Chat with {selectedFriend?.name}
      </Typography>

      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          mb: "1rem",
          padding: "0.5rem",
          backgroundColor: "#2C2C2C",
          borderRadius: "8px",
        }}
      >
        {messages.length === 0 ? (
          <Typography variant="body2" sx={{ color: "#888" }}>
            No messages yet.
          </Typography>
        ) : (
          messages.map((msg, index) => (
            <Box
              key={index}
              sx={{
                mb: "0.5rem",
                display: "flex",
                justifyContent:
                  msg.sender === userId ? "flex-end" : "flex-start",
              }}
            >
              <Box
                sx={{
                  maxWidth: "80%",
                  padding: "0.5rem 1rem",
                  backgroundColor:
                    msg.sender === userId ? "#FFD700" : "#3E3E3E",
                  color: msg.sender === userId ? "#1E1E1E" : "#FFFFFF",
                  borderRadius: "10px 10px 10px 0px",
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  {msg.sender === userId ? "You" : selectedFriend.name}:{" "}
                  {msg.text}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "#888", display: "block" }}
                >
                  {new Date(msg.time).toLocaleTimeString()}
                </Typography>
              </Box>
            </Box>
          ))
        )}
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          padding: "0rem",
        }}
      >
        <Box
          component="textarea"
          placeholder="Your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          sx={{
            flexGrow: 1,
            border: "none",
            outline: "none",
            bgcolor: "#333",
            color: "#FFD700",
            padding: "0.4rem",
            borderRadius: "5px",
            resize: "none",
            maxWidth: "300px",
            "&::placeholder": {
              color: "#FFD700",
            },
          }}
          rows={2}
        />

        <IconButton onClick={handleSendMessage}>
          <SendIcon />
        </IconButton>
      </Box>

      <Dialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        PaperProps={{
          sx: {
            backgroundColor: "#333",
            color: "white",
          },
        }}
      >
        <DialogContent>
          <Typography sx={{ color: "#FFD700" }}>
            Message sent successfully to {selectedFriend?.name}!
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDialogClose}
            sx={{
              backgroundColor: "#FFD700",
              color: "#1E1E1E",
              "&:hover": { backgroundColor: "#FFC107" },
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MessageSidebar;
