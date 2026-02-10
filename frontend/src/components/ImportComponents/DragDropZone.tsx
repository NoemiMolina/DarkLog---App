import React, { useRef, useState } from "react";
import Papa from "papaparse";
import { Upload, AlertCircle } from "lucide-react";
import type { PreviewResponse } from "./ImportModal";
import { API_URL } from '../../config/api';

interface DragDropZoneProps {
    userId: string;
    onPreviewReady: (preview: PreviewResponse) => void;
    onError: (error: string) => void;
}
interface CSVRow {
    Date?: string;
    Name?: string;
    Year?: string;
    "Letterboxd URI"?: string;
    Rating?: string;
    Review?: string;
    [key: string]: string | undefined;
}

export default function DragDropZone({
    userId,
    onPreviewReady,
    onError
}: DragDropZoneProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleFile = async (file: File) => {
        try {
            if (!file) {
                onError("No file provided");
                return;
            }

            if (!file.name.toLowerCase().endsWith(".csv")) {
                onError("The file must be a CSV (.csv)");
                return;
            }

            if (file.size === 0) {
                onError("The file is empty");
                return;
            }

            setIsLoading(true);
            return new Promise<void>((resolve, reject) => {
                Papa.parse<CSVRow>(file, {
                    header: true, 
                    skipEmptyLines: true, 
                    dynamicTyping: false, 
                    complete: async (results) => {
                        try {
                            const csvData = results.data
                                .filter((row) => row && row.Name && row.Year) 
                                .map((row) => ({
                                    name: row.Name?.trim() || "",
                                    year: parseInt(row.Year?.trim() || "0", 10),
                                    rating: parseFloat(row.Rating?.trim() || "0"),
                                    review: row.Review?.trim() || "",
                                    watchedDate: row["Watched Date"]?.trim() || ""
                                }))
                                .filter((film) => film.name && film.year > 1800 && film.year < 2100); 

                            if (csvData.length === 0) {
                                onError("The CSV file does not contain valid films");
                                setIsLoading(false);
                                resolve();
                                return;
                            }
                            console.log(`📊 ${csvData.length} films extracted from CSV`);
                            console.log("🎬 Films to process:");
                            csvData.slice(0, 10).forEach((film, idx) => {
                                console.log(`   ${idx + 1}. "${film.name}" (${film.year})`);
                            });
                            if (csvData.length > 10) {
                                console.log(`   ... and ${csvData.length - 10} more films`);
                            }
                            const response = await fetch(
                                `${API_URL}/import/letterboxd/preview`,
                                {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify({
                                        userId,
                                        csvData
                                    })
                                }
                            );

                            if (!response.ok) {
                                const errorData = await response.json();
                                throw new Error(
                                    errorData.message || "Error during preview"
                                );
                            }

                            const preview: PreviewResponse = await response.json();
                            onPreviewReady(preview);
                            setIsLoading(false);
                            resolve();
                        } catch (err) {
                            console.error("❌ Error:", err);
                            onError(
                                err instanceof Error ? err.message : "Error unknown"
                            );
                            setIsLoading(false);
                            reject(err);
                        }
                    },
                    error: (error: any) => {
                        console.error("❌ Error parsing CSV:", error);
                        onError(`Error parsing CSV: ${error.message}`);
                        setIsLoading(false);
                        reject(error);
                    }
                });
            });
        } catch (err) {
            console.error("❌ Error in handleFile:", err);
            onError(err instanceof Error ? err.message : "Unknown error");
            setIsLoading(false);
        }
    };
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.currentTarget.files;
        if (files && files.length > 0) {
            handleFile(files[0]);
        }
    };

    return (
        <div className="space-y-6">
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleClick}
                className={`
          relative border-2 border-dashed rounded-lg p-12 text-center
          transition-all cursor-pointer
          ${isDragging
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/10"
                        : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 bg-gray-50 dark:bg-gray-800/50"
                    }
        `}
            >
                {isLoading ? (
                    <div className="space-y-3">
                        <div className="inline-block">
                            <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-800 border-t-blue-500 rounded-full animate-spin" />
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 font-medium">
                            Processing your file...
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <div className="flex justify-center">
                            <Upload className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                        </div>
                        <div>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                📥 Drag your Letterboxd CSV file here
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                or <span className="text-blue-500 font-medium">click to browse</span>
                            </p>
                        </div>
                    </div>
                )}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileInputChange}
                    className="hidden"
                    disabled={isLoading}
                />
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-700 dark:text-blue-300">
                    <p className="font-semibold mb-1">📋 Expected format:</p>
                    <p className="text-xs">
                        Download your "Diary" list from Letterboxd and ensure the CSV contains the columns: <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">Name</code>,{" "}
                        <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">Year</code>,{" "}
                        <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">Rating</code>
                    </p>
                </div>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                    <span className="font-semibold">💡 Info:</span> Only movies of the{" "}
                    <span className="font-semibold">horror</span> genre will be imported.
                       <span className="font-semibold">Some horror movies have not been imported ?</span> use the contact form.
                </p>
            </div>
        </div>
    );
}
