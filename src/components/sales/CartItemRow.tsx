import { Plus, Minus, Trash2Icon } from 'lucide-react'
import { CartItem } from '@/stores/cartStore'
import { toCents, formatCurrency, calculateDiscountAmount } from '@/utils'

interface CartItemRowProps {
  item: CartItem
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemoveFromCart: (id: string) => void
  onRemoveDiscount: (id: string) => void
}

export function CartItemRow({ 
  item, 
  onUpdateQuantity, 
  onRemoveFromCart, 
  onRemoveDiscount 
}: CartItemRowProps) {
  return (
    <div className="p-3 bg-gray-800 rounded-lg flex justify-between items-center">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <button
            className="p-1 rounded-md bg-gray-700 hover:bg-gray-600"
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
          >
            <Minus size={16} className="text-gray-300" />
          </button>
          <input
            type="number"
            min="1"
            value={item.quantity}
            className="w-[70px] h-[30px] text-center bg-white text-black border-2 border-black text-lg px-1 rounded"
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              if (!isNaN(value) && value >= 1) {
                onUpdateQuantity(item.id, value);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.currentTarget.blur();
              }
            }}
          />
          <button
            className="p-1 rounded-md bg-gray-700 hover:bg-gray-600"
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          >
            <Plus size={16} className="text-gray-300" />
          </button>
        </div>
        <span className="w-20">{item.sku}</span>
        <div className="flex-1 flex items-center gap-2">
          <span>{item.name}</span>
          {item.discount && (
            <div className="flex items-center gap-1">
              <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full">
                {item.discount.type === 'flat' 
                  ? `${formatCurrency(toCents(Math.min(item.discount.amount, item.price * item.quantity)))} off total` 
                  : `${item.discount.amount}% off`}
              </span>
              <button
                className="px-1 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded"
                onClick={() => onRemoveDiscount(item.id)}
                title="Remove discount"
              >
                ×
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-24 text-right">
          <span className="text-gray-100">{formatCurrency(toCents(item.price))}</span>
        </div>
        <div className="w-24 text-right font-medium">
          {item.discount ? (
            <div>
              <span className="line-through text-gray-500 text-sm">
                {formatCurrency(toCents(item.price * item.quantity))}
              </span>
              <div className="text-green-400">
                {item.discount.type === 'flat' 
                  ? formatCurrency(Math.max(0, toCents(item.price * item.quantity) - toCents(item.discount.amount)))
                  : formatCurrency(toCents(item.price * item.quantity) - calculateDiscountAmount(toCents(item.price * item.quantity), item.discount.amount))
                }
              </div>
              <div className="text-xs text-green-300">
                {item.discount.type === 'flat' 
                  ? `(-${formatCurrency(Math.min(toCents(item.discount.amount), toCents(item.price * item.quantity)))})`
                  : `(-${formatCurrency(calculateDiscountAmount(toCents(item.price * item.quantity), item.discount.amount))})`
                }
              </div>
            </div>
          ) : (
            <span>{formatCurrency(toCents(item.price * item.quantity))}</span>
          )}
        </div>
        <button
          className="p-1 rounded-md text-gray-400 hover:text-red-500"
          onClick={() => onRemoveFromCart(item.id)}
        >
          <Trash2Icon size={18} />
        </button>
      </div>
    </div>
  )
}