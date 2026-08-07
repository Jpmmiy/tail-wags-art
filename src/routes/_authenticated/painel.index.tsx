import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/painel/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/painel/"!</div>
}
