import { House, Dumbbell, CirclePlay, Clock, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function NavigationBar() {
  const location = useLocation();
  const selectedProgram = useSelector((state) => state.program.selectedProgram);

  const navItems = [
    { path: "/", label: "Home", icon: <House /> },
    {
      path: selectedProgram ? `/programs/${selectedProgram}` : "/onboarding",
      label: "Programs",
      icon: <Dumbbell />,
    },
    { path: "/workout", label: "Workout", icon: <CirclePlay /> },
    { path: "/history", label: "History", icon: <Clock /> },
    { path: "/profile", label: "Profile", icon: <User /> },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 w-full bg-[#0a0a0a]">
      <hr className="border-[#151A21]" />
      <div className="w-full md:w-[50%] mx-auto p-4">
        <div className="flex justify-between items-center relative">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 cursor-pointer ${
                location.pathname === item.path
                  ? "text-green-500"
                  : "text-gray-400"
              }`}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
