import { GameRouter } from "@/components";
import { GameSessionProvider } from "@/state";

export default function Home() {
  return (
    <GameSessionProvider>
      <GameRouter />
    </GameSessionProvider>
  );
}
