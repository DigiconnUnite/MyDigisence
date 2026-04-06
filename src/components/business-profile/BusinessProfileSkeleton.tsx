import { Skeleton } from "@/components/ui/skeleton";

export default function BusinessProfileSkeleton() {
  return (
    <div className="min-h-screen bg-slate-200 flex flex-col">
      <header className="shrink-0 bg-white shadow-sm border-b z-50">
        <div className="w-full mx-auto px-4 sm:px-4 lg:px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3 shrink-0">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="h-6 w-px bg-gray-300 hidden md:block"></div>
              <Skeleton className="h-6 w-32 hidden md:block" />
            </div>
            <nav className="hidden md:flex items-center justify-center flex-1 px-8">
              <div className="flex space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-10 w-20 rounded-lg" />
                ))}
              </div>
            </nav>
            <Skeleton className="h-10 w-10 rounded-lg md:hidden" />
          </div>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 overflow-hidden">
        <aside className="hidden hide-scrollbar md:block md:col-span-1 h-full overflow-y-auto z-20">
          <div className="flex flex-col p-4 lg:gap-4 w-full space-y-4">
            <Skeleton className="h-64 w-full rounded-2xl" />
            <Skeleton className="h-12 w-full rounded-full" />
            <Skeleton className="h-12 w-full rounded-full" />
            <Skeleton className="h-12 w-full rounded-full" />
            <Skeleton className="h-48 w-full rounded-2xl" />
          </div>
        </aside>

        <main className="md:col-span-3 h-full hide-scrollbar overflow-y-auto mb-5 relative  min-w-0">
          <div className="max-w-auto mx-auto px-2 sm:px-4 lg:px-4 pt-4 space-y-6 lg:space-y-8">
            <section className="relative w-full mx-auto">
              <Skeleton className="h-48 md:h-80 w-full rounded-xl md:rounded-3xl" />
            </section>

            <div className="md:hidden">
              <Skeleton className="h-64 w-full rounded-2xl" />
            </div>

            <section className="py-6 md:py-12 px-0">
              <div className="w-full">
                <div className="flex justify-between items-center mb-4 md:mb-8">
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-8 w-20" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-40 w-full rounded-2xl" />
                  ))}
                </div>
              </div>
            </section>

            <section className="">
              <div className="w-full mx-auto space-y-6">
                <div className="flex justify-between items-start sm:items-center gap-4 mb-6">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-8 w-24" />
                </div>

                <div className="sticky top-0 z-30 mb-6">
                  <div className="flex flex-row gap-3 py-2">
                    <Skeleton className="h-10 flex-1 rounded-lg" />
                    <Skeleton className="h-10 w-28 rounded-lg" />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <Skeleton key={i} className="h-72 w-full rounded-2xl" />
                  ))}
                </div>
              </div>
            </section>

            <section className="w-full my-8 md:my-12 px-0">
              <div className="flex justify-between items-center mb-4 md:mb-8">
                <Skeleton className="h-8 w-32" />
              </div>
              <div className="grid gap-2 md:gap-4 grid-cols-2 md:grid-cols-4 md:grid-rows-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-32 w-full rounded-xl" />
                ))}
              </div>
            </section>

            <section className="w-full py-8 md:py-12 bg-white rounded-3xl shadow-sm px-6 md:px-8">
              <div className="flex flex-col md:flex-row gap-8 md:gap-12">
                <div className="flex-1 space-y-4">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-24 w-full" />
                </div>
                <div className="flex-1 space-y-4">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-24 w-full" />
                </div>
              </div>
            </section>
          </div>

          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-safe">
            <div className="flex justify-around items-center gap-2 px-3 py-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-10 w-16 rounded-none" />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
