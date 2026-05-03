import { LoginHeader, LoginForm } from "@/components/features/login";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <LoginHeader />
      <LoginForm />
    </div>
  );
}