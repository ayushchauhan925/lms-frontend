import { useRef, useEffect } from "react";
import { Maximize2, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

/**
 * Props:
 *   videoUrl         string   — URL of the video to play
 *   lectureId        string   — current lecture _id (for full screen route)
 *   courseId         string   — current course _id (for full screen route)
 *   onEnded          fn()     — called when video finishes playing
 */
const VideoPlayer = ({ videoUrl, lectureId, courseId, onEnded }) => {
  const videoRef = useRef(null);
  const navigate = useNavigate();

  // Reload video when lecture changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {}); // autoplay if browser allows
    }
  }, [videoUrl]);

  const handleFullScreen = () => {
    navigate(`/student/learn/${courseId}/lecture/${lectureId}`);
  };

  if (!videoUrl) return (
    <div className="w-full aspect-video bg-slate-900 rounded-2xl flex flex-col items-center justify-center gap-3">
      <BookOpen size={36} className="text-slate-600" />
      <p className="text-sm text-slate-500">No video available</p>
    </div>
  );

  return (
    <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden group">

      {/* Video */}
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        controls
        onEnded={onEnded}
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Full screen button — shown on hover */}
      <button
        onClick={handleFullScreen}
        title="Open full view"
        className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white p-2 rounded-xl opacity-0 group-hover:opacity-100 transition duration-200 z-10"
      >
        <Maximize2 size={15} />
      </button>

    </div>
  );
};

export default VideoPlayer;