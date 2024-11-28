import Header from "./Header";

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow max-w-6xl w-full mx-auto p-4">{children}</main>
    </div>
  );
}
