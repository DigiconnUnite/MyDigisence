import Link from "next/link"
import { Button } from "@/components/ui/button"
import { User, ArrowLeft, Search } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
          <User className="w-12 h-12 text-slate-400" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-900">
            Professional Not Found
          </h1>
          <p className="text-slate-600">
            The professional profile you&apos;re looking for doesn&apos;t exist or may have been removed.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild variant="outline">
            <Link href="/professionals">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Browse Professionals
            </Link>
          </Button>
          <Button asChild>
            <Link href="/">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
