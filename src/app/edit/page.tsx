"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import EditingScreen from "@/components/EditingScreen";
import { Collection } from "@/types/collection";

function EditPageContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const collectionId = searchParams.get("id");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "loading") {
      return;
    }

    if (!collectionId) {
      router.push("/collections");
      return;
    }

    fetchCollection();
  }, [status, router, collectionId]);

  const fetchCollection = async () => {
    if (
      !(session as unknown as { accessToken: string })?.accessToken ||
      !collectionId
    ) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        `https://maestro-api-dev.secil.biz/Collection/GetAll`,
        {
          headers: {
            Authorization: `Bearer ${
              (session as unknown as { accessToken: string })?.accessToken
            }`,
          },
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const json = await res.json();

      if (json.error) {
        throw new Error(json.message || json.error);
      }

      const targetCollection = json.data?.find(
        (c: Collection) => c.id === parseInt(collectionId)
      );

      if (!targetCollection) {
        throw new Error("Koleksiyon bulunamadı");
      }

      setCollection(targetCollection);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Bilinmeyen bir hata oluştu"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push("/collections");
  };

  if (status === "loading" || loading) {
    return <div>Yükleniyor...</div>;
  }

  if (status === "unauthenticated") {
    return null;
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded">
          Koleksiyon yüklenirken hata oluştu: {error}
        </div>
        <button
          onClick={handleBack}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Koleksiyonlara Dön
        </button>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="p-4">
        <div className="mb-4 p-3 bg-yellow-100 text-yellow-700 border border-yellow-300 rounded">
          Koleksiyon bulunamadı
        </div>
        <button
          onClick={handleBack}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Koleksiyonlara Dön
        </button>
      </div>
    );
  }

  return <EditingScreen collection={collection} />;
}

export default function EditPage() {
  return (
    <Suspense fallback={<div>Sayfa yükleniyor...</div>}>
      <EditPageContent />
    </Suspense>
  );
}
