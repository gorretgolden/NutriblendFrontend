export default function Loading() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-frame px-4 py-6 md:py-8 animate-pulse">
                <div className="h-10 w-64 rounded-lg bg-gray-200 mb-6" />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="rounded-2xl border border-gray-200 bg-white p-5 space-y-4">
                            <div className="h-6 w-48 rounded bg-gray-200" />
                            <div className="h-12 w-full rounded-xl bg-gray-100" />
                            <div className="h-12 w-full rounded-xl bg-gray-100" />
                            <div className="h-28 w-full rounded-xl bg-gray-100" />
                        </div>

                        <div className="rounded-2xl border border-gray-200 bg-white p-5 space-y-4">
                            <div className="h-6 w-44 rounded bg-gray-200" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="h-12 rounded-xl bg-gray-100" />
                                <div className="h-12 rounded-xl bg-gray-100" />
                            </div>
                            <div className="h-12 w-full rounded-xl bg-gray-100" />
                        </div>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-5 h-fit space-y-4">
                        <div className="h-6 w-40 rounded bg-gray-200" />
                        <div className="h-16 w-full rounded-xl bg-gray-100" />
                        <div className="h-16 w-full rounded-xl bg-gray-100" />
                        <div className="h-12 w-full rounded-xl bg-gray-100" />
                    </div>
                </div>

                <p className="mt-6 text-center text-sm text-gray-500">Preparing your page...</p>
            </div>
        </div>
    );
}
