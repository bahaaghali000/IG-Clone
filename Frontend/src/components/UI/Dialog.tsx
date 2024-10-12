import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Button from "./Button/Button";

interface Props {
  children: React.ReactNode;
  title: any;
  handleClose: () => void;
  open: boolean;
  handleSubmit?: () => void;
  actionTitle?: string;
  isSubmit?: boolean;
  width?: string;
  height?: number;
  className?: string;
  fullScreen?: boolean;
}

const DialogModel: React.FC<Props> = ({
  children,
  title,
  handleClose,
  open,
  handleSubmit,
  actionTitle,
  height = 600,
  className = "",
  fullScreen = false,
}) => {
  return (
    <Dialog
      sx={{
        "& .MuiDialog-paper": {
          height,
          borderRadius: "15px",
          padding: "10px 0",
        },
      }}
      onClose={handleClose}
      open={open}
      className={` ${className}`}
      // className=""
      fullWidth
      // maxWidth={"md"}
      fullScreen={fullScreen}
    >
      <DialogTitle
        sx={{ m: 0, p: 1 }}
        className=" text-center dark:text-white  dark:bg-[#262626]  border-bottom"
        id="customized-dialog-title"
      >
        {title}
      </DialogTitle>

      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[400],
        }}
      >
        <CloseIcon />
      </IconButton>

      {/* <DialogContent className="dark:text-white  dark:bg-[#262626] p-0 "> */}
      {children}
      {/* </DialogContent> */}
      <DialogActions className="dark:text-white  dark:bg-[#262626]">
        {actionTitle && (
          <Button onClick={handleSubmit} className="w-full">
            {actionTitle}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default DialogModel;
