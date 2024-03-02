import BackButton from "@/components/BackButton";
import RecordForm from "./_record_form";

const NewRecord = () => {
  return (
    <main className="p-6">
      <div className="flex items-center">
        <BackButton />
        <h1 className="text-4xl font-bold pl-4">New Entry</h1>
      </div>

      <RecordForm />
    </main>
  );
};

export default NewRecord;
