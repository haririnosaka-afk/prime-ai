export const metadata = {
  title: "PRIME AI",
  description: "AI Video Generator by PRIME AI"
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body style={{ margin: 0 }}>
        {children}
      </body>
    </html>
  );
}
