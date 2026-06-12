import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ShellLayout } from '../components/ui/ShellLayout'
import { ProtocolAudioPage } from '../features/audio/ProtocolAudioPage'
import { VoicesPage } from '../features/audio/VoicesPage'
import { ProtocolEditorPage } from '../features/editor/ProtocolEditorPage'
import { ExecutionPage } from '../features/execution/ExecutionPage'
import { HistoryPage } from '../features/history/HistoryPage'
import { LaunchPage } from '../features/launch/LaunchPage'
import { HomePage } from '../features/library/HomePage'
import { QuickBuilderPage } from '../features/quick-builders/QuickBuilderPage'
import { SettingsPage } from '../features/settings/SettingsPage'
import { TemplatesPage } from '../features/templates/TemplatesPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LaunchPage />,
  },
  {
    element: <ShellLayout />,
    children: [
      {
        path: '/library',
        element: <HomePage />,
      },
      {
        path: '/templates',
        element: <TemplatesPage />,
      },
      {
        path: '/protocol/new',
        element: <ProtocolEditorPage />,
      },
      {
        path: '/protocol/:protocolId/edit',
        element: <ProtocolEditorPage />,
      },
      {
        path: '/protocol/:protocolId/audio',
        element: <ProtocolAudioPage />,
      },
      {
        path: '/quick/:mode',
        element: <QuickBuilderPage />,
      },
      {
        path: '/settings',
        element: <SettingsPage />,
      },
      {
        path: '/voices',
        element: <VoicesPage />,
      },
      {
        path: '/history',
        element: <HistoryPage />,
      },
    ],
  },
  {
    path: '/protocol/:protocolId/run',
    element: <ExecutionPage />,
  },
  {
    path: '*',
    element: <Navigate to="/library" replace />,
  },
])
