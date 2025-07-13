'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import * as signalR from '@microsoft/signalr';


export const useSignalR = (hubUrl) => {
    
  const [connection, setConnection] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const connectionRef = useRef(null);

  const connect = useCallback(async () => {
    try {
      // Don't create a new connection if one already exists
      if (connectionRef.current) {
        console.log('Connection already exists, skipping...');
        return;
      }

      console.log('Creating new SignalR connection...');
      const hubConnection = new signalR.HubConnectionBuilder()
        .withUrl(hubUrl, {
          skipNegotiation: true,
          transport: signalR.HttpTransportType.WebSockets,
          withCredentials: false
        })
        .withAutomaticReconnect([0, 2000, 10000, 30000])
        .build();

      connectionRef.current = hubConnection;

      hubConnection.onclose((error) => {
        console.log('SignalR Connection closed:', error);
        setIsConnected(false);
        setError(error);
        connectionRef.current = null;
      });

      hubConnection.onreconnecting((error) => {
        console.log('SignalR Reconnecting:', error);
        setIsConnected(false);
      });

      hubConnection.onreconnected((connectionId) => {
        console.log('SignalR Reconnected:', connectionId);
        setIsConnected(true);
        setError(null);
      });

      console.log('Starting SignalR connection...');
      await hubConnection.start();
      console.log('SignalR connection started successfully');
      setIsConnected(true);
      setConnection(hubConnection);
      setError(null);
    } catch (err) {
      console.error('SignalR Connection failed:', err);
      setError(err);
      setIsConnected(false);
      connectionRef.current = null;
    }
  }, [hubUrl]);

  const disconnect = useCallback(async () => {
    if (connectionRef.current) {
      try {
        console.log('Stopping SignalR connection...');
        await connectionRef.current.stop();
        console.log('SignalR connection stopped successfully');
      } catch (err) {
        console.error('Error stopping SignalR connection:', err);
      } finally {
        setIsConnected(false);
        setConnection(null);
        connectionRef.current = null;
      }
    }
  }, []);

  const retryConnection = useCallback(async () => {
    console.log('Retrying SignalR connection...');
    setError(null);
    try {
      await disconnect();
      await connect();
    } catch (err) {
      console.error('Failed to retry connection:', err);
      setError(err);
    }
  }, [disconnect, connect]);

  const checkConnectionStatus = useCallback(() => {
    if (connectionRef.current) {
      console.log('Connection state:', connectionRef.current.state);
      console.log('Connection ID:', connectionRef.current.connectionId);
      return connectionRef.current.state;
    }
    return 'Disconnected';
  }, []);

  const sendMessage = useCallback(async (methodName, ...args) => {
    if (connectionRef.current && connectionRef.current.state === signalR.HubConnectionState.Connected) {
      try {
        console.log(`Sending message: ${methodName}`, args);
        // Ensure we're sending the correct format for SendLatLon
        if (methodName === 'SendLatLon' && args.length >= 3) {
          const [lat, lon, userName] = args;
          console.log(`Sending location: lat=${lat}, lon=${lon}, userName=${userName}`);
          await connectionRef.current.invoke(methodName, lat, lon, userName);
        } else {
          await connectionRef.current.invoke(methodName, ...args);
        }
        console.log(`Message sent successfully: ${methodName}`);
      } catch (err) {
        console.error('Error sending message:', err);
        setError(err);
      }
    } else {
      console.warn(`SignalR connection not available. State: ${connectionRef.current?.state}`);
    }
  }, []);

  const onMessage = useCallback((methodName, callback) => {
    if (connectionRef.current && connectionRef.current.state === signalR.HubConnectionState.Connected) {
      console.log(`Registering message handler: ${methodName}`);
      connectionRef.current.on(methodName, callback);
    } else {
      console.warn(`Cannot register message handler. Connection state: ${connectionRef.current?.state}`);
    }
  }, []);

  const offMessage = useCallback((methodName, callback) => {
    if (connectionRef.current) {
      console.log(`Removing message handler: ${methodName}`);
      connectionRef.current.off(methodName, callback);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    
    const initConnection = async () => {
      if (mounted) {
        try {
          await connect();
        } catch (err) {
          console.error('Failed to initialize connection:', err);
        }
      }
    };
    
    // Delay connection to ensure component is fully mounted
    const timer = setTimeout(initConnection, 100);
    
    return () => {
      mounted = false;
      clearTimeout(timer);
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    connection,
    isConnected,
    error,
    sendMessage,
    onMessage,
    offMessage,
    connect,
    disconnect,
    retryConnection,
    checkConnectionStatus,
    connectionState: connectionRef.current?.state || 'Disconnected'
  };
}; 