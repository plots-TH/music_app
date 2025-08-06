import React, { useEffect, useState } from "react";
import axios from "axios";
import TagCardList from "./TagCardList";

function DropDownMenu({ children }) {
  // state for menu visibility
  const [isOpen, setIsOpen] = useState(false);

  // capture event for scrolling
  const handleScroll = (e) => {};

  const toggleDropDown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <button className="dropdown-button" onClick={toggleDropDown}>
        Drop Down Button
      </button>
      {isOpen && (
        <div className="dropdown-container">
          <div
            onScroll={handleScroll}
            style={{
              height: "200px",
              overflowY: "auto",
              border: "1px solid black",
            }}
          >
            <span>Filter playlists by toggling tags:</span>
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

export default DropDownMenu;
