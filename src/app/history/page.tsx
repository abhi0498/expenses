"use client";
import AddButton from "@/components/AddButton";
import supabaseServerComponentClient from "@/utils/supabase/server";
import React, { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { supabase } from "@/utils/supabase/client";
import { Database } from "@/types/supabase";
import { User } from "@supabase/supabase-js";

type Expense = Database["public"]["Tables"]["expenses"]["Row"] & {
  category: {
    name: string;
  };
};

const History = () => {
  const [user, setUser] = useState<User>();
  const [expenses, setExpenses] = useState<Array<Expense>>([]);
  const [month, setMonth] = useState(dayjs().month());
  const [year, setYear] = useState(dayjs().year());
  const [sort, setSort] = useState<"asc" | "desc">("desc");
  // const { data } = await supabase.auth.getUser();

  // const { data: expenses } = await supabase
  //   .from("expenses")
  //   .select("*, category:categories(name)")
  //   .eq("created_by", data.user?.id!)
  //   .order("date", { ascending: false });

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user!);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchExpenses = async () => {
      const { data: expenses } = await supabase
        .from("expenses")
        .select("*, category:categories(name)")
        .eq("created_by", user?.id!)
        .lte(
          "date",
          dayjs(`${year}-${month + 1}-01`)
            .endOf("month")
            .format("YYYY-MM-DD")
        )
        .gte(
          "date",
          dayjs(`${year}-${month + 1}-01`)
            .startOf("month")
            .format("YYYY-MM-DD")
        )
        .order("date", { ascending: sort === "asc" });

      setExpenses(expenses as Array<Expense>);
    };
    if (user?.id) fetchExpenses();
  }, [user?.id, month, year, sort]);

  const totalMonthExpense = useMemo(() => {
    return expenses.reduce((acc, expense) => acc + expense.price, 0);
  }, [expenses]);

  return (
    <main className="p-6">
      <h1 className="text-4xl font-bold">Monthly Expenses</h1>

      <div className="flex items-center gap-4 mt-6">
        <select
          className="input input-bordered"
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i} value={i}>
              {dayjs().month(i).format("MMMM")}
            </option>
          ))}
        </select>
        <select
          className="input input-bordered"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
        >
          {Array.from({ length: 10 }, (_, i) => (
            <option key={i} value={dayjs().year() - i}>
              {dayjs().year() - i}
            </option>
          ))}
        </select>

        <select
          className="input input-bordered"
          value={sort}
          onChange={(e) => setSort(e.target.value as "asc" | "desc")}
        >
          <option value="asc">Oldest</option>
          <option value="desc">Latest</option>
        </select>
      </div>

      <AddButton />
      <h2 className="text-2xl font-bold mt-4">
        Total: ₹{totalMonthExpense.toFixed(2)}
      </h2>
      <div className="flex flex-col gap-2 mt-4 overflow-scroll h-[75vh] pb-24">
        {expenses?.map((expense, index) => (
          <div
            key={expense.id}
            className="flex items-center justify-between py-4 border-t first:border-0 dark:border-gray-200"
          >
            <div className="flex flex-col">
              <span className="text-md font-medium">
                {dayjs(expense.date).format("DD-MM-YYYY")}
              </span>
              <span className="text-md font-medium">
                {expense.category?.name}
              </span>
            </div>
            <span className="text-base font-semibold">
              ₹{expense.price.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </main>
  );
};

export default History;
