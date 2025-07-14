import './globals.css';

export const metadata = {
  title: 'Shitovod',
  description: 'Money Counting Game',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
