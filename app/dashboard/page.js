import ButtonLogout from "@/components/ButtonLogout";
import FormNewBoard from "@/components/FormNewBoard";

export default function Dashboard() {
  return (
    <main className="bg-base-200 min-h-screen">
      {/* HEADER */}
      <section className="bg-base-100">
        <div className="max-w-5xl mx-auto px-5 py-3 flex justify-end">
          <ButtonLogout />
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="max-w-5xl mx-auto px-5 py-12">
        <FormNewBoard />
      </section>
    </main>
  );
}
