import SeoHead from '../../components/SeoHead'

export default function ShippingPolicyPage() {
  return (
    <article className="max-w-3xl mx-auto px-4 py-10">
      <SeoHead
        title="Política de Envío"
        description="Información sobre envíos de Mike Shirts: cobertura, costos, tiempos de entrega y seguimiento de paquetes."
      />

      <h1 className="text-3xl font-black mb-6">Política de Envío</h1>

      <div className="prose-custom">
        <h2>Cobertura</h2>
        <p>
          Realizamos envíos a todo el territorio nacional mexicano. Actualmente no realizamos
          envíos internacionales.
        </p>

        <h2>Costo de envío</h2>
        <p>
          El costo de envío es una tarifa única de <strong>$249.00 MXN</strong> por pedido,
          independientemente del número de artículos o el destino dentro de México.
        </p>

        <h2>Tiempos de entrega</h2>
        <ul>
          <li>
            <strong>Productos en stock:</strong> 5 a 10 días hábiles después de la confirmación
            del pago.
          </li>
          <li>
            <strong>Productos sobre pedido (on-demand):</strong> 10 a 15 días hábiles, ya que
            incluyen el tiempo de producción. La fecha estimada se indicará en tu confirmación
            de pedido.
          </li>
        </ul>
        <p>
          Los tiempos de entrega son estimados y pueden variar según la zona de destino y
          las condiciones de la paquetería.
        </p>

        <h2>Paquetería</h2>
        <p>
          Trabajamos con diversas paqueterías para asegurar la mejor opción según tu destino.
          La elección de paquetería es a discreción de Mike Shirts y puede variar por pedido.
        </p>

        <h2>Seguimiento</h2>
        <p>
          Una vez que tu pedido sea enviado, recibirás un correo electrónico con el nombre
          de la paquetería y el número de guía para que puedas dar seguimiento a tu paquete.
          También puedes consultar el estado de tu envío en la sección "Mis Pedidos" de tu cuenta.
        </p>

        <h2>Problemas con tu envío</h2>
        <p>
          Si tu paquete no llega dentro del plazo estimado, presenta daños, o tienes cualquier
          problema con la entrega, contáctanos a{' '}
          <a href="mailto:contacto@mikeshirts.mx" className="text-accent hover:text-accent-hover">
            contacto@mikeshirts.mx
          </a>{' '}
          con tu número de pedido y te ayudaremos a resolverlo.
        </p>

        <p className="text-text-muted text-sm mt-8">
          Última actualización: marzo 2026
        </p>
      </div>
    </article>
  )
}
