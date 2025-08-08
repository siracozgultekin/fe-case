import Link from "next/link";
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-96 p-8">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Sayfa Bulunamadı
        </h2>
        <p className="text-gray-600 mb-8 max-w-md">
          Aradığınız sayfa mevcut değil. URL i kontrol edin veya ana sayfaya
          dönün.
        </p>
        <div className="space-x-4">
          <Link
            href="/collections"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Koleksiyonlara Dön
          </Link>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Ana Sayfa
          </Link>
        </div>
      </div>
    </div>
  );
}
