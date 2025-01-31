'use client'

interface ErrorDisplayProps {
  title: string
  message: string
  buttonText: string
  href?: string
}

export default function ErrorDisplay({ title, message, buttonText, href }: ErrorDisplayProps) {
  const handleClick = () => {
    if (href) {
      window.location.href = href
    } else {
      window.location.reload()
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">{title}</h1>
        <p className="text-gray-400 mb-6">{message}</p>
        <button
          onClick={handleClick}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm transition-all duration-200"
        >
          {buttonText}
        </button>
      </div>
    </div>
  )
}