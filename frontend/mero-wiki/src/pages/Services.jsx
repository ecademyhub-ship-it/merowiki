import SectionHeading from "../components/common/SectionHeading";
import ServiceCard from "../components/services/ServiceCard";
import { services } from "../data/services";

function Services() {
  return (
    <main className="min-h-screen bg-gray-50">
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <SectionHeading
          eyebrow="Services"
          title="Explore all services"
          description="Find trusted professionals across a wide range of services."
        />

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              icon={service.icon}
              title={service.title}
              description={service.description}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

export default Services;