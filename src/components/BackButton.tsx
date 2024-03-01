"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { FiArrowLeft } from "react-icons/fi";

const BackButton = () => {
  const navigation = useRouter();
  return (
    <FiArrowLeft
      className="text-4xl font-bold"
      onClick={() => {
        navigation.back();
      }}
    />
  );
};

export default BackButton;
