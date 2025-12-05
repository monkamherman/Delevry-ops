declare module 'reconnecting-websocket' {
  import { Event, EventListener, WebSocket } from 'ws';

  type EventType = 'open' | 'close' | 'message' | 'error';

  interface Options {
    WebSocket?: typeof WebSocket;
    connectionTimeout?: number;
    debug?: boolean;
    maxReconnectionDelay?: number;
    maxRetries?: number;
    minReconnectionDelay?: number;
    reconnectionDelayGrowFactor?: number;
    minUptime?: number;
    timeoutInterval?: number;
    maxEnqueuedMessages?: number;
    startClosed?: boolean;
  }

  export default class ReconnectingWebSocket {
    constructor(url: string, protocols?: string | string[], options?: Options);
    static CONNECTING: 0;
    static OPEN: 1;
    static CLOSING: 2;
    static CLOSED: 3;
    url: string;
    readyState: number;
    bufferedAmount: number;
    protocol: string;
    onopen: EventListener | null;
    onclose: EventListener | null;
    onmessage: ((event: MessageEvent) => void) | null;
    onerror: EventListener | null;
    close(code?: number, reason?: string): void;
    send(data: string | ArrayBuffer | SharedArrayBuffer | Blob | ArrayBufferView): void;
    reconnect(code?: number, reason?: string): void;
    addEventListener(
      type: EventType,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | AddEventListenerOptions
    ): void;
    removeEventListener(
      type: EventType,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | EventListenerOptions
    ): void;
  }
}
