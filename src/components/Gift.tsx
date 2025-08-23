import React from "react";
import { FaCrown } from "react-icons/fa";

// Interface for component props
interface GiftProps {
  name: string;
  winner: string | null;
  staff: string | null;
}

const Gift: React.FC<GiftProps> = ({ name, winner, staff }) => {
  const displayWinner = winner != null ? winner : "Pending";
  const displayStaff = staff != null ? staff : "";

  return (
    <section className="relative m-1 p-2 cursor-pointer rounded-3xl flex flex-col justify-center flex-shrink-0 overflow-hidden bg-gradient-to-b from-slate-800 via-slate-900 to-slate-800 border-4 border-gray-200 text-gray-200 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 hover:scale-105">
      <div className="w-80 flex flex-row items-center">
        <h3 className="w-56 font-bold text-base m-0 truncate">
          {name}
        </h3>
        <div className="flex flex-col items-center w-28">
          <h2 className="flex flex-row items-center justify-center text-sm font-normal m-0 text-amber-300">
            <FaCrown className="mr-1" /> Winner
          </h2>
          <h2 className="text-xl font-black m-0 text-center break-words">
            {displayWinner}
          </h2>
          <h3 className="text-xs font-black m-0 text-center break-words text-gray-300">
            {displayStaff}
          </h3>
        </div>
      </div>
    </section>
  );
};

export default Gift;