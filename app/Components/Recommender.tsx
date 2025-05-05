"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Timer,
  Activity,
  Laptop,
  Loader2,
} from "lucide-react";

type Assessment = {
  url: string;
  adaptive_support: string;
  description: string;
  duration: number;
  remote_support: string;
  test_type: string[];
};

type RecommendationResponse = {
  recommended_assessments: Assessment[];
};

export default function Recommender() {
  const [query, setQuery] = useState<string>(
    "Looking to hire someone skilled in Python, SQL, and JavaScript"
  );
  const [response, setResponse] = useState<RecommendationResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResponse(null);

   try {
  const res = await fetch("https://api-g7q1.onrender.com/recommend", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ job_description: query }),
  });

  if (!res.ok) {
    throw new Error(`Server responded with ${res.status}`);
  }

  const data = await res.json();
  // use `data` here
} catch (error) {
  console.error("Fetch error:", error);
}

      const data: RecommendationResponse = await res.json();

      const normalizedData: RecommendationResponse = {
        recommended_assessments: data.recommended_assessments.map((a) => ({
          ...a,
          test_type: a.test_type.map((code) =>
            code === "K"
              ? "Knowledge & Skills"
              : code === "S"
              ? "Simulations"
              : code === "C"
              ? "Competencies"
              : code === "P"
              ? "Personality & Behaviour"
              : code === "A"
              ? "Ability & Aptitude"
              : code === "B"
              ? "Biodata & Situational Judgement"
              : code === "D"
              ? "Development & 360"
              : code === "E"
              ? "Assessment & Exercises"
              : code
          ),
        })),
      };

      setResponse(normalizedData);
    } catch (err) {
      setError("Onrender API service down, please try again later 😭");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      {/* Form */}
      <div className="bg-white rounded-xl shadow-md p-8 mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          🧠 AI Assessment Recommender
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <textarea
              id="query"
              rows={4}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="peer w-full rounded-md border text-gray-800 border-gray-600 bg-gray-50 px-4 pt-6 pb-2 text-sm placeholder-transparent focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              placeholder="Paste job description here..."
            />
            <label
              htmlFor="query"
              className="absolute left-4 top-2 text-xs text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-orange-500"
            >
              Job description or role requirements
            </label>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center px-6 py-3 text-white bg-gray-800 hover:bg-black rounded-lg transition disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
                Analyzing...
              </>
            ) : (
                <span>Get Recommendations</span>
            )}
          </button>
        </form>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-100 text-red-800 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      {/* Results */}
      <AnimatePresence>
        {isLoading && !response && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-lg bg-gray-100 h-48"
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {response && (
        <>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">
              Recommended Assessments
            </h3>
            <span className="text-sm text-green-600 font-medium">
              {response.recommended_assessments.length} results
            </span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {response.recommended_assessments.map((a, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition"
              >
                <h4 className="text-md font-semibold text-gray-700 mb-2 hover:underline">
                  <a href={a.url} target="_blank" rel="noopener noreferrer">
                    {a.description}
                  </a>
                </h4>
                <div className="flex flex-wrap gap-2 text-xs">
                  <Badge icon={<Timer className="h-4 w-4" />} text={`${a.duration} min`} />
                  {a.test_type.map((type, j) => (
                    <Badge key={j} icon={<Sparkles className="h-4 w-4" />} text={type} />
                  ))}
                  <Badge
                    icon={<Activity className="h-4 w-4" />}
                    text={`Adaptive: ${a.adaptive_support}`}
                    variant={a.adaptive_support === "Yes" ? "green" : "gray"}
                  />
                  <Badge
                    icon={<Laptop className="h-4 w-4" />}
                    text={`Remote: ${a.remote_support}`}
                    variant={a.remote_support === "Yes" ? "green" : "gray"}
                  />
                </div>
                <div className="mt-4">
                  <a
                    href={a.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-sm text-white bg-orange-600 hover:bg-orange-700 px-3 py-1 rounded-md"
                  >
                    View Details
                  </a>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 bg-blue-50 p-6 rounded-lg">
            <h4 className="text-md font-bold text-gray-900 mb-2">
              How these were selected
            </h4>
            <p className="text-sm text-gray-700">
              The system analyzes your job description, matching it with SHL’s
              assessment catalog based on skills, level, and time preferences.
              Assessments shown are most relevant for your needs.
            </p>
          </div>
        </>
      )}
    </main>
  );
}

function Badge({
  icon,
  text,
  variant = "default",
}: {
  icon: React.ReactNode;
  text: string;
  variant?: "default" | "green" | "gray";
}) {
  const base = "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium";
  const variants = {
    default: "bg-purple-100 text-purple-800",
    green: "bg-green-100 text-green-800",
    gray: "bg-gray-100 text-gray-800",
  };
  return <span className={`${base} ${variants[variant]}`}>{icon} {text}</span>;
}
