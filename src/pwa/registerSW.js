import { registerSW } from 'virtual:pwa-register'

registerSW({
  immediate: true,
  onRegistered(r) {
    console.log('Service Worker registered:', r)
  },
  onOfflineReady() {
    console.log('App is ready to work offline')
  },
  onNeedRefresh() {
    console.log('New version available. Refresh to update.')
  },
  onRegisterError(error) {
    console.error('Service Worker registration error:', error)
  }
})
