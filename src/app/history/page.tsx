import AddButton from "@/components/AddButton";
import React from "react";

const History = () => {
  return (
    <main className="p-6">
      <h1 className="text-4xl font-bold">History</h1>
      <AddButton />

      <div className="flex flex-col gap-2 mt-6">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-between py-4 border-t first:border-0 dark:border-gray-200"
          >
            <div className="flex flex-col">
              <span className="text-md font-medium">12th February 2023</span>
              <span className="text-md font-medium">Food</span>
            </div>
            <span className="text-base font-semibold">₹25.00</span>
          </div>
        ))}
      </div>
    </main>
  );
};

export default History;
