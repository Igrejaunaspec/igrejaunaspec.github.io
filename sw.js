// Service worker minimo: so existe pra o site poder ser instalado como app.
// Nao guarda nada em cache -- tudo vem sempre da rede (dados sempre atuais).
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', () => {});
