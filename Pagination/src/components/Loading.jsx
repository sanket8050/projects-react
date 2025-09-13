const Loading = () => (
  <div className="flex flex-col items-center justify-center h-screen space-y-4">
    <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-500"></div>
    <p className="text-gray-600 font-medium">Fetching Products...</p>
  </div>
);


export default Loading;
