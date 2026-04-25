import useSessionTimeout from "../hooks/useSessionTimeout";

export default function AppLayout({ children }) {
 const { showWarning, resetTimer } = useSessionTimeout({
  sessionDuration: 5000,     // 5 sec total
  warningDuration: 2000      // warning at 3 sec
});

  return (
    <>
      {children}

      {showWarning && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-6 w-[350px] text-center">
            <h2 className="text-xl font-bold text-red-600">
              Session Expiring!
            </h2>
            <p className="mt-2">
              You will be logged out in 15 seconds.
            </p>

            <div className="mt-4 flex justify-center gap-3">
              <button
                onClick={resetTimer}
                className="bg-green-600 text-white px-4 py-2 rounded-md"
              >
                Stay Logged In
              </button>

              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.href = "/login";
                }}
                className="bg-red-600 text-white px-4 py-2 rounded-md"
              >
                Logout Now
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
