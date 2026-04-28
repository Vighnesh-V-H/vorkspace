"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Message } from "@/components/ui/message";
import { authClient } from "@/lib/auth/auth-client";
import { signUpSchema } from "@/lib/zod/auth/schema";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignUp() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<boolean>(false);

  const router = useRouter();

  const handleSignUp = async () => {
    setSuccess(false);
    setError(undefined);
    const data = signUpSchema.safeParse({ name, email, password });
    if (!data.success) {
      setError(data.error.issues.at(0)?.message);
      return;
    }

    const { error } = await authClient.signUp.email({
      email,
      name,
      password,
      callbackURL: "/auth/signin",
    });
    if (error) {
      setError(error?.message);
    } else {
      router.push("/auth/signin");
      setSuccess(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4 sm:p-8">
      <div className="flex w-full max-w-5xl bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden border border-zinc-800">
        <div className="hidden lg:block lg:w-1/2 relative bg-zinc-800">
          <Image
            src="/authimg.jpg"
            loading="eager"
            width={1100}
            height={100}
            alt="Sign In Background"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-zinc-900/30"></div>
        </div>
        <div className="w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto">
            <h1 className="text-3xl font-bold text-white mb-2">
              Create an account
            </h1>
            <p className="text-zinc-400 mb-8 text-sm">
              Please enter your details to sign up.
            </p>

            <form className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">
                  Name
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  placeholder="Your name"
                  className="bg-black border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-zinc-400"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">
                  Email
                </label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="name@example.com"
                  className="bg-black border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-zinc-400"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">
                  Password
                </label>
                <Input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="••••••••"
                  className="bg-black border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-zinc-400"
                />
              </div>

              <div className="pt-2">
                <div className="text-sm text-zinc-400 text-center mb-4">
                  Already have an account?{" "}
                  <Link
                    href="/auth/signin"
                    className="text-white hover:underline"
                  >
                    Sign in
                  </Link>
                </div>
                {error && <Message type="error">{error}</Message>}
                {success && (
                  <Message type="success">
                    successfully signed up , redirecting...
                  </Message>
                )}

                <Button
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSignUp();
                  }}
                  className="w-full bg-[#101010] text-white hover:bg-[#141414] font-semibold py-2.5 px-4 rounded-md transition-colors"
                >
                  Sign Up
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
