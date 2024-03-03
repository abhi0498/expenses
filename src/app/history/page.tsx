"use client";
import AddButton from "@/components/AddButton";
import supabaseServerComponentClient from "@/utils/supabase/server";
import React, { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { supabase } from "@/utils/supabase/client";
import { Database } from "@/types/supabase";
import { User } from "@supabase/supabase-js";
import Loader from "@/components/Loader";
import { FiEdit, FiXCircle } from "react-icons/fi";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type Expense = Database["public"]["Tables"]["expenses"]["Row"] & {
  category: {
    name: string;
  };
};

const History = () => {
  const [user, setUser] = useState<User>();
  const [expenses, setExpenses] = useState<Array<Expense>>([]);
  const [budget, setBudget] = useState<
    Database["public"]["Tables"]["budget"]["Row"] | null
  >(null);
  const [month, setMonth] = useState(dayjs().month());
  const [year, setYear] = useState(dayjs().year());
  const [sort, setSort] = useState<"asc" | "desc">("desc");
  const [loading, setLoading] = useState(true);

  const navigation = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user!);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchExpenses = async () => {
      setLoading(true);
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

      const budget = await supabase
        .from("budget")
        .select("*")
        .eq("user_id", user?.id!)
        .eq("month", month)
        .eq("year", year)
        .single();

      setBudget(budget.data);

      setExpenses(expenses as Array<Expense>);
      setLoading(false);
    };
    if (user?.id) fetchExpenses();
  }, [user?.id, month, year, sort]);

  const totalMonthExpense = useMemo(() => {
    return expenses.reduce((acc, expense) => acc + expense.price, 0);
  }, [expenses]);

  const groupedExpensesByDate = useMemo(() => {
    return expenses.reduce((acc, expense) => {
      const date = dayjs(expense.date).format("DD-MM-YYYY");
      if (!acc[date]) acc[date] = [];
      acc[date].push(expense);
      return acc;
    }, {} as Record<string, Array<Expense>>);
  }, [expenses]);

  const balance = useMemo(
    () => (budget?.amount ? (budget?.amount || 0) - totalMonthExpense : 0),
    [budget?.amount, totalMonthExpense]
  );

  return (
    <main className="p-6">
      {loading && <Loader />}
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
      <h2 className="text-xl font-bold mt-4">
        Total Spendings: ₹{totalMonthExpense.toFixed(2)}
      </h2>
      <div className="flex gap-5 mt-4 items-center justify-between">
        <div className="flex flex-col gap-2 ">
          <h2 className="text-xl font-bold">
            Budget:{" "}
            {budget?.amount ? (
              <> ₹{budget?.amount?.toFixed(2)}</>
            ) : (
              <>Not Set</>
            )}
          </h2>
          {budget?.amount ? (
            <h2
              className={`text-xl font-bold ${
                balance < 0 ? "text-red-500" : "text-green-500"
              }`}
            >
              Balance: ₹{balance.toFixed(2)}
            </h2>
          ) : null}
        </div>

        <button
          className="btn btn-primary"
          onClick={() => {
            const element = document.getElementById("my_modal_1")! as any;

            if (element.showModal) {
              element.showModal();
            }
          }}
        >
          Set Budget
        </button>
      </div>

      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <div className="flex items-start justify-between">
            <h3 className="font-bold text-lg">Set Budget</h3>

            <FiXCircle
              fontSize={20}
              onClick={() => {
                const element = document.getElementById("my_modal_1")! as any;

                if (element.close) {
                  element.close();
                }
              }}
            />
          </div>
          <div className="py-4">
            <input
              placeholder="Enter Budget"
              className="input input-bordered w-full"
              name="budget"
              type="number"
              id="budget"
            />
          </div>
          <div className="modal-action">
            <button
              className="btn btn-primary"
              onClick={async () => {
                const element = document.getElementById("my_modal_1")! as any;

                if (element.close) {
                  element.close();
                }

                const newBudget = (
                  document.getElementById("budget") as HTMLInputElement
                )?.value;

                if (!newBudget) {
                  return toast.error("Please enter a valid budget amount");
                }

                if (!budget?.id) {
                  await supabase.from("budget").insert({
                    amount: Number(newBudget),
                    month,
                    year,
                    user_id: user?.id,
                  });
                } else {
                  await supabase
                    .from("budget")
                    .update({
                      amount: Number(newBudget),
                    })
                    .eq("id", budget?.id);
                }

                setBudget({
                  amount: Number(newBudget),
                  month,
                  year,
                  user_id: user?.id!,
                  id: 1,
                  created_at: new Date().toDateString(),
                });

                toast.success("Budget set successfully");
              }}
            >
              Set
            </button>
          </div>
        </div>
      </dialog>

      <div className="flex flex-col gap-5 mt-4 overflow-scroll h-[75vh] pb-24">
        {Object.entries(groupedExpensesByDate).map(([date, expenses]) => (
          <div
            key={date}
            className="flex flex-col gap-2 card shadow-xl p-4 bg-slate-800"
          >
            <div className="flex items-center justify-between py-2 border-b  dark:border-gray-200">
              <h3 className="text-xl font-bold text">{date}</h3>
              <span className="text-lg font-semibold">
                ₹
                {expenses
                  .reduce((acc, expense) => acc + expense.price, 0)
                  .toFixed(2)}
              </span>
            </div>
            {expenses.map((expense, index) => (
              <div
                key={expense.id}
                className="flex items-center justify-between py-2"
              >
                <div className="flex flex-col">
                  <span className="text-lg font-semibold">{expense.name}</span>
                  <span className="text-md font-medium">
                    {expense.category?.name}
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <FiEdit
                    fontSize={20}
                    onClick={() => {
                      navigation.push(`/edit/${expense.id}`);
                    }}
                  />
                  <span className="text-base font-semibold">
                    ₹{expense.price.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </main>
  );
};

export default History;
