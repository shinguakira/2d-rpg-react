import { Links, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';
import type { LinksFunction } from '@remix-run/node';

import './tailwind.css';
import GameBoyTextBox from './components/GameBoyTextBox';

// Add global styles to remove scrollbars
const globalStyles = `
  html, body {
    margin: 0;
    padding: 0;
    overflow: hidden;
    height: 100%;
    width: 100%;
  }
  
  /* Hide scrollbar for Chrome, Safari and Opera */
  ::-webkit-scrollbar {
    display: none;
  }
  
  /* Hide scrollbar for IE, Edge and Firefox */
  html {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
`;

export const links: LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <style dangerouslySetInnerHTML={{ __html: globalStyles }} />
      </head>
      <body className="overflow-hidden">
        {children}
        <GameBoyTextBox />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
