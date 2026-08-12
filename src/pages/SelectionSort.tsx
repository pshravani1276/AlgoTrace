import SelectionSortVisualizer from "../components/SelectionSortVisualizer";

export default function SelectionSort() {
  return (
    <div className="min-h-screen bg-slate-950 px-4 py-5">
      <div className="mx-auto w-full max-w-7xl">
        <SelectionSortVisualizer />
      </div>
    </div>
  );
}