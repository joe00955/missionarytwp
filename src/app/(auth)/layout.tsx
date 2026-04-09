export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden z-10">
      <div className="relative z-10 w-full max-w-md px-6">{children}</div>
    </div>
  );
}
