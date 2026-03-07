import Navbar from "../components/Navbar";

export default function PlaceholderPage({ title }) {
  return (
    <div className="min-h-screen w-full bg-[#f7f2e9] p-3">
      <Navbar />

      <main className="mt-4">
        <section className="rounded-3xl border border-[#ecdcc8] bg-white p-8 shadow-sm min-h-190">
          <h1 className="text-2xl font-bold text-[#1f1f1f]">{title}</h1>
          <p className="mt-3 text-[#6b6b6b]">
            This page is a placeholder for future content.
          </p>
        </section>
      </main>
    </div>
  );
}