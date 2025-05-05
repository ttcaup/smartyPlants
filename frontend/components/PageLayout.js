'use client';
import { AppShell, Grid, MantineProvider, NavLink } from '@mantine/core';
import '@mantine/core/styles.css';

function PageLayout({ children }) {
  return (
    <MantineProvider>
      <AppShell header={{ height: 40 }} padding="md">
        <AppShell.Header>
          {/* Grid to position moved to left side */}
          <Grid justify="flex-start" align="center">
            <Grid.Col span={2}>
              <NavLink href="/" label="Home" />
            </Grid.Col>
            <Grid.Col span={2}>
              <NavLink href="/plants" label="All Plants" />
            </Grid.Col>
          </Grid>
        </AppShell.Header>
        <AppShell.Main>{children}</AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
}

export default PageLayout;
