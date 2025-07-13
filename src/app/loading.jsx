const Loading = () => {
    return (
      <div className="w-full h-screen flex justify-center items-center relative">
        {/* Rotating Dots */}
        <div className="absolute w-40 h-40 flex justify-center items-center">
          <span className="w-4 h-4 bg-blue-400 rounded-full absolute animate-orbit delay-0"></span>
          <span className="w-4 h-4 bg-blue-400 rounded-full absolute animate-orbit delay-200"></span>
          <span className="w-4 h-4 bg-blue-400 rounded-full absolute animate-orbit delay-400"></span>
        </div>
      </div>
    );
  };
  
  export default Loading;
  