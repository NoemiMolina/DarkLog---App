import { CheckCircle, XCircle } from "lucide-react";
import type { PreviewResponse } from "./ImportModal";

interface PreviewResultsProps {
    preview: PreviewResponse;
    onConfirm: () => void;
    onCancel: () => void;
    isLoading: boolean;
}

export default function PreviewResults({
    preview,
    onConfirm,
    onCancel,
    isLoading
}: PreviewResultsProps) {
    const { found, notFound, summary } = preview;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total CSV</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        {summary.totalInCSV}
                    </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center border border-green-200 dark:border-green-800">
                    <p className="text-sm text-green-700 dark:text-green-300">✅ Found</p>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                        {summary.found}
                    </p>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 text-center border border-red-200 dark:border-red-800">
                    <p className="text-sm text-red-700 dark:text-red-300">❌ Not Found</p>
                    <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                        {summary.notFound}
                    </p>
                </div>
            </div>
            {notFound.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800 px-4 py-3">
                        <h3 className="font-semibold text-red-900 dark:text-red-100 flex items-center gap-2">
                            <XCircle className="w-5 h-5" />
                            Films non trouvés ({notFound.length})
                        </h3>
                    </div>
                    <div className="p-4">
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {notFound.map((film, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/10 rounded border border-red-200 dark:border-red-800"
                                >
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {film.name} <span className="text-gray-500">({film.year})</span>
                                        </p>
                                        <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                                            {film.reason === "not_horror"
                                                ? "❌ Pas du genre horreur"
                                                : "❌ Film non trouvé en base"}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            {found.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="bg-green-50 dark:bg-green-900/20 border-b border-green-200 dark:border-green-800 px-4 py-3">
                        <h3 className="font-semibold text-green-900 dark:text-green-100 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5" />
                            Found Films ({found.length})
                        </h3>
                    </div>
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {found.map((film, idx) => (
                            <div
                                key={idx}
                                className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-900 dark:text-white">
                                            {film.name} <span className="text-gray-500">({film.year})</span>
                                        </p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <div className="flex gap-1">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <span
                                                        key={i}
                                                        className={`text-lg ${i < Math.floor(film.rating)
                                                            ? "text-yellow-400"
                                                            : i < film.rating
                                                                ? "text-yellow-300"
                                                                : "text-gray-300"
                                                            }`}
                                                    >
                                                        ★
                                                    </span>
                                                ))}
                                            </div>
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                {film.rating}/5
                                            </span>
                                        </div>
                                        {film.review && (
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 italic">
                                                "{film.review}"
                                            </p>
                                        )}
                                        <div className="flex items-center gap-2 mt-3">
                                            {film.status === "new" ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                                                    🆕 New
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300">
                                                    🔄 Updated
                                                    {film.oldRating && (
                                                        <span className="ml-1">
                                                            ({film.oldRating}/5 → {film.rating}/5)
                                                        </span>
                                                    )}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <div className="flex gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                    onClick={onCancel}
                    disabled={isLoading}
                    className={`
            px-6 py-2 rounded-lg font-medium transition-colors
            ${isLoading
                            ? "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
                        }
          `}
                >
                    Cancel
                </button>

                <button
                    onClick={onConfirm}
                    disabled={isLoading || found.length === 0}
                    className={`
            px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2
            ${isLoading || found.length === 0
                            ? "bg-blue-200 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400 cursor-not-allowed"
                            : "bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg"
                        }
          `}
                >
                    {isLoading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
                            Importing...
                        </>
                    ) : (
                        <>✓ Confirm Import ({found.length} films)</>
                    )}
                </button>
            </div>
        </div>
    );
}
