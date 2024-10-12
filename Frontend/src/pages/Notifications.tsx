import NotificationsComponent from "../components/Notifications/Notifications";

const Notifications = () => {
  return (
    <div className="flex items-center justify-center pt-20 ">
      <div className="w-[600px] p-3">
        <h2 className=" font-semibold mb-2">Notifications</h2>
        <NotificationsComponent />
      </div>
    </div>
  );
};

export default Notifications;
