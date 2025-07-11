import { SaleData } from '@/stores/salesStore'
import { formatCurrency } from '@/utils'

// Constants for receipt configuration
const STORE_CONFIG = {
  name: 'Premium Liquor Store',
  address: '123 Main Street, Anytown, USA',
  phone: '(555) 123-4567',
} as const

export function printReceipt(saleData: SaleData): void {
  const printWindow = window.open('', '_blank', 'width=800,height=600')
  
  if (!printWindow) {
    alert('Please allow popups to print the receipt')
    return
  }

  const receiptHTML = generateReceiptHTML(saleData)
  
  printWindow.document.write(receiptHTML)
  printWindow.document.close()

  // Wait for content to load, then print
  setTimeout(() => {
    printWindow.print()
    // Close the window after printing
    setTimeout(() => {
      printWindow.close()
    }, 100)
  }, 500)
}

function generateReceiptHTML(saleData: SaleData): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Receipt - ${saleData.id}</title>
        <style>
          ${getReceiptStyles()}
        </style>
      </head>
      <body>
        <div class="receipt-container">
          <div class="receipt-header">
            <h1>${STORE_CONFIG.name}</h1>
            <p>${STORE_CONFIG.address}</p>
            <p>Phone: ${STORE_CONFIG.phone}</p>
          </div>

          <div class="sale-info">
            <div>
              <span><strong>Sale ID:</strong></span>
              <span>${saleData.id}</span>
            </div>
            <div>
              <span><strong>Date:</strong></span>
              <span>${new Date(saleData.saleDate).toLocaleString()}</span>
            </div>
            <div>
              <span><strong>Cashier:</strong></span>
              <span>${saleData.cashierId}</span>
            </div>
          </div>

          <div class="items-section">
            <h3>Items Purchased</h3>
            ${saleData.items.map((item: SaleData['items'][0]) => `
              <div class="item-row">
                <div class="item-name">${item.name}</div>
                <div class="item-details">
                  <span>${item.quantity} × ${formatCurrency(item.priceAtSale)}</span>
                </div>
                <div class="item-total">
                  <span></span>
                  <span>${formatCurrency(item.finalLineTotal)}</span>
                </div>
              </div>
            `).join('')}
          </div>

          <div class="totals-section">
            <div>
              <span>Subtotal:</span>
              <span>${formatCurrency(saleData.items.reduce((sum, item) => sum + item.finalLineTotal, 0))}</span>
            </div>
            <div>
              <span>Tax:</span>
              <span>${formatCurrency(saleData.taxAmount)}</span>
            </div>
            ${saleData.discountAmount > 0 ? `
              <div style="color: #008000;">
                <span>Discount:</span>
                <span>-${formatCurrency(saleData.discountAmount)}</span>
              </div>
            ` : ''}
            <div class="total-line">
              <span>Total:</span>
              <span>${formatCurrency(saleData.totalAmount)}</span>
            </div>
          </div>

          <div class="payment-section">
            <div>
              <span><strong>Payment Method:</strong></span>
              <span style="text-transform: capitalize;">${saleData.paymentMethod}</span>
            </div>
            ${saleData.paymentMethod === 'cash' && saleData.changeGiven > 0 ? `
              <div>
                <span><strong>Change Given:</strong></span>
                <span>${formatCurrency(saleData.changeGiven)}</span>
              </div>
            ` : ''}
          </div>

          <div class="receipt-footer">
            <p>Thank you for your business!</p>
            <p>Please drink responsibly.</p>
          </div>
        </div>
      </body>
    </html>
  `
}

function getReceiptStyles(): string {
  return `
    body {
      font-family: 'Courier New', monospace;
      font-size: 12px;
      line-height: 1.4;
      margin: 20px;
      color: #000;
      background: #fff;
    }
    .receipt-container {
      max-width: 300px;
      margin: 0 auto;
    }
    .receipt-header {
      text-align: center;
      margin-bottom: 20px;
      border-bottom: 1px solid #000;
      padding-bottom: 10px;
    }
    .receipt-header h1 {
      margin: 0 0 10px 0;
      font-size: 16px;
      font-weight: bold;
    }
    .receipt-header p {
      margin: 2px 0;
      font-size: 10px;
    }
    .sale-info {
      margin-bottom: 15px;
    }
    .sale-info div {
      display: flex;
      justify-content: space-between;
      margin-bottom: 3px;
    }
    .items-section {
      margin-bottom: 15px;
    }
    .items-section h3 {
      margin: 0 0 10px 0;
      font-size: 12px;
      font-weight: bold;
      border-bottom: 1px solid #000;
      padding-bottom: 3px;
    }
    .item-row {
      margin-bottom: 8px;
    }
    .item-name {
      font-weight: bold;
      margin-bottom: 2px;
    }
    .item-details {
      display: flex;
      justify-content: space-between;
      font-size: 10px;
    }
    .item-total {
      display: flex;
      justify-content: space-between;
      font-weight: bold;
    }
    .totals-section {
      border-top: 1px solid #000;
      padding-top: 10px;
      margin-bottom: 15px;
    }
    .totals-section div {
      display: flex;
      justify-content: space-between;
      margin-bottom: 3px;
    }
    .totals-section .total-line {
      font-weight: bold;
      font-size: 14px;
      border-top: 1px solid #000;
      padding-top: 5px;
      margin-top: 5px;
    }
    .payment-section {
      margin-bottom: 15px;
      border-top: 1px solid #000;
      padding-top: 10px;
    }
    .payment-section div {
      display: flex;
      justify-content: space-between;
      margin-bottom: 3px;
    }
    .receipt-footer {
      text-align: center;
      border-top: 1px solid #000;
      padding-top: 10px;
      font-size: 10px;
    }
    .receipt-footer p {
      margin: 3px 0;
    }
    @media print {
      body {
        margin: 0;
      }
      .receipt-container {
        max-width: none;
      }
    }
  `
}