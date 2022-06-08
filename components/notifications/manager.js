import React, { useContext } from "react";
import Notification from "./notification";
import { NotificationContext } from "../../contexts/notification";

export default function NotificationManager() {
    const { notifications, hide } = useContext(NotificationContext);

    return (
        <div className="w-[25vw] h-auto fixed top-0 right-0 z-50 grid grid-cols-1 gap-4 p-2">
            {notifications.map((n) => n.show && <Notification key={n.id} data={n} hide={hide} />)}
        </div>
    );
}
