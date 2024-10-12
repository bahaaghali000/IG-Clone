import React from "react";
import { Avatar as AvatarMUI, styled } from "@mui/material";
import Badge from "@mui/material/Badge";
const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

interface AvatarProps {
  src: string;
  alt: string;
  isOnline?: boolean;
  sx?: any;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  isOnline = false,
  sx = undefined,
}) => {
  return (
    <StyledBadge
      overlap="circular"
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      variant={isOnline ? "dot" : undefined}
    >
      <AvatarMUI src={src} alt={alt} sx={sx} />
    </StyledBadge>
  );
};

export default Avatar;
