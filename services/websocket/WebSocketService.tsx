import { io, ManagerOptions, Socket, SocketOptions } from "socket.io-client";

export class WebSocketService {
  private socket: Socket | null = null;
  private connectionTimeout: NodeJS.Timeout | null = null;

  connect(url: string, token: string, delayMs: number = 1000): Socket {
    this.disconnect();

    const options: Partial<ManagerOptions & SocketOptions> = {
      transports: ["websocket"],
      auth: {
        token: `Bearer ${token}`,
      },
      autoConnect: false,
    };

    this.socket = io(url, options);
    this.setupListeners();

    this.connectionTimeout = setTimeout(() => {
      if (this.socket && !this.socket.connected) {
        this.socket.connect();
      }
    }, delayMs);

    return this.socket;
  }

  private setupListeners() {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      console.log("Connected to WebSocket server", this.socket?.id);
      this.clearTimeout();
    });

    this.socket.on("disconnect", (reason) => {
      console.log("Disconnected from WebSocket server:", reason);
      this.clearTimeout();
    });

    this.socket.on("connect_error", (err) => {
      console.error("WebSocket connect error:", err.message);
      this.clearTimeout();
    });
  }

  private clearTimeout(): void {
    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout);
      this.connectionTimeout = null;
    }
  }

  disconnect(): void {
    this.clearTimeout();

    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }
}
