import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Card } from './Card'
import { Button } from './Button'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  private handleReload = () => {
    window.location.reload()
  }

  private handleResetData = () => {
    if (window.confirm('Isso irá apagar todos os seus protocolos salvos e histórico. Tem certeza?')) {
      window.indexedDB.deleteDatabase('keyval-store')
      localStorage.clear()
      sessionStorage.clear()
      window.location.reload()
    }
  }

  public render() {
    if (this.state.hasError) {
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
              Ocorreu um erro inesperado na renderização do aplicativo. Você pode tentar recarregar ou limpar os dados locais em caso de corrupção.
            </p>
            {this.state.error && (
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
                {this.state.error.toString()}
              </pre>
            )}
            <div style={{ display: 'grid', gap: '0.6rem' }}>
              <Button onClick={this.handleReload} variant="primary">
                Recarregar aplicativo
              </Button>
              <Button onClick={this.handleResetData} variant="danger">
                Limpar dados locais (Reset)
              </Button>
            </div>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}
