/** Inyecta datos estructurados schema.org. */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // El contenido proviene de datos propios; se escapa "<" para evitar cierres de <script>.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
