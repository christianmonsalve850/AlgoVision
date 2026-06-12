interface ErrorBannerProps {
  message: string;
}

export function ErrorBanner({ message }: ErrorBannerProps) {
  return <div className="bg-red-50 text-red-600 p-3 rounded">{message}</div>;
}