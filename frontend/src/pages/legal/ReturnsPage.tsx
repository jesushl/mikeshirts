import SeoHead from '../../components/SeoHead'

export default function ReturnsPage() {
  return (
    <article className="max-w-3xl mx-auto px-4 py-10">
      <SeoHead
        title="Política de Devoluciones"
        description="Política de devoluciones y reembolsos de Mike Shirts, conforme a la Ley Federal de Protección al Consumidor (PROFECO)."
      />

      <h1 className="text-3xl font-black mb-6">Política de Devoluciones y Reembolsos</h1>

      <div className="prose-custom">
        <p>
          En Mike Shirts respetamos tus derechos como consumidor conforme a la Ley Federal de
          Protección al Consumidor (LFPC). A continuación te informamos sobre nuestras políticas
          de devolución, cambios y reembolsos.
        </p>

        <h2>Derecho a devolución</h2>
        <p>
          Tienes derecho a solicitar la devolución de tu compra dentro de los <strong>30 días
          naturales</strong> posteriores a la recepción del producto, siempre que se cumplan las
          siguientes condiciones:
        </p>
        <ul>
          <li>El producto no ha sido usado, lavado ni alterado.</li>
          <li>Conserva sus etiquetas originales.</li>
          <li>Se encuentra en su empaque original.</li>
        </ul>

        <h2>Productos sobre pedido (on-demand)</h2>
        <p>
          Los productos fabricados sobre pedido (producción on-demand) <strong>no son elegibles
          para devolución</strong> por cambio de opinión, ya que se producen específicamente
          para cada cliente. Sin embargo, si el producto presenta un defecto de manufactura,
          aplican las garantías descritas más abajo.
        </p>

        <h2>Proceso de devolución</h2>
        <ol>
          <li>
            Envía un correo a{' '}
            <a href="mailto:contacto@mikeshirts.mx" className="text-accent hover:text-accent-hover">
              contacto@mikeshirts.mx
            </a>{' '}
            indicando tu folio de venta, número de pedido y el motivo de la devolución.
          </li>
          <li>
            Nuestro equipo revisará tu solicitud y te proporcionará instrucciones para el envío
            de retorno dentro de 3 días hábiles.
          </li>
          <li>
            Una vez recibido e inspeccionado el producto, procesaremos tu reembolso.
          </li>
        </ol>

        <h2>Reembolsos</h2>
        <p>
          Los reembolsos se realizarán a la misma forma de pago original (tarjeta de crédito,
          débito, o cuenta de Mercado Pago) en un plazo máximo de <strong>15 días hábiles</strong>{' '}
          a partir de la recepción del producto devuelto.
        </p>
        <p>
          El costo de envío original ($249 MXN) no es reembolsable, salvo en casos de error
          nuestro o producto defectuoso.
        </p>

        <h2>Productos defectuosos o con error</h2>
        <p>
          Si recibiste un producto con defecto de manufactura, talla incorrecta por error nuestro,
          o un artículo diferente al que ordenaste:
        </p>
        <ul>
          <li>Te ofrecemos reemplazo o reembolso completo (incluyendo envío).</li>
          <li>Mike Shirts cubre el costo del envío de retorno.</li>
          <li>Contáctanos dentro de los 7 días naturales posteriores a la recepción con fotos del producto.</li>
        </ul>

        <h2>Cambios de talla</h2>
        <p>
          Si necesitas cambiar la talla de un producto en stock, podemos gestionarlo sujeto a
          disponibilidad. El cliente cubre el costo de envío de retorno. Contáctanos a{' '}
          <a href="mailto:contacto@mikeshirts.mx" className="text-accent hover:text-accent-hover">
            contacto@mikeshirts.mx
          </a>.
        </p>

        <h2>Fundamento legal</h2>
        <p className="text-text-muted text-sm">
          Esta política se fundamenta en los artículos 56, 92, 92 Ter y demás aplicables de la
          Ley Federal de Protección al Consumidor (LFPC). Para cualquier reclamación puedes
          acudir a la Procuraduría Federal del Consumidor (PROFECO) o contactarnos directamente.
        </p>

        <p className="text-text-muted text-sm mt-8">
          Última actualización: marzo 2026
        </p>
      </div>
    </article>
  )
}
