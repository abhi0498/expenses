"use client";
import RecordForm from "@/app/new/_record_form";
import BackButton from "@/components/BackButton";
import { Database } from "@/types/supabase";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiDelete, FiTrash, FiTrash2, FiXCircle } from "react-icons/fi";

type Expense = Database["public"]["Tables"]["expenses"]["Row"];
function Page({ params }: { params: { id: string } }) {
  const [expense, setExpense] = useState<Expense>({} as Expense);
  const navigation = useRouter();
  useEffect(() => {
    const fetchExpense = async () => {
      const { data, error } = await supabase
        .from("expenses")
        .select("*")
        .eq("id", params.id)
        .single();
      setExpense(data!);
    };
    fetchExpense();
  }, [params.id]);

  console.log(expense);

  const handleCLose = () => {
    const element = document.getElementById("my_modal_1")! as any;

    if (element.close) {
      element.close();
    }
  };
  return (
    <main className="p-6">
      <div className="flex items-center">
        <BackButton />
        <h1 className="text-4xl font-bold pl-4">Edit Expense</h1>
        <FiTrash2
          fontSize={24}
          className="ml-auto"
          onClick={() => {
            const element = document.getElementById("my_modal_1")! as any;

            if (element.showModal) {
              element.showModal();
            }
          }}
        />
      </div>

      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <div className="flex items-start justify-between">
            <h3 className="font-bold text-lg">Delete Expense</h3>

            <FiXCircle fontSize={20} onClick={handleCLose} />
          </div>
          <div className="py-4">
            <p>Are you sure you want to delete this expense?</p>
          </div>
          <div className="modal-action">
            <button
              className="btn btn-primary"
              onClick={async () => {
                handleCLose();
              }}
            >
              Cancel
            </button>
            <button
              className="btn bg-red-700"
              onClick={async () => {
                handleCLose();
                await supabase.from("expenses").delete().eq("id", expense.id);
                toast.success("Expense deleted successfully");
                navigation.back();
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </dialog>

      <RecordForm initialData={expense} />
    </main>
  );
}

export default Page;
