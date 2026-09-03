function SectionHeading({ eyebrow, title, description }) {
  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
        {eyebrow}
      </p>

      <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        {title}
      </h2>

      <p className="mt-3 max-w-2xl text-gray-600">
        {description}
      </p>
    </div>
  );
}

export default SectionHeading;