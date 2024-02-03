export default function Component() {
  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="flex items-center justify-between p-4">
        <h1 className="text-2xl font-bold">refresh</h1>
        <MenuIcon className="text-white" />
      </nav>
      <main className="flex flex-col items-center justify-center h-full gap-8 p-4">
        <div className="flex items-center justify-center w-full">
          <button className="bg-[#76ff03] text-black py-4 px-6 rounded-lg shadow-lg">DEMO WORK FLOW</button>
          <button className="ml-4 py-4 px-6 text-[#76ff03] border-2 border-[#76ff03] rounded-lg">NEW PROJECT</button>
        </div>
        <RefreshCwIcon className="text-[#76ff03]" />
      </main>
    </div>
  )
}

function MenuIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  )
}


function RefreshCwIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M8 16H3v5" />
    </svg>
  )
}
