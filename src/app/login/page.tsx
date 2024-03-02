import AuthForm from "../auth-form";

export default function Home() {
  return (
    <main className="p-6">
      <div className="col-6 auth-widget p-6">
        <AuthForm />
      </div>
    </main>
  );
}
