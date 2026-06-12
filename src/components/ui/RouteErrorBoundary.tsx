import { useRouteError } from 'react-router-dom'
import { Card } from './Card'
import { Button } from './Button'

export function RouteErrorBoundary() {
  const error = useRouteError() as Error | unknown

  const handleReload = () => {
    window.location.reload()
  }

  const handleResetData = () => {
    if (window.confirm('Isso irá apagar todos os seus protocolos salvos e histórico. Tem certeza?')) {
      window.indexedDB.deleteDatabase('keyval-store')
      localStorage.clear()
      sessionStorage.clear()
      window.location.reload()
    }
  }

  // Extract error message
  const errorMessage = error instanceof Error
    ? error.message
    : typeof error === 'string'
      ? error
      : JSON.stringify(error)

  return (
    <div style={{
      display: 'grid',
      placeItems: 'center',
      minHeight: '100vh',
      padding: '1.5rem',
      background: '#0d1117',
      color: '#f3f4f6',
      fontFamily: 'Barlow, sans-serif'
    }}>
      <Card style={{ maxWidth: '28rem', width: '100%', textAlign: 'center', display: 'grid', gap: '1.2rem' }}>
        <p className="eyebrow">Ops, algo deu errado</p>
        <h2 style={{ margin: 0, textTransform: 'uppercase', fontFamily: 'Barlow Condensed, sans-serif' }}>
          Erro no aplicativo
        </h2>
        <p style={{ color: '#a4acb8', margin: 0 }}>
          Ocorreu um erro inesperado na renderização da rota. Você pode tentar recarregar ou resetar os dados locais.
        </p>
        {errorMessage && (
          <pre style={{
            textAlign: 'left',
            background: '#161b22',
            padding: '0.8rem',
            borderRadius: '8px',
            fontSize: '0.8rem',
            overflowX: 'auto',
            border: '1px solid rgba(214, 40, 57, 0.2)',
            color: '#ff7b88',
            maxHeight: '10rem'
          }}>
            {errorMessage}
          </pre>
        )}
        <div style={{ display: 'grid', gap: '0.6rem' }}>
          <Button onClick={handleReload} variant="primary">
            Recarregar aplicativo
          </Button>
          <Button onClick={handleResetData} variant="danger">
            Limpar dados locais (Reset)
          </Button>
        </div>
      </Card>
    </div>
  )
}
