const calculateTimeDifference = (date: string, lang = "en") => {
  const postDate = new Date(date);
  const now = new Date();
  const diffInMs = now.getTime() - postDate.getTime();

  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays > 0) {
    return lang === "ar" ? `مُنذ ${diffInDays} يوم` : `${diffInDays} days ago`;
  } else if (diffInHours > 0) {
    return lang === "ar"
      ? `مُنذ ${diffInHours} ساعة`
      : `${diffInHours} hours ago`;
  } else if (diffInMinutes > 0) {
    return lang === "ar"
      ? `مُنذ ${diffInMinutes} دقائق`
      : `${diffInMinutes} minutes ago`;
  } else {
    return lang === "ar" ? "حالاً" : "just now";
  }
};

const getImageBase64 = (image: any) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(image);
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = (err) => {
      reject(err);
    };
  });
};

export { calculateTimeDifference, getImageBase64 };
