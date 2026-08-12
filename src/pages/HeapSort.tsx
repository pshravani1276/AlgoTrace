import HeapSortVisualizer from "../components/HeapSortVisualizer";

export default function HeapSort() {
  return (
    <main
      className="
        min-h-screen
        bg-slate-950
        px-4
        py-5
        text-white
        sm:px-6
        lg:px-8
      "
    >
      <div className="mx-auto max-w-7xl">
        <HeapSortVisualizer />
      </div>
    </main>
  );
}