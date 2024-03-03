"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiBarChart,
  FiBarChart2,
  FiClock,
  FiHome,
  FiUser,
} from "react-icons/fi";
import { motion } from "framer-motion";

type MenuItem = {
  icon: JSX.Element;
  label: string;
  link: string;
};

const items: MenuItem[] = [
  {
    label: "Dashboard",
    icon: <FiBarChart2 fontSize={20} />,
    link: "/",
  },
  {
    label: "History",
    icon: <FiClock fontSize={20} />,
    link: "/history",
  },
  {
    label: "Profile",
    icon: <FiUser fontSize={20} />,
    link: "/profile",
  },
];
const pathsToHide = ["/new", "/login", "/signup"];
const BottomNav = () => {
  const currentPath = usePathname();
  if (pathsToHide.includes(currentPath)) return null;
  return (
    <div className="btm-nav">
      {items.map((item, index) => (
        <Link href={item.link} key={index}>
          {currentPath === item.link && (
            <motion.div
              className="active"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              exit={{ width: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                height: 2,
                backgroundColor: "#fff",
              }}
            />
          )}
          <motion.button
            className="flex flex-col items-center justify-center w-full h-12"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {item.icon}
            <span className="btm-nav-label">{item.label}</span>
          </motion.button>
        </Link>
      ))}
    </div>
  );
};

export default BottomNav;
