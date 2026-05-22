import prisma from "@/lib/prisma";
import { Star } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ReviewsPage() {
  const reviews = await prisma.review.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  const avgRating = reviews.length > 0
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0;

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-block rounded-full bg-red-50 border border-red-200 px-4 py-1 text-sm font-semibold text-red-600 mb-4">
            Customer Reviews
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-black tracking-tight mb-4">
            What our users say
          </h1>
          {reviews.length > 0 && (
            <div className="flex items-center justify-center gap-3 mt-4">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(i => (
                  <Star key={i} className={`w-5 h-5 ${i <= Math.round(avgRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                ))}
              </div>
              <span className="text-xl font-bold text-black">{avgRating.toFixed(1)}</span>
              <span className="text-gray-500 text-sm">from {reviews.length} review{reviews.length !== 1 ? "s" : ""}</span>
            </div>
          )}
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-20 text-gray-400">No reviews published yet.</div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {reviews.map(review => (
              <div key={review.id} className="break-inside-avoid bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                {review.tag && (
                  <span className={`inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full mb-4 ${review.tagDark ? "bg-red-600 text-white" : "bg-gray-100 text-gray-600"}`}>
                    {review.tag}
                  </span>
                )}
                <div className="flex gap-0.5 mb-3">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star key={i} className={`w-4 h-4 ${i <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-5">&ldquo;{review.content}&rdquo;</p>
                <div className="flex items-center gap-3">
                  {review.authorImage ? (
                    <img src={review.authorImage} alt={review.authorName} className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-sm">
                      {review.authorName.charAt(0)}
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-semibold text-black">{review.authorName}</div>
                    {review.authorRole && <div className="text-xs text-gray-400">{review.authorRole}</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
