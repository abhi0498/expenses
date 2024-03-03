import Link from "next/link";
import React from "react";
import { FiPlus } from "react-icons/fi";

const AddButton = () => {
  return (
    <Link
      style={{
        zIndex: 1000,
      }}
      href="/new"
      className="shadow-xl p-0 w-12 h-12 bg-primary rounded-full active:shadow-lg mouse transition ease-in duration-200 focus:outline-none absolute bottom-20 right-4 flex items-center justify-center"
    >
      <FiPlus className="text-white w-6 h-6" />
    </Link>
  );
};

export default AddButton;
