import Logout from "@mui/icons-material/Logout";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import axios from "axios";
import * as React from "react";
import { FaBell } from "react-icons/fa";
import { MdDashboardCustomize } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import UserContext from "../Context/userContext";
import LetterAvatars from "./Avatar";

export default function UserMenu() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const { user, setUser } = React.useContext(UserContext);
    const navigate = useNavigate();
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        try {
            const { data } = await axios.post("/api/v1/user/logout");
            if (data.success) {
                toast.success("Logout successfully");
                navigate("/");
                setUser({});
            }
        } catch (error) {
            console.log(error.message);
            toast.error(error.message);
        }
    };

    return (
        <React.Fragment>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    textAlign: "center",
                }}
            >
                <Tooltip title="Profile">
                    <IconButton
                        onClick={handleClick}
                        size="small"
                        sx={{ ml: 2 }}
                        aria-controls={open ? "account-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? "true" : undefined}
                    >
                        <LetterAvatars />
                    </IconButton>
                </Tooltip>
            </Box>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        width: "200px",
                        overflow: "visible",
                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                        mt: 1.5,
                        "& .MuiAvatar-root": {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        "&::before": {
                            content: '""',
                            display: "block",
                            position: "absolute",
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: "background.paper",
                            transform: "translateY(-50%) rotate(45deg)",
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
                {user?.name && (
                    <>
                        <MenuItem
                            onClick={() => {
                                handleClose();
                                navigate("/userprofile");
                            }}
                        >
                            <Avatar>
                                {user?.profileImage && (
                                    <>
                                        <img src={user?.profileImage} alt="" />
                                    </>
                                )}
                            </Avatar>{" "}
                            Profile
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                handleClose();
                                navigate("/user/notification");
                            }}
                            className="flex gap-2"
                        >
                            <FaBell size={24} /> Notification
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                handleClose();
                                navigate("/user/dashboard");
                            }}
                            className="flex gap-2"
                        >
                            <MdDashboardCustomize size={24} /> Dashboard
                        </MenuItem>
                        <Divider />
                    </>
                )}

                <MenuItem
                    onClick={() => {
                        handleClose();
                    }}
                >
                    <div className="w-full flex items-center">
                        {user?.name ? (
                            <div
                                onClick={handleLogout}
                                className="flex items-center gap-2 w-full"
                            >
                                <ListItemIcon>
                                    <Logout fontSize="small" />
                                </ListItemIcon>
                                Logout
                            </div>
                        ) : (
                            <div
                                onClick={() => navigate("/user/login")}
                                className="flex items-center gap-2"
                            >
                                <ListItemIcon>
                                    <Logout fontSize="small" />
                                </ListItemIcon>
                                Login
                            </div>
                        )}
                    </div>
                </MenuItem>
            </Menu>
        </React.Fragment>
    );
}
