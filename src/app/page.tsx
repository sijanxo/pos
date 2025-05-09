"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div>
      <h1>POS System</h1>
      <button
        onClick={() => {
          router.push("/login");
        }}
      >
        Login
      </button>
    </div>
  );
}
