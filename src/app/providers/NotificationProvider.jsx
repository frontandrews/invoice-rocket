'use client'
import React, { Fragment, createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Transition } from '@headlessui/react'
import { CheckCircleIcon } from '@heroicons/react/24/outline'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { XMarkIcon } from '@heroicons/react/20/solid'

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((notification) => {
    setNotifications((prevNotifications) => [
      ...prevNotifications, 
      { ...notification, id: notification.id || Date.now() }
    ]);
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prevNotifications) => prevNotifications.filter((notification) => notification.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
      <div className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:p-6">
        <div className="w-full flex-col-reverse flex items-end space-y-16 space-y-reverse">
          {notifications.map((notification) => (
            <Toast key={notification.id} {...notification} removeNotification={removeNotification} />
          ))}
        </div>
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within a NotificationProvider');
  return context;
};

const Toast = ({ id = Date.now(), title, message, type, duration = 2000, removeNotification }) => {
  const [show, setShow] = useState(true);

  // Timer to automatically remove the notification after the duration
  useEffect(() => {
    const timerId = setTimeout(() => {
      setShow(false);
      removeNotification(id);
    }, duration);

    return () => clearTimeout(timerId);
  }, [id, duration, removeNotification]);

  const GetIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="h-6 w-6 text-green-400" aria-hidden="true" />;
      case 'error':
        return <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
      default:
        return null;
    }
  }

  return (
    <div
      aria-live="assertive"
      className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-end sm:p-6"
    >
      <div className="flex w-full items-center space-y-4 sm:items-end sm:space-y-0 flex-col-reverse">
        <Transition
          show={show}
          as={Fragment}
          enter="transform ease-out duration-300 transition"
          enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
          enterTo="translate-y-0 opacity-100 sm:translate-x-0"
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
            <div className="p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <GetIcon />
                </div>
                <div className="ml-3 w-0 flex-1 pt-0.5">
                  <p className="text-sm font-medium text-gray-900">{title}</p>
                  <p className="mt-1 text-sm text-gray-500">{message}</p>
                </div>
                <div className="ml-4 flex flex-shrink-0">
                  <button
                    type="button"
                    className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
                    onClick={() => {
                      setShow(false);
                      removeNotification(id); // also remove notification when the close button is clicked
                    }}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  )
};
