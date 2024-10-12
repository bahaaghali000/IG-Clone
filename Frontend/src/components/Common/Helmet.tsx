const Helmet = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  document.title = title;
  return <>{children}</>;
};

export default Helmet;
