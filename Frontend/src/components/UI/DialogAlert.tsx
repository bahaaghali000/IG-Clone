import React from "react";

import { DialogTitle, DialogContent, Dialog } from "@mui/material";

// const options = [
//   "None",
//   "Atria",
//   "Callisto",
//   "Dione",
//   "Ganymede",
//   "Hangouts Call",
//   "Luna",
//   "Oberon",
//   "Phobos",
//   "Pyxis",
//   "Sedna",
//   "Titania",
//   "Triton",
//   "Umbriel",
// ];

interface DialogAlertProps {
  id?: string;
  keepMounted?: boolean;
  open: boolean;
  onClose: () => void;
  // options: string[];
  title?: any;
  children?: React.ReactNode;
}

const DialogAlert: React.FC<DialogAlertProps> = (props) => {
  const { open, onClose, title, children, className, ...other } = props;

  return (
    <Dialog
      sx={{
        "& .MuiDialog-paper": {
          width: "80%",
          borderRadius: "15px",
          // backgroundColor: "#262626",
          // color: "white",
        },
        "& .dark .MuiDialog-paper": {
          backgroundColor: "white",
          color: "black",
        },
        "& .MuiDialogContent-root": {
          padding: "0",
        },
        "& .MuiDialogTitle-root": {
          textAlign: "center !important",
          margin: "32px 32px 16px",
          padding: "0",
        },
      }}
      onClose={onClose}
      maxWidth="xs"
      open={open}
      // className="dark:bg-[#262626] dark:text-white bg-white text-black "
      {...other}
    >
      {title && <DialogTitle>{title}</DialogTitle>}
      <DialogContent dividers>{children}</DialogContent>
    </Dialog>
  );
};

export default DialogAlert;

/*
  .danger{
    color: #ed4956,
    font-weight: 700; bold


  }

  option {
    padding: 4px 8px;
    border-top: 1px solid #363636;
  }

  mt => 32
  mx => 32
  mb => 16
 
 */
