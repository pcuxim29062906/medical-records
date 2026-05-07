'use client'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/theme/theme'; // Tu archivo de configuración de tema

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}

/*
import { requireUser } from '@/app/actions/auth/auth';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireUser();

  return <>{children}</>;
}


'use client';

import { Button } from '@mui/material';
import { logoutUser } from '@/app/actions/auth/auth';

export default function LogoutButton() {
  return (
    <Button color="inherit" onClick={() => logoutUser()}>
      Cerrar sesión
    </Button>
  );
}

*/