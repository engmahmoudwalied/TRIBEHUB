import { Box, Typography, IconButton, Badge } from "@mui/material"; // Import Badge here
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import MessageSidebar from "../../components/MessageSidebar";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "state";
import axios from "axios";
import MessageIcon from "@mui/icons-material/Message";

const FriendListWidget = ({ userId }) => {
  const dispatch = useDispatch();
  const friends = useSelector((state) => state.user.friends);
  const token = useSelector((state) => state.token);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  const getFriends = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/users/${userId}/friends`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      dispatch(setFriends({ friends: response.data }));
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };

  useEffect(() => {
    getFriends();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleMessageClick = (friend) => {
    const friendWithFullName = {
      ...friend,
      name: `${friend.firstName} ${friend.lastName}`, // Combining first and last name
    };
    setSelectedFriend(friendWithFullName);
    setIsSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <>
      <WidgetWrapper
        sx={{
          position: "sticky",
          top: 5,
          zIndex: 1000,
          maxHeight: "500px",
          overflow: "auto",
          "&::-webkit-scrollbar": {
            width: "9px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#888",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#555",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "black",
          },
        }}
      >
        <Typography variant="h5" fontWeight="500" sx={{ mb: "1.5rem" }}>
          Follow List
        </Typography>
        <Box display="flex" flexDirection="column" gap="1rem">
          {friends.map((friend) => (
            <Box
              key={friend._id}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Friend
                friendId={friend._id}
                name={`${friend.firstName} ${friend.lastName}`}
                subtitle={friend.occupation}
                userPicturePath={friend.picturePath}
              />
              <IconButton
                onClick={() => handleMessageClick(friend)}
                sx={{
                  color: "#FFD700",
                  "&:hover": { color: "#FFC107" },
                }}
              >
                <Badge
                  badgeContent={friend.unreadMessages || 0} // Assuming you have unreadMessages in friend object
                  color="error"
                >
                  <MessageIcon />
                </Badge>
              </IconButton>
            </Box>
          ))}
        </Box>
      </WidgetWrapper>

      {isSidebarOpen && (
        <MessageSidebar
          selectedFriend={selectedFriend}
          handleClose={handleCloseSidebar}
          userId={userId}
        />
      )}
    </>
  );
};

export default FriendListWidget;
