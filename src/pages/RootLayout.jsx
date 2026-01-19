import { Outlet } from "react-router-dom";

function RootLayout() {
  return (
    <div className="h-screen overflow-hidden bg-slate-950 text-slate-50">
      <Outlet />
    </div>
  );
}

export default RootLayout;
