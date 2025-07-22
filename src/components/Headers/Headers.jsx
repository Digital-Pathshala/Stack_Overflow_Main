// import '../css/Headers.css';
import SearchIcon from "@mui/icons-material/Search";
import InboxIcon from "@mui/icons-material/Inbox";
import { Avatar } from "@mui/material";

function Headers() {
  return (
    <header>
      <div className="header-container">
        <div className="header-left">
          <img
            src="https://i.sstatic.net/pIgix.png"
            alt="Logo Of Digital Pathsala"
          />
          <h3>Products</h3>
        </div>
        <div className="header-middle"></div>
        <div className="header-search-container">
          <SearchIcon />
         <input type="text" placeholder="Search..." />

        </div>
        <div className="header-right">
          <div className="header-right-container">
            <Avatar />
            <InboxIcon />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Headers;
