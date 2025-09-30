import { useEffect, useRef } from 'react';

const useWebSocket = (url, onMessage) => {
    const socketRef = useRef(null);

    useEffect(() => {
        socketRef.current = new WebSocket(url);

        socketRef.current.onmessage = (event) => {
            onMessage(event.data);
        };

        socketRef.current.onclose = () => {
            console.log('WebSocket connection closed');
        };

        return () => {
            socketRef.current.close();
        };
    }, [url, onMessage]);

    return socketRef.current;
};

export const connectWebSocket = (url, onMessage) => {
    return useWebSocket(url, onMessage);
};