import React from "react";
import Gift from "./Gift";

// Interface for individual gift/winner data
interface WinnerGift {
  gift_id: string;
  gift_name: string;
  gift_winner: string;
  gift_winner_name: string;
}

// Interface for component props
interface WinnerListProps {
  listWinner: WinnerGift[];
  isSelected: boolean;
}

const WinnerList: React.FC<WinnerListProps> = ({ listWinner, isSelected }) => {
  return (
    <section className="flex flex-wrap flex-row justify-center py-4 px-0 gap-2">
      {listWinner.map((gift) => (
        <Gift
          key={gift.gift_id}
          name={gift.gift_name}
          winner={gift.gift_winner}
          staff={gift.gift_winner_name}
        />
      ))}
    </section>
  );
};

export default WinnerList;