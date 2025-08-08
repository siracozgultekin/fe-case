"use client";

import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import CollectionTable from "@/components/CollectionTable";

export default function CollectionsPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Yükleniyor...</div>;
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div>
      <CollectionTable />
    </div>
  );
}
