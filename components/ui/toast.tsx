import React from 'react';
import toast, { Toaster } from 'react-hot-toast';

const Toast = () => {
    return (
        <Toaster
            position="top-right"
            toastOptions={{
                style: {
                    background: "#262626",
                    color: "#fff",
                },
                duration: 3000
            }}
        />
    );
};

export const triggerToast = (message: string) => {
    toast(message);
};

export default Toast;