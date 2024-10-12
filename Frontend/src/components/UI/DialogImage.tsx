import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface DialogImageProps {
  open: boolean;
  onClose: () => void;
  title: string;
  getBack?: () => void;
  children: React.ReactNode;
  next: any;
  nextStep: () => void;
}

const DialogImage: React.FC<DialogImageProps> = (props) => {
  const { open, onClose, title, getBack, children, nextStep, next, ...other } =
    props;
  return (
    <Dialog
      fullScreen
      sx={{
        "& .MuiDialog-paper": {
          height: 800,

          borderRadius: "15px",
          // backgroundColor: "#262626",
          margin: "0 60px",
        },
        ".MuiDialogContent-root": {
          padding: "0",
        },
        "& .MuiButtonBase-root": {
          paddingTop: "0",
        },
      }}
      scroll={"paper"}
      onClose={onClose}
      open={open}
      {...other}
    >
      <DialogTitle
        sx={{ m: 0, p: 1 }}
        className=" text-center dark:text-white  dark:bg-[#262626]  border-b border-white border-opacity-25"
        id={title}
      >
        {title}
      </DialogTitle>

      {getBack && (
        <IconButton
          aria-label="get back"
          onClick={getBack}
          sx={{
            position: "absolute",
            left: 8,
            top: 8,
            color: (theme) => theme.palette.grey[100],
          }}
        >
          <ArrowBackIcon />
        </IconButton>
      )}

      {next && (
        <IconButton
          aria-label={next}
          onClick={nextStep}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[100],
          }}
        >
          {next}
        </IconButton>
      )}

      <DialogContent className="dark:text-white flex max-md:flex-col relative dark:bg-[#262626] p-0 ">
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default DialogImage;
