import Btn from "@mui/material/Button";

interface Props {
  children: React.ReactNode;
  loading?: boolean | undefined;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
}

const Button: React.FC<Props> = ({
  children,
  loading = false,
  disabled = false,
  className = "",
  onClick,
}) => {
  const style = {
    textAlign: "center",
    // backgroundColor: "#3b82f6",
    // color: "#fff",
    fontWeight: "600",
    textTransform: "capitalize",
    // marginTop: "1rem",
    borderRadius: "0.5rem",
    fontSize: "0.9rem",
    boxShadow: "none",
    // padding: "8px 0",

    "&:hover": {
      // backgroundColor: "#0069d9",
      boxShadow: "none",
    },
  };
  return (
    <Btn
      onClick={onClick}
      variant="contained"
      className={`${
        loading ? "pointer-events-none select-none" : ""
      } ${className}`}
      disabled={disabled}
      type="submit"
      sx={style}
    >
      {loading ? (
        <div className=" flex justify-center items-center py-0.5">
          <span className="loader"></span>
        </div>
      ) : (
        children
      )}
    </Btn>
  );
};

export default Button;
