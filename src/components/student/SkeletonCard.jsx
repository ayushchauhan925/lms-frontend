const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-pulse">

    {/* Thumbnail */}
    <div className="h-44 bg-slate-100 relative">
      <div className="absolute top-3 left-3 h-5 w-20 bg-slate-200 rounded-full" />
    </div>

    {/* Body */}
    <div className="p-5 space-y-3">

      {/* Category */}
      <div className="h-3 w-24 bg-slate-100 rounded-full" />

      {/* Title */}
      <div className="h-4 w-full bg-slate-100 rounded-full" />
      <div className="h-4 w-3/4 bg-slate-100 rounded-full" />

      {/* Instructor */}
      <div className="h-3 w-32 bg-slate-100 rounded-full" />

      {/* Progress bar */}
      <div className="space-y-1.5 pt-1">
        <div className="flex justify-between">
          <div className="h-3 w-24 bg-slate-100 rounded-full" />
          <div className="h-3 w-10 bg-slate-100 rounded-full" />
        </div>
        <div className="h-2 w-full bg-slate-100 rounded-full" />
      </div>

      {/* Meta row */}
      <div className="flex gap-3 pt-1">
        <div className="h-3 w-16 bg-slate-100 rounded-full" />
        <div className="h-3 w-16 bg-slate-100 rounded-full" />
      </div>

      {/* Button */}
      <div className="h-10 w-full bg-slate-100 rounded-xl pt-1" />

      {/* Last accessed */}
      <div className="h-3 w-36 bg-slate-100 rounded-full mx-auto" />

    </div>
  </div>
);

export default SkeletonCard;