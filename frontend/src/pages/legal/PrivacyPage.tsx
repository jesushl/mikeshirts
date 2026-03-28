import SeoHead from '../../components/SeoHead'

export default function PrivacyPage() {
  return (
    <article className="max-w-3xl mx-auto px-4 py-10">
      <SeoHead
        title="Aviso de Privacidad"
        description="Aviso de privacidad de Mike Shirts conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP)."
      />

      <h1 className="text-3xl font-black mb-6">Aviso de Privacidad</h1>

      <div className="prose-custom">
        <p>
          En cumplimiento con la Ley Federal de Protección de Datos Personales en Posesión de
          los Particulares (LFPDPPP) y su Reglamento, Mike Shirts pone a tu disposición el
          presente Aviso de Privacidad.
        </p>

        <h2>Responsable</h2>
        <p>
          Mike Shirts, con domicilio en México y correo electrónico de contacto{' '}
          <a href="mailto:contacto@mikeshirts.mx" className="text-accent hover:text-accent-hover">
            contacto@mikeshirts.mx
          </a>, es responsable del tratamiento de tus datos personales.
        </p>

        <h2>Datos personales recabados</h2>
        <p>Para las finalidades señaladas, recabamos las siguientes categorías de datos:</p>
        <ul>
          <li>Nombre completo</li>
          <li>Correo electrónico</li>
          <li>Número de teléfono</li>
          <li>Dirección de envío (calle, número, colonia, ciudad, estado, código postal)</li>
          <li>RFC (opcional, para facturación)</li>
          <li>Historial de compras y pedidos</li>
          <li>Dirección IP y datos de navegación (cookies analíticas)</li>
        </ul>
        <p>
          <strong>No recabamos datos financieros.</strong> Los pagos son procesados directamente
          por Mercado Pago, quien tiene su propio aviso de privacidad.
        </p>

        <h2>Finalidades del tratamiento</h2>
        <h3>Finalidades primarias (necesarias)</h3>
        <ul>
          <li>Procesamiento y entrega de pedidos</li>
          <li>Generación de tickets de venta y envío</li>
          <li>Comunicación sobre el estado de tu pedido</li>
          <li>Atención a solicitudes, dudas y reclamaciones</li>
          <li>Facturación (cuando se proporciona RFC)</li>
        </ul>

        <h3>Finalidades secundarias (opcionales)</h3>
        <ul>
          <li>Envío de información sobre nuevos productos y promociones</li>
          <li>Análisis estadístico del comportamiento de navegación para mejorar la experiencia</li>
        </ul>
        <p>
          Si no deseas que tus datos sean tratados para finalidades secundarias, puedes solicitarlo
          enviando un correo a contacto@mikeshirts.mx con el asunto "Cancelar comunicaciones".
        </p>

        <h2>Transferencias de datos</h2>
        <p>Tus datos personales pueden ser transferidos a:</p>
        <ul>
          <li>
            <strong>Mercado Pago:</strong> para el procesamiento de pagos (tarjeta, OXXO, SPEI).
          </li>
          <li>
            <strong>Empresas de paquetería:</strong> nombre, dirección y teléfono para la entrega
            de productos.
          </li>
        </ul>
        <p>
          Estas transferencias no requieren de tu consentimiento conforme al artículo 37 de la
          LFPDPPP, al ser necesarias para el cumplimiento de la relación contractual.
        </p>

        <h2>Derechos ARCO</h2>
        <p>
          Tienes derecho a Acceder, Rectificar, Cancelar u Oponerte al tratamiento de tus datos
          personales (derechos ARCO). Para ejercer cualquiera de estos derechos, envía tu
          solicitud a{' '}
          <a href="mailto:contacto@mikeshirts.mx" className="text-accent hover:text-accent-hover">
            contacto@mikeshirts.mx
          </a>{' '}
          indicando:
        </p>
        <ul>
          <li>Tu nombre completo y correo registrado</li>
          <li>El derecho que deseas ejercer</li>
          <li>Una descripción clara de los datos sobre los que deseas ejercer el derecho</li>
        </ul>
        <p>
          Responderemos tu solicitud en un plazo máximo de 20 días hábiles.
        </p>

        <h2>Uso de cookies</h2>
        <p>
          Nuestro sitio web utiliza cookies analíticas para:
        </p>
        <ul>
          <li>Identificar sesiones de visita</li>
          <li>Registrar la fuente de tráfico (redes sociales, búsqueda, directo)</li>
          <li>Parámetros UTM para medir efectividad de campañas</li>
          <li>Funnel de conversión (visita → producto → carrito → compra)</li>
        </ul>
        <p>
          Estas cookies no almacenan información personal identificable. Se utilizan
          exclusivamente con fines estadísticos para mejorar nuestro servicio.
        </p>

        <h2>Modificaciones al aviso</h2>
        <p>
          Mike Shirts se reserva el derecho de modificar este aviso de privacidad. Cualquier
          cambio será publicado en esta página. Te recomendamos revisarla periódicamente.
        </p>

        <p className="text-text-muted text-sm mt-8">
          Última actualización: marzo 2026
        </p>
      </div>
    </article>
  )
}
