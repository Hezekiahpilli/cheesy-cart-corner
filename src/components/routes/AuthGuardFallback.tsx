const AuthGuardFallback = () => (
  <div className="flex items-center justify-center py-16">
    <div className="h-6 w-6 animate-spin rounded-full border-2 border-pizza-600 border-t-transparent" />
    <span className="ml-3 text-sm text-gray-600">Preparing your experience...</span>
  </div>
);

export default AuthGuardFallback;
