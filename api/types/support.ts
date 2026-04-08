export type SupportTicketStatus = "open" | "in_progress" | "resolved";

export interface SupportTicket {
  id: string;
  title: string;
  details: string;
  status: SupportTicketStatus;
  adminResponse?: string | null;
  respondedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  anonymous: boolean;
  contactEmail?: string | null;
  anonymousAccessToken?: string;
}

export interface CreateSupportTicketRequest {
  title: string;
  details: string;
  anonymous: boolean;
}

export interface CreateAnonymousSupportRequest {
  title: string;
  details: string;
  contactEmail: string;
}

export interface CreateAnonymousSupportResponse {
  id: string;
  anonymous: true;
  status: SupportTicketStatus;
  anonymousAccessToken: string;
}
