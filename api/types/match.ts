// src/types/match.ts

export enum MatchStatus {
  LIVE = "LIVE",
  COMPLETED = "COMPLETED",
  SCHEDULED = "SCHEDULED",
  CANCELED = "CANCELED",
}

export interface Team {
  id: number;
  name: string;
  logoUrl?: string;
}

export interface League {
  id: number;
  name: string;
  country?: string;
}

export interface Match {
  id: number;
  externalId: string;
  title: string;
  league: League;
  leagueId: number;
  teamHome: Team;
  teamHomeId: number;
  teamAway: Team;
  teamAwayId: number;
  scoreHome?: string;
  scoreAway?: string;
  winnerTeamId?: number;
  loserTeamId?: number;
  resultText?: string;
  info?: string;
  status: MatchStatus;
  startTime: Date;
}
