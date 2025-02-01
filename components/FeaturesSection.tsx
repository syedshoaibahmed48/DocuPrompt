import { FileText, MessageSquare, FileSearch, Files } from "lucide-react"

const features = [
  {
    title: "Smart File Insights",
    description: "Quickly extract valuable insights and key information from uploaded files with the power of AI.",
    icon: FileSearch,
  },
  {
    title: "Contextual AI Responses",
    description: "Get answers tailored to the content of your file for a highly relevant and personalized experience.",
    icon: MessageSquare,
  },
  {
    title: "Instant File Summaries",
    description: "Simplify complex documents with concise summaries and quick answers at your fingertips.",
    icon: FileText,
  },
  {
    title: "Wide File Format Compatibility",
    description:
      "Upload and work seamlessly with a variety of file types, including PDFs, Word documents, and text files.",
    icon: Files,
  },
]

export default function FeaturesSection() {
  return (
      <div className="max-w-full px-4 mx-auto">
        <h2 className="text-4xl font-bold text-center mb-8">
          Powerful <span className="text-gradient">Features</span> at Your
          Fingertips
        </h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative group bg-neutral-900 p-6 rounded-lg overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-blue-500"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out" />
              <div className="relative z-10">
                <feature.icon className="h-8 w-8 text-white mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">{feature.title}</h3>
                <p className="text-neutral-300">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
  )
}

