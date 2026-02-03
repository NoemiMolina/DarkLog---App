import { useState } from "react";
import { X } from "lucide-react";
import { API_URL } from '../../config/api';
import DragDropZone from "./DragDropZone";
import PreviewResults from "./PreviewResults";
import ConfirmationStep from "./ConfirmationStep";
import RatingSkulls from "../HomePageComponents/RatingSkulls";

type ModalStep = "drag-drop" | "preview" | "confirming" | "success";

export interface FoundFilm {
    name: string;
    year: number;
    tmdbId: number;
    rating: number;
    review: string;
    runtime: number;
    status: "new" | "update";
    oldRating?: number;
}

export interface NotFoundFilm {
    name: string;
    year: number;
    reason: "not_in_database" | "not_horror";
}

export interface PreviewResponse {
    found: FoundFilm[];
    notFound: NotFoundFilm[];
    summary: {
        totalInCSV: number;
        found: number;
        notFound: number;
    };
}

export interface ConfirmationStats {
    numberOfWatchedMovies: number;
    averageMovieRating: number;
    totalWatchTime: number;
}

interface ImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
    onSuccess?: (stats: ConfirmationStats) => void;
}

export default function ImportModal({
    isOpen,
    onClose,
    userId,
    onSuccess
}: ImportModalProps) {
    const [step, setStep] = useState<ModalStep>("drag-drop");
    const [previewData, setPreviewData] = useState<PreviewResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [defaultRating, setDefaultRating] = useState<number>(3);
    const handlePreviewReady = (preview: PreviewResponse) => {
        setPreviewData(preview);
        setStep("preview");
        setError(null);
    };

    const handleError = (errorMessage: string) => {
        console.error("❌ Error:", errorMessage);
        setError(errorMessage);
    };

    const handleConfirmImport = async () => {
        if (!previewData || previewData.found.length === 0) {
            setError("No films to import");
            return;
        }

        setStep("confirming");
        setIsLoading(true);

        try {

            const filmsToImport = previewData.found.map((film) => ({
                tmdbId: film.tmdbId,
                title: film.name,
                rating: defaultRating,
                review: film.review,
                runtime: film.runtime
            }));

            const response = await fetch(`${API_URL}/import/letterboxd/confirm`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userId,
                    filmsToImport
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error during confirmation");
            }

            const result = await response.json();
            setSuccessMessage(
                `${result.imported} new films imported, ${result.updated} updates made`
            );
            if (onSuccess) {
                onSuccess(result.stats);
            }
            setStep("success");
        } catch (err) {
            console.error("❌ Error during confirmation:", err);
            setError(err instanceof Error ? err.message : "Unknown error");
            setStep("preview");
        } finally {
            setIsLoading(false);
        }
    };
    const handleClose = () => {
        setStep("drag-drop");
        setPreviewData(null);
        setError(null);
        setSuccessMessage("");
        onClose();
    };
    const handleReset = () => {
        setStep("drag-drop");
        setPreviewData(null);
        setError(null);
        setSuccessMessage("");
    };

    if (!isOpen) return null;

    return (
        <>
            <div
                className="fixed inset-0 z-40 transition-opacity bg-black/70 backdrop-blur-sm"
                onClick={handleClose}
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div
                    className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl shadow-2xl"
                    style={{ boxShadow: '0 8px 32px 0 rgba(0,0,0,0.37)', border: '1px solid rgba(255,255,255,0.12)' }}
                >
                    <div className="flex items-center justify-between p-6 border-b border-white/10 sticky top-0 bg-black/60 backdrop-blur-xl rounded-t-2xl">
                        <h2 className="text-2xl font-bold text-white drop-shadow">
                            {step === "drag-drop" && "📥 Import from Letterboxd"}
                            {step === "preview" && "✅ Import Preview"}
                            {step === "confirming" && "⏳ Importing..."}
                            {step === "success" && "🎉 Success!"}
                        </h2>
                        <button
                            onClick={handleClose}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="p-6">
                        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
                            <p className="text-sm font-semibold text-amber-900 dark:text-amber-100 mb-3">
                                ⚠️ Films will be imported without ratings
                            </p>
                            <p className="text-sm text-amber-800 dark:text-amber-200 mb-4">
                                Choose a default rating to apply to all imported films:
                            </p>
                            <div className="flex items-center gap-3">
                                <RatingSkulls
                                    value={defaultRating}
                                    onChange={setDefaultRating}
                                />
                                <span className="text-sm font-medium text-amber-900 dark:text-amber-100 ml-2">
                                    {defaultRating.toFixed(1)}/5
                                </span>
                            </div>
                        </div>
                        {step === "drag-drop" && (
                            <DragDropZone
                                userId={userId}
                                onPreviewReady={handlePreviewReady}
                                onError={handleError}
                            />
                        )}
                        {step === "preview" && previewData && (
                            <PreviewResults
                                preview={previewData}
                                onConfirm={handleConfirmImport}
                                onCancel={handleReset}
                                isLoading={isLoading}
                            />
                        )}
                        {step === "confirming" && (
                            <ConfirmationStep isLoading={true} />
                        )}
                        {step === "success" && (
                            <ConfirmationStep
                                isLoading={false}
                                successMessage={successMessage}
                                onClose={handleClose}
                            />
                        )}
                        {error && (
                            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                <p className="text-red-700 dark:text-red-200">❌ {error}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
