import { LoaderCircle } from "lucide-react";

function LoadingSpinner({ text = "Loading..." }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <LoaderCircle
          size={32}
          className="animate-spin text-[#FF5A36]"
        />
        <p className="text-sm font-semibold text-[#A6ABB2]">
          {text}
        </p>
      </div>
    </div>
  );
}

export default LoadingSpinner;