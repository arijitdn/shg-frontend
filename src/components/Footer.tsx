export default function Footer() {
  return (
    <footer className="px-4 py-5 mt-10 text-white bg-zinc-700">
      <div className="flex justify-between items-center max-sm:flex-col max-sm:gap-2.5 max-sm:text-center">
        <div>
          <div className="mb-1.5 text-xs">
            Website Designed, Developed, hosted and maintained by National
            Informatics Centre
          </div>
          <div className="text-xs">
            <span>{new Date().toLocaleDateString()}</span>
            <span> | Copyright © 2024</span>
          </div>
        </div>
        <div className="h-10 text-xs bg-white rounded font-[bold] text-zinc-700 w-[60px] flex items-center justify-center">
          NIC
        </div>
      </div>
    </footer>
  );
}
