import { PointField } from "./PointField";

export function PointDashboard() {
  return (
    <div className="flex flex-col justify-center items-center w-full bg-amber-50 py-4 gap-2">
      <PointField kind="grass" />
      <PointField kind="mountain" />
      <PointField kind="field" />
      <PointField kind="building" />
      <PointField kind="water" />
      <PointField kind="animal" />
      <PointField kind="spirit" />
    </div>
  );
}