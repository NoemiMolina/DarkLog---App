import { CheckCircle } from "lucide-react";
import type { ConfirmationStats } from "./ImportModal";

interface ConfirmationStepProps {
  isLoading: boolean;
  successMessage?: string;
  stats?: ConfirmationStats;
  onClose?: () => void;
}

export default function ConfirmationStep({
  isLoading,
  successMessage,
  stats,
  onClose,
}: ConfirmationStepProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 border-t-blue-500 rounded-full animate-spin mb-4" />
        <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
          Importing...
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Please wait, this should not take long
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
        </div>
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          🎉 Import successful!
        </h3>
        {successMessage && (
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {successMessage}
          </p>
        )}
      </div>
      {stats && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 space-y-4">
          <h4 className="font-semibold text-gray-900 dark:text-white text-center mb-4">
            📊 Your statistics have been updated
          </h4>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                {stats.numberOfWatchedMovies}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Movies watched
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                {stats.averageMovieRating.toFixed(1)}/5
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Average rating
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {Math.round(stats.totalWatchTime / 60)}h
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Total watch time
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="flex justify-center pt-4">
        <button
          onClick={onClose}
          className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg"
        >
          ✓ Close
        </button>
      </div>
    </div>
  );
}
