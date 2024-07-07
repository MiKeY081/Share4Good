import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import * as React from "react";
import UserContext from "../Context/userContext";

export default function LetterAvatars() {
    const { user } = React.useContext(UserContext);
    return (
        <Stack direction="row" spacing={2}>
            <Avatar>
                {user?.name && (
                    <>
                        <img src={user?.profileImage} alt="" />
                    </>
                )}
            </Avatar>
        </Stack>
    );
}
