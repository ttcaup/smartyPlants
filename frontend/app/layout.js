import './globals.css';

export const metadata = {
  title: 'SmartyPlants',
  description: 'A smarter home plant monitoring and watering system.',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  );
}
