/*frontend\components\PageLayout.js*/
/*deals with page layout - header*/
'use client';
import { AppShell, Image } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import Link from 'next/link';

function PageLayout({ children }) {
  const navLinkStyle = {
    color: '#2e4730',
    textDecoration: 'none',
    fontSize: '1.25rem',
    fontWeight: '500',

    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    transition: 'text-decoration 0.2s ease',
  };

  return (
    <AppShell header={{ height: 70 }} padding="md">
      <AppShell.Header
        style={{
          borderBottom: '2px solid #a5b49f',
          backgroundColor: '#f9f8f4',
          display: 'flex',
          alignItems: 'center',
          padding: '0 2rem',
          gap: '2rem',
        }}
      >
        {/* Logo */}
        <Link href="/">
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={40}
            height={40}
            fit="contain"
            style={{ marginRight: '10px', verticalAlign: 'middle' }}
          />
        </Link>

        {/* Navigation */}
        <div style={{ display: 'flex', gap: '2rem' }}>
          <Link
            href="/"
            style={navLinkStyle}
            onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
            onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
          >
            Home <IconChevronDown size={16} />
          </Link>
          <Link
            href="/plants"
            style={navLinkStyle}
            onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
            onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
          >
            All Plants <IconChevronDown size={16} />
          </Link>
        </div>
      </AppShell.Header>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}

export default PageLayout;
