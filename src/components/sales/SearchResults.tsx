import { Product } from '@/types'
import { toCents, formatCurrency } from '@/utils'

interface SearchResultsProps {
  searchQuery: string
  searchResults: Product[]
  activeItem: number
  onAddToCart: (product: Product) => void
  onSetActiveItem: (index: number) => void
}

export function SearchResults({ 
  searchQuery, 
  searchResults, 
  activeItem, 
  onAddToCart, 
  onSetActiveItem 
}: SearchResultsProps) {
  if (!searchQuery) return null

  return (
    <div className="mb-4">
      <h2 className="text-lg font-medium mb-2 text-gray-300">Search Results</h2>
      <div className="space-y-2">
        {searchResults.map((result, index) => (
          <div
            key={result.id}
            className={`p-3 rounded-lg flex justify-between items-center cursor-pointer ${
              index === activeItem ? 'bg-amber-600' : 'bg-gray-800'
            }`}
            onClick={() => {
              onSetActiveItem(index)
              onAddToCart(result)
            }}
          >
            <div className="flex items-center gap-4">
              <span className="w-8 text-center">1</span>
              <span className="w-20">{result.sku}</span>
              <span className="flex-1">{result.name}</span>
            </div>
            <span className="font-medium">{formatCurrency(toCents(result.price))}</span>
          </div>
        ))}
      </div>
    </div>
  )
}