import React, { useState } from "react";
import DialogImage from "../UI/DialogImage";
import DialogAlert from "../UI/DialogAlert";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import toast from "react-hot-toast";
import axios from "axios";
import { updateProfilePicture } from "../../redux/features/userSlice";
import { IUser } from "../../models/User";

interface ProfileAvatarProps {
  user: IUser;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ user }) => {
  const { userInfo: myDetails } = useSelector((state: RootState) => state.user);
  const [dialog, setDialog] = useState<boolean>(false);
  const [image, setImage] = useState<any>("");
  const [isLoading, setLoading] = useState<boolean>(false);

  const handleClose = () => {
    setDialog(false);
  };

  const dispatch = useDispatch();

  const handleCloseDialog = () => {
    setImage(null);
  };

  const handleUpateProfilePicture = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("profilePicture", image);

      const { data } = await axios.patch("/users/account/picture", formData);
      dispatch(updateProfilePicture(data.url));

      handleCloseDialog();
      toast.success(data.message);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const isMine = myDetails?._id === user._id;
  return (
    <>
      <div className=" flex-1 flex md:justify-center">
        <img
          className=" w-40 h-40 object-cover rounded-full cursor-pointer overflow-hidden"
          title={isMine ? "Change Profile Photo" : user.username}
          src={isMine ? myDetails?.avatar : user.avatar}
          alt={isMine ? myDetails?.username : user.username}
          onClick={() => {
            isMine && setDialog(true);
          }}
        />
      </div>

      <DialogImage
        open={image ? true : false}
        onClose={handleCloseDialog}
        title={"Preview"}
        next={
          isLoading ? (
            <span className="loader"></span>
          ) : (
            <span className="link text-base">Update</span>
          )
        }
        nextStep={handleUpateProfilePicture}
        getBack={handleCloseDialog}
      >
        <img
        //   src={URL.createObjectURL(image)}
          alt={user.fullname}
          className="w-full object-cover"
        />
      </DialogImage>

      <DialogAlert
        onClose={handleClose}
        open={dialog}
        title="Change Profile Photo"
      >
        <input
          type="file"
          className="hidden"
          accept="image/*"
          id="profile-picutre"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <label htmlFor="profile-picutre">
          <h2 className="dialog__alert-item  text-[#0095f6]">Upload Photo</h2>
        </label>
        <h2 className="dialog__alert-item text-[#ed4956]">
          Remove Current Photo
        </h2>
        <h2 onClick={handleClose} className="dialog__alert-item ">
          Cancel
        </h2>
      </DialogAlert>
    </>
  );
};

export default ProfileAvatar;
