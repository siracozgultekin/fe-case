"use client";

import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Edit } from "@mui/icons-material";
import { Collection, Filter } from "@/types/collection";

export default function CollectionTable() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [page, setPage] = useState(0);
  const pageSize = 5;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (status === "loading") {
        return;
      }

      if (
        status === "unauthenticated" ||
        !(session as unknown as { accessToken: string })?.accessToken
      ) {
        setError("Oturum açmanız gerekiyor");
        setLoading(false);
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
                (session as unknown as { accessToken: string }).accessToken
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

        setCollections(json.data || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Bilinmeyen bir hata oluştu"
        );
        setCollections([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session, status]);

  const handleEdit = (collectionId: number) => {
    router.push(`/edit?id=${collectionId}`);
  };

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Başlık",
      minWidth: 120,
      flex: 1,
      renderCell: (params) => (
        <div className="flex h-full items-center">
          <span className="font-semibold text-sm ">{params.value}</span>
        </div>
      ),
    },
    {
      field: "filters",
      headerName: "Ürün Koşulları",
      minWidth: 250,
      flex: 2,
      renderCell: (params) => {
        const filters: Filter[] = params.row.filters?.filters ?? [];

        if (!filters || filters.length === 0) {
          return (
            <span className="text-sm text-gray-500">Manuel Koleksiyon</span>
          );
        }

        return (
          <div className="flex flex-col gap-1 py-1">
            {filters.map((f, index) => (
              <span key={index} className="text-sm">
                {`Ürün ${f.title} bilgisi Şuna Eşit: ${f.valueName}`}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      field: "salesChannelId",
      headerName: "Satış Kanalı",
      minWidth: 100,
      flex: 1,
      renderCell: (params) => (
        <div className="flex h-full items-center">
          <span className="flex items-center  h-full px-1 py-0.5 text-xs ">
            Satış Kanalı -{params.value}
          </span>
        </div>
      ),
    },
    {
      field: "actions",
      headerName: "İşlemler",
      width: 80,
      flex: 0.3,
      sortable: false,
      renderCell: (params) => (
        <div className="h-full flex items-center">
          <button
            onClick={() => handleEdit(params.row.id)}
            className=" p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="Sabitleri Düzenle"
          >
            <Edit
              className="w-4 h-4"
              onClick={() => handleEdit(params.row.id)}
            />
          </button>
        </div>
      ),
    },
  ];

  const rows = collections.map((item) => ({
    id: item.id,
    name: item.info.name,
    filters: item.filters,
    salesChannelId: item.salesChannelId,
  }));

  const pagedRows = rows.slice(page * pageSize, page * pageSize + pageSize);

  return (
    <div className="h-150 w-full overflow-hidden">
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded">
          Koleksiyonlar yüklenirken hata oluştu: {error}
        </div>
      )}

      <div className="w-full min-w-0">
        <DataGrid
          rows={pagedRows}
          columns={columns}
          paginationMode="server"
          rowCount={rows.length}
          loading={loading}
          paginationModel={{ page, pageSize }}
          onPaginationModelChange={(model) => {
            setPage(model.page);
          }}
          hideFooterSelectedRowCount
          disableRowSelectionOnClick
          autoHeight
          disableColumnResize
          getRowHeight={() => "auto"}
          className="[&_.MuiDataGrid-root]:overflow-x-auto [&_.MuiDataGrid-virtualScroller]:overflow-x-auto [&_.MuiDataGrid-row]:min-h-[72px] [&_.MuiDataGrid-cell]:py-3 [&_.MuiDataGrid-cell]:px-2 [&_.MuiDataGrid-cell]:border-b [&_.MuiDataGrid-cell]:border-gray-100 [&_.MuiDataGrid-columnHeaders]:bg-gray-50 [&_.MuiDataGrid-columnHeaders]:border-b-2 [&_.MuiDataGrid-columnHeaders]:border-gray-200 [&_.MuiDataGrid-columnHeaders]:min-h-[48px] [&_.MuiDataGrid-columnHeaderTitle]:text-sm [&_.MuiDataGrid-columnHeaderTitle]:font-medium"
        />
      </div>
    </div>
  );
}
