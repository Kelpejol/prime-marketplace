'use client'

import Image from 'next/image';
import React, { useState } from 'react';
import img1 from "@public/img1.jpeg"
import Button from "./Button";

interface Notification {
  id: number;
  user: string;
  action: string;
  time: string;
  buttons?: {
    decline: string;
    accept: string;
  };
}

const initialNotifications: Notification[] = [
  {
    id: 1,
    user: "Paul Waga",
    action: "shared the file Android UI Kit with you.",
    time: "an hour ago",
    buttons: {
      decline: "Decline",
      accept: "Accept"
    }
  },
  {
    id: 2,
    user: "Denise Selover",
    action: "made you an editor in the team Power.",
    time: "Yesterday"
  },
  {
    id: 3,
    user: "Paul Waga",
    action: "shared the file Android UI Kit with you.",
    time: "an hour ago",
    buttons: {
      decline: "Decline",
      accept: "Accept"
    }
  },
  {
    id: 4,
    user: "Denise Selover",
    action: "made you an editor in the team Power.",
    time: "Yesterday"
  }
];

interface NotificationProps {
    isOpen: boolean;

}

export default function Notification({isOpen}: NotificationProps) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const toggleNotification = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  

 return (
    <div className="absolute md:w-[300px] w-[230px] mx-auto shadow-md sm:right-14 md:right-16 right-6 top-20 z-30">
      {isOpen && (
        <div className="bg-white shadow-lg rounded-lg relative">
          <div className="max-h-[14rem] overflow-y-auto">
            {/* Header - will stick to top */}
            <div className="sticky top-0 z-10 bg-white border-b">
              <div className="flex justify-between items-center p-4">
                <h2 className="md:text-lg text-[14px] text-grey-300 font-bold">Notifications</h2>
                <button 
                  className="text-blue-600 hover:text-blue-800 md:text-base text-xs"
                  onClick={markAllAsRead}
                >
                  Mark all as read
                </button>
              </div>
            </div>

            {/* Notifications list */}
            <div className="divide-y">
              {notifications.map((notif) => (
                <div 
                  key={notif.id} 
                  className={`p-4 cursor-pointer transition-colors duration-200 ${
                    expandedId === notif.id ? 'bg-gray-100' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => toggleNotification(notif.id)}
                >
                  {expandedId === notif.id ? (
                    <div>
                      <p className="md:text-base text-sm font-semibold mb-2">Azuki #1</p>
                      <p className="mb-2 md:text-sm text-[10px]">You have received an offer of 100 MATIC</p>
                      <p className="md:text-sm text-[10px] text-gray-500 md:mb-2 mb-4">Expires in: 3 days</p>
                      {notif.buttons && (
                        <div className="flex space-x-2">
                          <Button ClassName="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors duration-200" actionLabel={notif.buttons.decline}/>               
                          <Button ClassName="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200" actionLabel={notif.buttons.accept}/>
                            
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex space-x-2 items-center">
                      <Image
                        src={img1}
                        alt="alt"
                        height={20}
                        width={20}
                      />
                      <div className="flex flex-col space-y-2">
                        <div className="md:text-sm text-xs font-semibold">Azuki #1</div>
                        <div className="md:text-xs text-[10px]">You have received an offer</div>
                      </div>
                      <div className="md:text-xs text-[10px] text-end text-gray-500">{notif.time}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}