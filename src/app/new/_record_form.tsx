"use client";
import { Database } from "@/types/supabase";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import React, { use, useEffect } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import toast from "react-hot-toast";

type TextInputProps = {
  label: string;
  placeholder: string;
  name: string;
} & React.HTMLProps<HTMLInputElement>;

const TextInput = ({ label, placeholder, ...props }: TextInputProps) => {
  const formMethods = useFormContext();

  return (
    <div className="flex gap-2 flex-col">
      <label className="text-lg font-bold">{label}</label>
      <input
        {...formMethods.register(props.name, { required: true })}
        type="text"
        placeholder={placeholder}
        className="p-4 border border-gray-200 rounded-lg w-full"
        // {...formMethods.register(props.name)}
        {...props}
      />
    </div>
  );
};

const RecordForm = () => {
  const navigation = useRouter();
  const formMethods = useForm();
  const formMethodsDialog = useForm();

  const [categories, setCategories] = React.useState<
    Array<Database["public"]["Tables"]["categories"]["Row"]>
  >([]);

  const fetchCategories = async () => {
    const userId = (await supabase.auth.getUser())?.data?.user?.id;
    const response = await supabase
      ?.schema("public")
      .from("categories")
      ?.select()
      .or(`is_global.eq.TRUE,created_by.eq.${userId}`);

    setCategories(response?.data!);
  };
  useEffect(() => {
    fetchCategories();
  }, []);

  const onSubmit = async (data: any) => {
    toast.promise(supabase.from("expenses").insert([data]) as any, {
      loading: "Adding expense...",
      success: "Expense added successfully",
      error: "Failed to add expense",
    });
    navigation.prefetch("/history");
    navigation.back();
  };

  return (
    <>
      <FormProvider {...formMethods}>
        <div className="flex flex-col mt-6 gap-4">
          <TextInput
            name="date"
            label="Date"
            placeholder="Enter date"
            type={"date"}
          />
          <TextInput name="name" label="Name" placeholder="Enter name" />
          <TextInput
            name="price"
            label="Price"
            placeholder="Enter price"
            type="number"
          />
          <div className="flex gap-2 flex-col">
            <label className="text-lg font-bold">Category</label>
            <select
              className="select select-bordered border border-gray-200 rounded-lg"
              onChange={(event) => {
                formMethods.setValue("category_id", event.target.value);
              }}
            >
              <option disabled selected>
                Select Category
              </option>
              {categories.map((category) => (
                <option value={category.id} key={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <button
              className="text-primary ml-auto w-fit"
              onClick={() => {
                const element = document.getElementById("my_modal_1")! as any;

                if (element.showModal) {
                  element.showModal();
                }
              }}
            >
              Add Category
            </button>
          </div>
          {/* <TextInput label="Category" placeholder="Enter category" /> */}
        </div>

        <div className="p-4 absolute bottom-10 left-0 px-8 w-full">
          <button
            className="text-white text-lg font-bold w-full h-12 rounded-lg bg-primary"
            onClick={formMethods.handleSubmit(onSubmit)}
          >
            Add
          </button>
        </div>
      </FormProvider>

      <dialog id="my_modal_1" className="modal">
        <FormProvider {...formMethodsDialog}>
          <div className="modal-box">
            <h3 className="font-bold text-lg">Add Category</h3>
            <div className="py-4">
              <TextInput
                name="name"
                label="Name"
                placeholder="Enter name"
                type="text"
              />
            </div>
            <div className="modal-action">
              {/* if there is a button in form, it will close the modal */}

              <button
                className="btn"
                onClick={formMethodsDialog.handleSubmit(async (data) => {
                  toast.promise(
                    supabase.from("categories").insert([
                      {
                        name: data.name,
                      },
                    ]) as any,
                    {
                      loading: "Adding category...",
                      success: "Category added successfully",
                      error: "Failed to add category",
                    }
                  );

                  fetchCategories();
                  const element = document.getElementById("my_modal_1")! as any;

                  if (element.close) {
                    element.close();
                  }
                })}
              >
                Save
              </button>
            </div>
          </div>
        </FormProvider>
      </dialog>
    </>
  );
};

export default RecordForm;
