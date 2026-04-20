export function DashboardHeader() {
  return (
    <header className="w-full px-6 pt-4">
      <div className="h-16 w-full rounded-2xl border flex items-center justify-between px-4">
        <span className="text-sm font-semibold">VorkSpace</span>

        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl border flex items-center justify-center">
            <span className="text-xs">🔍</span>
          </div>

          <div className="h-10 min-w-56 rounded-full border px-4 flex items-center justify-center">
            <span className="text-sm">10 of 12 on work</span>
          </div>

          <div className="h-10 min-w-28 rounded-full border px-4 flex items-center justify-center">
            <span className="text-sm">4 on break</span>
          </div>
        </div>

        {/* Right zone (account area) */}
        <div className="h-10 min-w-48 rounded-2xl border px-4 flex items-center justify-end gap-3">
          <div className="text-right leading-tight">
            <p className="text-sm font-medium">Andrea Obzerov</p>
            <p className="text-xs opacity-70">Admin</p>
          </div>
          <div className="h-8 w-8 rounded-full border" />
        </div>
      </div>
    </header>
  );
}
