export default function HeaderSection() {
  return (
    <header className="overflow-hidden relative p-4 shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
      <div className="absolute inset-0 opacity-30 bg-[20px_20px]" />
      <img
        src="/banner.jpeg"
        className="object-cover overflow-hidden w-full aspect-square h-[120px]"
        alt="Header background"
      />
    </header>
  );
}
