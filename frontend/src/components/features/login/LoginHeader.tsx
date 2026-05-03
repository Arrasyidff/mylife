export default function LoginHeader() {
  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="flex items-center justify-between px-6 md:px-20 h-14">
        <span className="text-base font-bold tracking-tight text-foreground">
          FocusTrack
        </span>
        <button
          className="material-symbols-outlined text-muted-foreground hover:text-foreground hover:bg-muted transition-all p-2 rounded-full text-xl"
          data-icon="help_outline"
        >
          help_outline
        </button>
      </div>
    </header>
  )
}
