import { API_ORIGIN } from "@/constants/apiConfig";
import { store } from "@/store/store";
import { io, Socket } from "socket.io-client";

export type WsStatus = "disconnected" | "connecting" | "connected";

type Listener = (data: Record<string, unknown>) => void;

const MAX_PENDING_SENDS = 30;

class ChatSocket {
  private socket: Socket | null = null;
  private listeners = new Map<string, Set<Listener>>();
  private statusListeners = new Set<(status: WsStatus) => void>();
  private _status: WsStatus = "disconnected";
  private pendingJoinIds: string[] = [];
  private connectAttemptInFlight = false;
  private pendingSends: Record<string, unknown>[] = [];

  get status() {
    return this._status;
  }

  private setStatus(s: WsStatus) {
    this._status = s;
    this.statusListeners.forEach((fn) => fn(s));
  }

  private flushPendingJoin() {
    if (!this.socket?.connected || this.pendingJoinIds.length === 0) return;
    this.socket.emit("chat.join", { channel_ids: this.pendingJoinIds });
  }

  private flushPendingSends() {
    if (!this.socket?.connected || this.pendingSends.length === 0) return;
    const batch = this.pendingSends.splice(0, this.pendingSends.length);
    for (const data of batch) {
      const action = data.action as string;
      if (action) this.socket.emit(action, data);
    }
  }

  async connect() {
    if (this.socket?.connected) {
      this.flushPendingJoin();
      return;
    }
    if (this.connectAttemptInFlight) return;

    this.setStatus("connecting");
    this.connectAttemptInFlight = true;

    const token = store.getState().auth.accessToken;
    if (!token) {
      this.connectAttemptInFlight = false;
      this.setStatus("disconnected");
      return;
    }

    try {
      if (this.socket) {
        this.socket.removeAllListeners();
        this.socket.disconnect();
        this.socket = null;
      }

      this.socket = io(API_ORIGIN, {
        auth: {  
          token: `Bearer ${token}`,
        },
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 30000,
        reconnectionAttempts: Infinity,
      });

      this.socket.on("connect", () => {
        this.connectAttemptInFlight = false;
        this.setStatus("connected");
        this.flushPendingJoin();
        queueMicrotask(() => this.flushPendingSends());
      });

      this.socket.on("disconnect", () => {
        this.setStatus("disconnected");
      });

      this.socket.on("connect_error", () => {
        this.connectAttemptInFlight = false;
        this.setStatus("disconnected");
      });

      const eventTypes = [
        "chat.send.ack",
        "chat.message",
        "chat.typing",
        "chat.read",
        "chat.react",
        "chat.error",
        "chat.edit",
        "chat.delete",
        "chat.pin",
        "chat.system",
      ];
      for (const type of eventTypes) {
        this.socket.on(type, (payload: Record<string, unknown>) => {
          const data =
            typeof payload === "object" && payload !== null
              ? { ...payload, type }
              : {
                  type,
                  ...(typeof payload !== "undefined" ? { data: payload } : {}),
                };
          this.listeners.get(type)?.forEach((fn) => fn(data));
          this.listeners.get("*")?.forEach((fn) => fn(data));
        });
      }
    } catch {
      this.connectAttemptInFlight = false;
      this.setStatus("disconnected");
    }
  }

  disconnect() {
    this.connectAttemptInFlight = false;
    this.pendingSends = [];
    this.socket?.disconnect();
    this.socket?.removeAllListeners();
    this.socket = null;
    this.setStatus("disconnected");
  }

  send(data: Record<string, unknown>) {
    const action = data.action as string;
    if (!action) return false;

    if (this.socket?.connected) {
      this.socket.emit(action, data);
      return true;
    }

    if (this.pendingSends.length < MAX_PENDING_SENDS) {
      this.pendingSends.push(data);
    }
    return false;
  }

  /**
   * Remember channels and join as soon as the socket is connected (including reconnect).
   */
  joinChannels(channelIds: string[]) {
    this.pendingJoinIds =
      channelIds.length > 0 ? [...new Set(channelIds)] : [];
    this.flushPendingJoin();
  }

  on(type: string, fn: Listener) {
    if (!this.listeners.has(type)) this.listeners.set(type, new Set());
    this.listeners.get(type)!.add(fn);
    return () => {
      this.listeners.get(type)?.delete(fn);
    };
  }

  onStatus(fn: (status: WsStatus) => void) {
    this.statusListeners.add(fn);
    return () => {
      this.statusListeners.delete(fn);
    };
  }
}

export const chatWs = new ChatSocket();
