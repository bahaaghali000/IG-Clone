import React, { memo, useState, useTransition, useCallback } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  AccordionSummary,
  Accordion,
  AccordionDetails,
  Typography,
} from "@mui/material";
import SwiperSlides from "../Swiper/SwiperSlides";
import User from "../Users/User";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import axios from "axios";
import DialogImage from "../DialogImage";
import DialogAlert from "../DialogAlert";
import CreatePostFirstLayer from "./CreatePostFirstLayer";

interface CreatePostProps {
  handleClose: () => void;
  open: boolean;
}

const CreatePost: React.FC<CreatePostProps> = memo(({ handleClose, open }) => {
  const [isPending, startTransition] = useTransition();
  const [files, setFiles] = useState<any>([]);
  const [steps, setSteps] = useState<"preview" | "share" | "none">("share");
  const [caption, setCaption] = useState("");
  const [uploadProgress, setUploadProgress] = useState({});
  const [expanded, setExpanded] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const handleExpansion = useCallback(() => {
    setExpanded((prevExpanded) => !prevExpanded);
  }, []);

  const closeDialog = useCallback(() => {
    setFiles([]);
    handleClose();
    setShowAlert(false);
  }, []);

  const selectTab = (
    nextTab: React.SetStateAction<"preview" | "share" | "none">
  ) => {
    startTransition(() => {
      setSteps(nextTab);
    });
  };

  const handleShare = useCallback(async () => {
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    formData.append("caption", caption);

    try {
      const { data } = await axios.post("/post", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          const percent = Math.floor((loaded * 100) / total);
          setUploadProgress((prevProgress) => ({
            ...prevProgress,
            total: percent, // Track progress per file
          }));
        },
      });
      setUploadProgress((prevProgress) => ({
        ...prevProgress,
        total: 100,
      }));

      console.log(data);
    } catch (error) {
      console.log(error);
    }

    // setSteps("none");
    // handleClose();
  }, [caption, files]);
  console.log(uploadProgress);

  const handleCloseAlert = useCallback(() => {
    setShowAlert(false);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setShowAlert(true);
  }, []);

  return (
    <>
      <CreatePostFirstLayer
        open={open}
        handleClose={handleClose}
        setFiles={setFiles}
      />

      {steps === "preview" && (
        <DialogImage
          open={files.length > 0}
          onClose={handleCloseDialog}
          title={"Preview"}
          next={
            isPending ? (
              <span className="loader"></span>
            ) : (
              <span className="link text-base">Next</span>
            )
          }
          nextStep={() => selectTab("share")}
          getBack={handleCloseDialog}
        >
          <SwiperSlides slides={Array.from(files)} />
        </DialogImage>
      )}

      {steps === "share" && (
        <DialogImage
          open={files.length > 0}
          onClose={handleCloseDialog}
          title={"Create new post"}
          next={<span className="link text-base">Share</span>}
          nextStep={handleShare}
          getBack={() => selectTab("preview")}
        >
          <SwiperSlides slides={Array.from(files)} />
          <RightSide
            caption={caption}
            setCaption={setCaption}
            expanded={expanded}
            handleExpansion={handleExpansion}
            images={files}
          />
        </DialogImage>
      )}

      <DialogAlert
        onClose={handleCloseAlert}
        open={showAlert}
        title={
          <div className="text-center">
            <h2>Discard post?</h2>
            <p className=" pt-2 text-sm text-[#a8a8a8]">
              If you leave, your edits won't be saved.
            </p>
          </div>
        }
      >
        <h2 onClick={closeDialog} className="dialog__alert-item">
          Discard
        </h2>
        <h2 onClick={handleCloseAlert} className="dialog__alert-item">
          Cancel
        </h2>
      </DialogAlert>
    </>
  );
});

export default CreatePost;

const RightSide: React.FC<any> = ({
  caption,
  setCaption,
  expanded,
  handleExpansion,
  images,
}) => {
  const { userInfo } = useSelector((state: RootState) => state.user);

  return (
    <div className=" w-[25rem] border-left px-3">
      <User user={userInfo} />
      <textarea
        name="caption"
        id="caption"
        className="full-border outline-none bg-transparent w-full rounded-md px-2 py-1 h-32"
        onChange={(e) => setCaption(e.target.value)}
        maxLength={2200}
        placeholder="caption..."
      ></textarea>
      <p className="text-right dark:text-white dark:text-opacity-35  dark:bg-[#262626] ">
        {caption.length}/2,200
      </p>
      <div>
        <Accordion
          expanded={expanded}
          onChange={handleExpansion}
          className="accordion"
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Typography>Accessibility</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <p className=" text-[10px] mb-2 dark:text-white dark:text-opacity-35 ">
              Alt text describes your photos for people with visual impairments.
              Alt text will be automatically created for your photos or you can
              choose to write your own.
            </p>
            {Array.from(images).map((img: string, index: number) => (
              <div key={`image-${index + 1}`} className="mb-2 flex gap-1">
                <img src={URL.createObjectURL(img)} width={50} height={50} />
                <input
                  placeholder="Write alt text..."
                  className=" outline-none focus:outline-[1px] focus:outline-white bg-transparent rounded-md p-2"
                />
              </div>
            ))}
          </AccordionDetails>
        </Accordion>

        <Accordion className="accordion">
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2-content"
            id="panel2-header"
          >
            <Typography>Default transition using Collapse</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
              eget.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </div>
    </div>
  );
};
