function Header() {
  return (
    <header className="h-16 border-b border-slate-800 bg-slate-950 flex items-center justify-between px-6">
      
      <div>
        <h1 className="text-xl font-bold text-indigo-400">
          AlgoTrace
        </h1>

        <p className="text-xs text-slate-500">
          Interactive Algorithm Visualizer
        </p>
      </div>

      <div className="text-sm text-slate-300">
        Bubble Sort
      </div>

    </header>
  )
}

export default Header