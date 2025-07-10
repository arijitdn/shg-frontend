export default function Footer() {
  return (
    <footer className="w-full px-4 py-5 mt-10 text-white bg-zinc-700">
      <div className="flex justify-between items-center max-sm:flex-col max-sm:gap-2.5 max-sm:text-center">
        <div className="flex items-center gap-6">
          <div>
            <img src="/nic-logo.png" alt="NIC Logo" className="h-8 w-auto" />
          </div>
          <div>
            <div className="mb-1.5 text-xs">
              Website Designed, Developed, hosted and maintained by National
              Informatics Centre
            </div>
            <div className="text-xs">
              <span>{new Date().toDateString()}</span>
              <span> | Copyright © {new Date().getFullYear()}</span>
            </div>
          </div>
        </div>
        <div>
          <div className="text-xs">
            <span>Privacy Policy</span>
            <span> | Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
