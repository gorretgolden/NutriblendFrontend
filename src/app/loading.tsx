import SpinnerbLoader from "@/components/ui/SpinnerbLoader";

export default function Loading() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="flex flex-col items-center gap-4">
                <SpinnerbLoader className="w-12 h-12 border-4 border-green-200 border-r-green-600" />
                <p className="text-gray-500 font-medium animate-pulse">Loading NutriBlend Haven...</p>
            </div>
        </div>
    );
}
