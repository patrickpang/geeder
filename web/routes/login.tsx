import { define } from "../utils.ts";
import LoginForm from "../islands/LoginForm.tsx";

export default define.page(function Login() {
  return (
    <main class="mx-16 lg:w-96 lg:mx-auto mt-16">
      <h1 class="font-bold text-xl mb-8">Login</h1>
      <LoginForm />
    </main>
  );
});
