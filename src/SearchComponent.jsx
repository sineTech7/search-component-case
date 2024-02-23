import React, { useState, useEffect } from "react";
import "./searchComponent.css";

// 模拟后台提供数据
const search = async (keywords) => {
  const delay = Math.random() * 9000 + 1000;
  await new Promise((resolve) => setTimeout(resolve, delay));

  return [
    { name: "06908e", address: "0x1234567890123456789012345678901234567890" },
    { name: "6067c7", address: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcdef" },
    { name: "C106Aa", address: "0x9876543210987654321098765432109876543210" },
    { name: "CFB06C", address: "0xdCD57c947C4BFe00B84fECFFd4d4956f85C23552" },
  ];
};

// 高亮匹配的文本
const highlightText = (text, keywords) => {
  if (!keywords) return text;
  const parts = text.split(new RegExp(`(${keywords})`, "gi"));
  return parts.map((part, index) =>
    part.toLowerCase() === keywords.toLowerCase() ? (
      <span key={index} className="highlighted-text">
        {part}
      </span>
    ) : (
      part
    )
  );
};

// 格式化地址，只显示前8位和后8位，中间用省略号表示
const formatAddress = (address) => {
  return (
    address.substring(0, 8) + "..." + address.substring(address.length - 8)
  );
};

// 生成随机的颜色值
const randomColor = () => {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
};

// 展示搜索结果组件
const SearchResult = ({ results, keywords }) => {
  return (
    <ul className="search-results">
      {results.map((result) => (
        <li className="search-item" key={result.address}>
          <div className="hexagon" style={{ backgroundColor: randomColor() }}>
            <span>{result.name.slice(0, 2)}</span>
          </div>
          <div>
            <div className="result-item">
              <strong>Name:</strong> {highlightText(result.name, keywords)}
            </div>
            <div className="result-item">
              <strong>Address:</strong> {formatAddress(result.address)}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

// 搜索组件
const SearchComponent = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [keywords, setKeywords] = useState("");
  const [searching, setSearching] = useState(false);

  // 防抖
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (keywords) {
        handleSearch(keywords);
      } else {
        setSearchResults([]);
        setSearching(false);
      }
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [keywords]);

  const handleSearch = async (keywords) => {
    setSearching(true);
    const results = await search(keywords);
    setSearchResults(results);
    setSearching(false);
  };

  return (
    <div className="search-container">
      <div className="search-input-wrapper">
        <div className="search-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        <input
          className="search-input"
          type="text"
          placeholder="Search..."
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
        />
      </div>
      {searching ? (
        <div className="search-status">Searching...</div>
      ) : (
        <SearchResult results={searchResults} keywords={keywords} />
      )}
    </div>
  );
};

export default SearchComponent;
