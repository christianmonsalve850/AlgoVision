interface ErrorBannerProps {
  message: string;
}

export function ErrorBanner({ message }: ErrorBannerProps) {
  return (
    <div className="mb-2 flex h-10 w-full max-w-md items-center rounded-md border border-destructive/30 bg-destructive/10 px-3 text-sm text-destructive">
      {message}
    </div>
  );
}
