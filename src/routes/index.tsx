import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: () => (
    <div className="p-8 font-sans">
      <h1 className="text-2xl font-bold mb-4">Projeto Pronto para Conexão GitHub</h1>
      <p className="text-gray-600">Este projeto foi limpo e está aguardando a sincronização com seu repositório externo.</p>
    </div>
  ),
})
