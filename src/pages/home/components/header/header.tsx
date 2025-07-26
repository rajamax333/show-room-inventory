import { signOut } from "firebase/auth";
import { useState } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";
import { AccountCircle, Logout, FilterList } from "@mui/icons-material";
import styles from "./header.module.scss";
import { auth } from "../../../../firebase";

interface HeaderProps {
  onFilterClick?: () => void;
  showFilterIcon?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onFilterClick, showFilterIcon }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/login";
    } catch (error) {
      console.error("Error signing out:", error);
    }
    handleMenuClose();
  };

  return (
    <>
    <header className={styles.appHeader}>
      <div className={styles.logoSection}>
        <figure>
          <img
            src="https://stimg.cardekho.com/pwa/img/carDekho-newLogo.svg"
            alt="logo"
          />
        </figure>
      </div>
    </header>
          
      <div className={styles.userSection}>
        {showFilterIcon && (
          <IconButton 
            onClick={onFilterClick}
            className={styles.filterIcon}
          >
            <FilterList />
          </IconButton>
        )}
        
        <Tooltip title={auth?.currentUser?.displayName || "User"}>
          <IconButton
            onClick={handleMenuOpen}
            size="large"
            aria-controls={open ? "user-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            className={styles.userIcon}
          >
            <AccountCircle fontSize="large" />
          </IconButton>
        </Tooltip>

        <Menu
          id="user-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          slotProps={{
            paper: {
              "aria-labelledby": "user-button",
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem onClick={handleLogout}>
            <ListItemText>{auth?.currentUser?.displayName}</ListItemText>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            <ListItemText>Logout</ListItemText>
          </MenuItem>
        </Menu>
      </div>
      </>
  );
};

export default Header;
