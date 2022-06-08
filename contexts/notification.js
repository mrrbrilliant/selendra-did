import React, { createContext, useEffect, useState } from "react";
import { v4 as uid } from "uuid";

export const NotificationContext = createContext();
NotificationContext.displayName = "Notification";

const initial = [];

export default function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState(initial);

    function notify({ id, status, name, message }) {
        const new_notification = {
            id,
            status,
            name,
            message,
            show: true,
        };
        setNotifications((prevState) => [...prevState, new_notification]);
    }

    function hide(id) {
        setNotifications((prev) => prev.map((n) => (n.id === id ? (n.show = false && n) : n)));
    }

    return (
        <NotificationContext.Provider value={{ notifications, notify, hide }}>{children}</NotificationContext.Provider>
    );
}
