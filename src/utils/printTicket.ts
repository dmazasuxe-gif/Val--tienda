import { Order, StoreSettings } from '../types';

export const printTicket = (order: Order, settings: StoreSettings) => {
  const rs = settings.receiptSettings;
  const isPrintEnabled = rs && (rs.ruc || rs.legalName || rs.address);

  if (!isPrintEnabled) {
    alert("Por favor, configure primero los datos de la boleta/ticket en 'Configuración Tienda & WhatsApp' -> 'Configuración de Boleta / Ticket de Impresora'.");
    return;
  }

  const date = new Date(order.createdAt).toLocaleString('es-PE', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  // Calculate totals
  const totalItems = order.items.reduce((acc, i) => acc + i.quantity, 0);

  const printWindow = window.open('', 'PRINT', 'height=600,width=400');
  
  if (!printWindow) {
    alert("No se pudo abrir la ventana de impresión. Verifique los bloqueadores de pop-ups.");
    return;
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Ticket - ${order.orderNumber}</title>
      <style>
        /* CSS reset & base settings optimized for thermal printers (58mm or 80mm) */
        @page {
          margin: 0;
          size: auto;
        }
        body {
          margin: 0;
          padding: 8px;
          font-family: 'Courier New', Courier, monospace, sans-serif;
          font-size: 12px;
          color: #000;
          background: #fff;
          width: 280px; /* standard 80mm printer width ~ 300px, 58mm ~ 200px */
          max-width: 100%;
          line-height: 1.2;
        }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .text-left { text-align: left; }
        .bold { font-weight: bold; }
        .uppercase { text-transform: uppercase; }
        .text-sm { font-size: 10px; }
        .text-lg { font-size: 16px; font-weight: bold; }
        
        .header { margin-bottom: 15px; }
        .logo-img { max-width: 120px; max-height: 80px; margin: 0 auto 5px auto; display: block; filter: grayscale(100%); }
        .divider { border-top: 1px dashed #000; margin: 10px 0; }
        .divider-solid { border-top: 1px solid #000; margin: 10px 0; }
        
        .info-block p { margin: 3px 0; }
        
        table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        th, td { padding: 4px 2px; vertical-align: top; text-align: left; }
        th { border-bottom: 1px dashed #000; }
        
        .totals-table { margin-left: auto; width: 70%; }
        .totals-table td { padding: 3px 2px; }
        .total-row { font-size: 14px; font-weight: bold; border-top: 1px solid #000; }
        
        .footer { margin-top: 20px; font-size: 10px; }
        
        @media print {
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header text-center">
        ${rs?.logoUrl ? `<img src="${rs.logoUrl}" class="logo-img" alt="Logo" />` : `<div class="text-lg uppercase">${rs?.legalName || settings.storeName}</div>`}
        ${rs?.legalName && rs.logoUrl ? `<div class="bold uppercase">${rs.legalName}</div>` : ''}
        ${rs?.ruc ? `<div>RUC: ${rs.ruc}</div>` : ''}
        ${rs?.address ? `<div class="text-sm">${rs.address}</div>` : ''}
        ${rs?.phone ? `<div class="text-sm">Telf: ${rs.phone}</div>` : ''}
      </div>
      
      <div class="divider"></div>
      
      <div class="info-block">
        <p><span class="bold">TICKET NO:</span> ${order.orderNumber}</p>
        <p><span class="bold">FECHA:</span> ${date}</p>
        <p><span class="bold">CLIENTE:</span> ${order.customerName}</p>
        <p><span class="bold">MÉTODO:</span> ${order.paymentMethod.replace('_', ' ').toUpperCase()}</p>
      </div>

      <div class="divider"></div>
      
      <table>
        <thead>
          <tr>
            <th style="width: 15%">CANT</th>
            <th style="width: 55%">DESCRIPCIÓN</th>
            <th style="width: 30%" class="text-right">IMPORTE</th>
          </tr>
        </thead>
        <tbody>
          ${order.items.map(item => `
            <tr>
              <td class="text-center">${item.quantity}</td>
              <td>
                <div class="bold">${item.product.name}</div>
                <div class="text-sm">Talla: ${item.selectedSize} | Color: ${item.selectedColor.name}</div>
              </td>
              <td class="text-right">${settings.currencySymbol}${(item.product.price * item.quantity).toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="divider"></div>

      <table class="totals-table">
        <tr>
          <td>Subtotal:</td>
          <td class="text-right">${settings.currencySymbol}${order.subtotal.toFixed(2)}</td>
        </tr>
        <tr>
          <td>Envío:</td>
          <td class="text-right">${settings.currencySymbol}${order.shippingCost.toFixed(2)}</td>
        </tr>
        ${order.discount > 0 ? `
        <tr>
          <td>Descuento:</td>
          <td class="text-right">-${settings.currencySymbol}${order.discount.toFixed(2)}</td>
        </tr>` : ''}
        <tr class="total-row">
          <td>TOTAL:</td>
          <td class="text-right">${settings.currencySymbol}${order.total.toFixed(2)}</td>
        </tr>
      </table>

      <div class="divider text-center" style="margin-bottom: 2px;">***</div>
      
      <div class="footer text-center">
        <p>Artículos totales: ${totalItems}</p>
        ${rs?.footerMessage ? `<p>${rs.footerMessage.replace(/\\n/g, '<br>')}</p>` : `<p>¡Gracias por su compra!</p>`}
        <p class="text-sm" style="margin-top:15px; color: #555;">Documento sin valor fiscal</p>
      </div>
      
      <script>
        window.onload = function() {
          window.focus();
          // Timeout to ensure resources (like the logo) are loaded before printing
          setTimeout(function() {
            window.print();
            window.close();
          }, 500);
        }
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
};
