import { JSX } from "preact/jsx-runtime";

interface Payload {
  username: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
}

async function login(payload: Payload): Promise<LoginResponse | null> {
  try {
    const response = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify(payload),
      credentials: "same-origin",
    });
    if (!response.ok) {
      console.error({
        statusCode: response.status,
        error: await response.text(),
      });
      return null;
    }

    const data = (await response.json()) as LoginResponse;
    return data;
  } catch (error) {
    console.error({ error });
    return null;
  }
}

export default function LoginForm() {
  const onSubmit: JSX.SubmitEventHandler<HTMLFormElement> = async (
    e,
  ) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = (Object.fromEntries(formData) as object) as Payload;
    const response = await login(payload);
    if (response) {
      const { success } = response;
      if (success) {
        // redirect to home page and remove login page from history stack
        globalThis.location.replace("/");
      }
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <label class="input input-bordered flex items-center gap-2 mb-4">
        Username
        <input type="text" name="username" class="grow" required />
      </label>
      <label class="input input-bordered flex items-center gap-2 mb-4">
        Password
        <input type="password" name="password" class="grow" required />
      </label>
      <button
        type="submit"
        class="btn mt-4"
      >
        <span>Submit</span>
      </button>
    </form>
  );
}
