import { PointField } from "./PointField";

export function PointDashboard() {
  return (
    <div className="flex flex-col justify-center items-center w-full bg-amber-50 py-4 gap-2">
      <PointField terrain="grass" />
      <PointField terrain="mountain" />
      <PointField terrain="field" />
      <PointField terrain="building" />
      <PointField terrain="water" />
    </div>
  );
}