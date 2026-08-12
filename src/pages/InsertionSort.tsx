import InsertionSortVisualizer from "../components/InsertionSortVisualizer";

export default function InsertionSort() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto w-full max-w-[1500px] px-3 py-4 sm:px-5 lg:px-6">
        <InsertionSortVisualizer />
      </div>
    </div>
  );
}