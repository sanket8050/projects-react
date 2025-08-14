// Simple Card component replacements for shadcn/ui
export default function Card({ children, className = "", ...props }) {
  return <div className={`bg-white rounded shadow ${className}`} {...props}>{children}</div>;
}

export function CardHeader({ children, className = "", ...props }) {
  return <div className={`border-b px-4 py-2 ${className}`} {...props}>{children}</div>;
}

export function CardTitle({ children, className = "", ...props }) {
  return <h2 className={`font-bold text-lg ${className}`} {...props}>{children}</h2>;
}

export function CardContent({ children, className = "", ...props }) {
  return <div className={`p-4 ${className}`} {...props}>{children}</div>;
}
