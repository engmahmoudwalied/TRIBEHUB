import { Box, Typography, useTheme } from "@mui/material";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "state";
import axios from "axios";

const FriendListWidget = ({ userId }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);

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

  return (
    <WidgetWrapper
      sx={{
        position: "sticky",
        top: 5,
        zIndex: 1000,
        maxHeight: "500px",
        overflow: "auto",
        "&::-webkit-scrollbar": {
          width: "9px", // Width of the scrollbar
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#888", // Color of the scrollbar thumb
          borderRadius: "10px", // Round edges
        },
        "&::-webkit-scrollbar-thumb:hover": {
          backgroundColor: "#555", // Darker color on hover
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "black", // Color of the track
        },
      }}
    >
      <Typography
        color={palette.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem" }}
      >
        Follow List
      </Typography>
      <Box display="flex" flexDirection="column" gap="1rem">
        {friends.map((friend) => (
          <Friend
            key={friend._id}
            friendId={friend._id}
            name={`${friend.firstName} ${friend.lastName}`}
            subtitle={friend.occupation}
            userPicturePath={friend.picturePath}
          />
        ))}
      </Box>
    </WidgetWrapper>
  );
};

export default FriendListWidget;
