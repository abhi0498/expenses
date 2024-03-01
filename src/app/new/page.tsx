import BackButton from "@/components/BackButton";

type TextInputProps = {
  label: string;
  placeholder: string;
} & React.HTMLProps<HTMLInputElement>;

const TextInput = ({ label, placeholder, ...props }: TextInputProps) => {
  return (
    <div className="flex gap-2 flex-col">
      <label className="text-lg font-bold">{label}</label>
      <input
        type="text"
        placeholder={placeholder}
        className="p-4 border border-gray-200 rounded-lg"
        {...props}
      />
    </div>
  );
};

const NewRecord = () => {
  return (
    <main className="p-6">
      <div className="flex items-center">
        <BackButton />
        <h1 className="text-4xl font-bold pl-4">New Entry</h1>
      </div>

      <div className="flex flex-col mt-6 gap-4">
        <TextInput label="Date" placeholder="Enter date" type={"date"} />
        <TextInput label="Name" placeholder="Enter name" />
        <TextInput label="Price" placeholder="Enter price" />
        <TextInput label="Category" placeholder="Enter category" />
      </div>

      <div className="p-4 absolute bottom-10 left-0 px-8 w-full">
        <button className="text-white text-lg font-bold w-full h-12 rounded-lg bg-primary">
          Add
        </button>
      </div>
    </main>
  );
};

export default NewRecord;
