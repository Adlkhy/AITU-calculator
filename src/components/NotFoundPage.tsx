    import { useNavigate } from "react-router-dom";
    function NotFoundPage() {
      const navigate = useNavigate();
      return (
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="font-mono text-primary text-xl sm:text-2xl md:text-3xl">404 - Error</h1>
          <p className="text-center text-foreground text-2xl sm:text-3xl lg:text-4xl">This page doesn’t exist.< br /> Pibble’s belly still does. Wash it.</p>
          <p className="mt-2 font-bold text-foreground text-xl sm:text-2xl lg:text-3xl">WASH MY BELLY</p>
          <div className="flex flex-col items-center">
            <img src="/pibble.png" alt="Not Found Illustration" className="w-64 sm:w-80 md:w-96 mt-4" />
            <div className="absolute bottom-[33%] w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 cursor-grab" onClick={() => navigate('/calculator', { replace: true })}></div>
          </div>
        </div>
      );
    }

    export default NotFoundPage;