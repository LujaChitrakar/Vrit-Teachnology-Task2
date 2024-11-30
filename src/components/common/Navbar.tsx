import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

const Navbar = () => {
  const [searchField, setSearchField] = useState("");

  console.log(searchField);
  return (
    <div>
      <nav className="">
        <ul className=" flex bg-slate-500 justify-between p-5  w-full items-center">
          <li className="font-bold text-[18px]">Luja's Kanban Board</li>
          <li className="relative flex items-center">
            <input
              type="text"
              value={searchField}
              onChange={(e) => {
                setSearchField(e.target.value);
              }}
              placeholder="Search"
              className="pl-10 py-2 rounded w-60 focus:outline-none"
            />
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="absolute left-3 text-black"
            />
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
