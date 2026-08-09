import type { BoardSide, Player, ScoreBreakdown } from "@/types";
import { calculateScore } from "./scoring";

export interface PlayerStanding {
  player: Player;
  score: ScoreBreakdown;
}

export interface RankedPlayer extends PlayerStanding {
  /** Posición 1-based. Los empates comparten posición y saltan la siguiente (1, 2, 2, 4). */
  position: number;
  /** Otro jugador tiene exactamente el mismo total. */
  tied: boolean;
}

export function calculateStandings(players: Player[], boardSide: BoardSide): PlayerStanding[] {
  return players.map((player) => ({
    player,
    score: calculateScore(player.sheet, boardSide),
  }));
}

/**
 * Ordena por total descendente. No se aplica ningún criterio de desempate: el
 * reglamento oficial no está verificado en este punto, así que los empates se
 * muestran como tales en lugar de inventar un ganador.
 */
export function rankPlayers(players: Player[], boardSide: BoardSide): RankedPlayer[] {
  const standings = calculateStandings(players, boardSide);
  const sorted = [...standings].sort((a, b) => b.score.total - a.score.total);

  return sorted.map((standing) => ({
    ...standing,
    position: sorted.filter((other) => other.score.total > standing.score.total).length + 1,
    tied: sorted.some(
      (other) =>
        other.player.id !== standing.player.id && other.score.total === standing.score.total,
    ),
  }));
}
