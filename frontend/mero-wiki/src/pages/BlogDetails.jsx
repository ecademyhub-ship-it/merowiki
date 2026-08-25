import { ArrowLeft, CalendarDays } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { blogs } from "../data/blogs";
import Button from "../components/common/Button";

function BlogDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const blog = blogs.find(
    (item) => item.id === Number(id)
  );

  if (!blog) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">

          <h1 className="text-2xl font-bold text-gray-900">
            Blog not found
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            The blog you're looking for doesn't exist.
          </p>

          <div className="mt-6">
            <Button onClick={() => navigate("/blogs")}>
              Back to Blogs
            </Button>
          </div>

        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-6 py-10 lg:px-8">

        {/* Back */}
        <button
          type="button"
          onClick={() => navigate("/blogs")}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600"
        >
          <ArrowLeft size={18} />
          Back to Blogs
        </button>

        {/* Article */}
        <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-10">

          <span className="text-sm font-semibold text-blue-600">
            {blog.category}
          </span>

          <h1 className="mt-3 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
            {blog.title}
          </h1>

          <div className="mt-4 flex items-center gap-2 text-sm text-gray-400">
            <CalendarDays size={16} />
            {blog.date}
          </div>

          <div className="mt-8 border-t border-gray-100 pt-8">
            <p className="text-base leading-8 text-gray-600">
              {blog.content}
            </p>
          </div>

        </article>

      </div>
    </main>
  );
}

export default BlogDetails;