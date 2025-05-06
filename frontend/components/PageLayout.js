'use client';
import { AppShell, Grid, NavLink, Image } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import Link from 'next/link';

function PageLayout({ children }) {
  return (
    <AppShell header={{ height: 70 }} padding="md">
      <AppShell.Header
        style={{
          borderBottom: '2px solid #a5b49f',
          backgroundColor: '#f9f8f4',
        }}
      >
        <Grid align="center" justify="space-between" style={{ padding: '0 1.5rem', height: '100%' }}>
          <Grid.Col span="content">
            <Link href="/">
              <Image
                src="/logo.png"
                alt="Logo"
                width={32}
                height={32}
                fit="contain"
                style={{ marginRight: '10px', verticalAlign: 'middle' }}
              />
            </Link>
          </Grid.Col>

          <Grid.Col span="content">
            <NavLink
              href="/"
              label={
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  Home <IconChevronDown size={14} />
                </span>
              }
            />
          </Grid.Col>

          <Grid.Col span="content">
            <NavLink
              href="/plants"
              label={
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  All Plants <IconChevronDown size={14} />
                </span>
              }
            />
          </Grid.Col>
        </Grid>
      </AppShell.Header>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}

export default PageLayout;
