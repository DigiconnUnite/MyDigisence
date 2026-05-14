'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Search, X, Building2, User, Package, ArrowRight } from 'lucide-react'

interface GlobalSearchModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (type: string, item: any) => void
}

export default function GlobalSearchModal({ isOpen, onClose, onSelect }: GlobalSearchModalProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) {
      setQuery('')
      setResults(null)
      setLoading(false)
    }
  }, [isOpen])

  useEffect(() => {
    if (!query.trim()) {
      setResults(null)
      return
    }

    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/search?query=${encodeURIComponent(query)}&entities=all&limit=5`)
        if (res.ok) {
          const data = await res.json()
          setResults(data)
        }
      } catch (error) {
        console.error('Global search error:', error)
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  if (!isOpen) return null

  const hasResults = results && (
    (results.businesses?.length || 0) > 0 ||
    (results.professionals?.length || 0) > 0 ||
    (results.products?.length || 0) > 0
  )

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center px-4 py-3 border-b border-gray-200">
          <Search className="h-5 w-5 text-gray-400 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search businesses, professionals, products..."
            className="flex-1 outline-none text-gray-900 placeholder-gray-400"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 hover:bg-gray-100 rounded">
              <X className="h-4 w-4 text-gray-400" />
            </button>
          )}
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {loading && (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600 mx-auto" />
              <p className="text-gray-500 text-sm mt-2">Searching...</p>
            </div>
          )}

          {!loading && !hasResults && query.trim() && (
            <div className="p-8 text-center text-gray-500">
              No results found for "{query}"
            </div>
          )}

          {!loading && !query.trim() && (
            <div className="p-8 text-center text-gray-400 text-sm">
              Type to search across all entities
            </div>
          )}

          {results?.businesses?.length > 0 && (
            <div className="p-2">
              <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Businesses</div>
              {results.businesses.map((b: any) => (
                <button
                  key={b.id}
                  onClick={() => onSelect('business', b)}
                  className="w-full flex items-center px-3 py-2 hover:bg-gray-50 rounded-lg text-left transition-colors"
                >
                  <Building2 className="h-4 w-4 text-blue-500 mr-3 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{b.name}</p>
                    <p className="text-xs text-gray-500">{b.category?.name || 'Business'}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-300 shrink-0" />
                </button>
              ))}
            </div>
          )}

          {results?.professionals?.length > 0 && (
            <div className="p-2">
              <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Professionals</div>
              {results.professionals.map((p: any) => (
                <button
                  key={p.id}
                  onClick={() => onSelect('professional', p)}
                  className="w-full flex items-center px-3 py-2 hover:bg-gray-50 rounded-lg text-left transition-colors"
                >
                  <User className="h-4 w-4 text-purple-500 mr-3 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                    <p className="text-xs text-gray-500">{p.professionName || 'Professional'}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-300 shrink-0" />
                </button>
              ))}
            </div>
          )}

          {results?.products?.length > 0 && (
            <div className="p-2">
              <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Products</div>
              {results.products.map((p: any) => (
                <button
                  key={p.id}
                  onClick={() => onSelect('product', p)}
                  className="w-full flex items-center px-3 py-2 hover:bg-gray-50 rounded-lg text-left transition-colors"
                >
                  <Package className="h-4 w-4 text-green-500 mr-3 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                    <p className="text-xs text-gray-500">{p.business?.name || 'Product'} {p.price ? `- ₹${p.price}` : ''}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-300 shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 flex items-center justify-between">
          <span>Press <kbd className="px-1.5 py-0.5 bg-white border rounded text-gray-700 font-mono">Esc</kbd> to close</span>
          <span>{hasResults ? 'Click any result to navigate' : ''}</span>
        </div>
      </div>
    </div>
  )
}
