import {RenderMode, ServerRoute} from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {path: '', renderMode: RenderMode.Prerender},
  {path: 'cart/:itemId', renderMode: RenderMode.Server},
  {path: 'orders/:orderId', renderMode: RenderMode.Server},
  {path: 'product/:itemId', renderMode: RenderMode.Server},
  {path: 'products/:gender', renderMode: RenderMode.Server},
  {path: 'products/:gender/:categoryId', renderMode: RenderMode.Server},
  {path: 'products/:gender/:categoryId/:itemId', renderMode: RenderMode.Server},
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
