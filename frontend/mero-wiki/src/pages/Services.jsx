import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import SectionHeading from "../components/common/SectionHeading";
import ServiceCard from "../components/services/ServiceCard";
import { services, categoryGroups } from "../data/services";

function Services() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(null);

  // Get unique groups
  const groups = useMemo(() => {
    return categoryGroups.map(g => g.group);
  }, []);

  // Filter services based on search term
  const filteredServices = useMemo(() => {
    return services.filter((service) =>
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Group filtered services
  const groupedServices = useMemo(() => {
    if (selectedGroup) {
      const group = categoryGroups.find(g => g.group === selectedGroup);
      if (group) {
        return {
          [selectedGroup]: filteredServices.filter(s => 
            group.categories.includes(s.category)
          )
        };
      }
      return {};
    }

    const grouped = {};
    categoryGroups.forEach(({ group, categories }) => {
      const groupServices = filteredServices.filter(s => 
        categories.includes(s.category)
      );
      if (groupServices.length > 0) {
        grouped[group] = groupServices;
      }
    });
    return grouped;
  }, [filteredServices, selectedGroup]);

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <SectionHeading
          eyebrow="Services"
          title="Explore all services"
          description="Find trusted professionals across a wide range of services."
        />

        {/* Search Bar */}
        <div className="mt-8 flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search services by name or category..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setSelectedGroup(null);
              }}
              className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 text-gray-900 placeholder-gray-400 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Category Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedGroup(null)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                selectedGroup === null
                  ? "bg-blue-600 text-white"
                  : "border border-gray-300 bg-white text-gray-700 hover:border-gray-400"
              }`}
            >
              All Categories
            </button>
            {groups.map((group) => (
              <button
                key={group}
                onClick={() => setSelectedGroup(group)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  selectedGroup === group
                    ? "bg-blue-600 text-white"
                    : "border border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                }`}
              >
                {group}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid by Category Groups */}
        <div className="mt-12 space-y-12">
          {Object.entries(groupedServices).map(([group, groupServices]) => (
            <div key={group}>
              <div className="mb-6 flex items-center gap-3">
                <h2 className="text-2xl font-bold text-gray-900">{group}</h2>
                <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-600">
                  {groupServices.length}
                </span>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {groupServices.map((service) => (
                  <ServiceCard
                    key={service.id}
                    icon={service.icon}
                    title={service.title}
                    description={service.description}
                    category={service.category}
                    color={service.color}
                    iconColor={service.iconColor}
                  />
                ))}
              </div>
            </div>
          ))}

          {Object.keys(groupedServices).length === 0 && (
            <div className="rounded-lg border border-gray-200 bg-white py-12 text-center">
              <p className="text-gray-500">
                No services found matching "{searchTerm}". Try a different search term.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default Services;