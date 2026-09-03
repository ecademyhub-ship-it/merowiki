import { Link } from "react-router-dom";
import { CalendarDays, ArrowRight } from "lucide-react";
import { blogs } from "../data/blogs";

function Blogs() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">

        {/* Header */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Mero Wiki
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Blogs
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
            Helpful tips, guides, and information about finding and
            hiring trusted local professionals.
          </p>
        </div>

        {/* Blog Grid */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <article
              key={blog.id}
              className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-md"
            >
              {/* Image Placeholder */}
              <div className="flex h-40 items-center justify-center bg-blue-50 text-4xl">
                📝
              </div>

              <div className="p-5">

                {/* Category */}
                <span className="text-xs font-semibold text-blue-600">
                  {blog.category}
                </span>

                {/* Title */}
                <h2 className="mt-2 line-clamp-2 text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                  {blog.title}
                </h2>

                {/* Excerpt */}
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-500">
                  {blog.excerpt}
                </p>

                {/* Date */}
                <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                  <CalendarDays size={14} />
                  {blog.date}
                </div>

                {/* Read */}
                <Link
                  to={`/blogs/${blog.id}`}
                  className="mt-5 flex items-center gap-1 text-sm font-semibold text-blue-600 transition group-hover:gap-2"
                >
                  Read More
                  <ArrowRight size={16} />
                </Link>

              </div>
            </article>
          ))}
        </div>

      </div>
    </main>
  );
}

export default Blogs;