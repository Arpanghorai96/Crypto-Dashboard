import React, { useState, useEffect } from 'react';

const API_URL =
  'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false';

const App = () => {
  const [coins, setCoins] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sorted, setSorted] = useState(false);

  const fetchDataWithThen = () => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => {
        setCoins(data);
      })
      .catch((error) => console.error('Error fetching data:', error));
  };

  const fetchDataWithAsync = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setCoins(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchDataWithAsync();
  }, []);


  const handleSearch = () => {
    if (searchTerm) {
      setCoins((prevCoins) =>
        prevCoins.filter((coin) =>
          coin.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      fetchDataWithAsync();
    }
  };


  const sortByMarketCap = () => {
    const sortedData = [...coins].sort((a, b) => b.market_cap - a.market_cap);
    setCoins(sortedData);
    setSorted(true);
  };


  const sortByPercentageChange = () => {
    const sortedData = [...coins].sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
    setCoins(sortedData);
    setSorted(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-extrabold text-center text-blue-600 mb-8">Crypto Dashboard</h1>
      <div className="flex justify-center space-x-4 mb-6">
        <input
          type="text"
          placeholder="Search by name"
          className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-1/3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Search
        </button>
        <button
          onClick={sortByMarketCap}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition duration-300"
        >
          Sort by Market Cap
        </button>
        <button
          onClick={sortByPercentageChange}
          className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition duration-300"
        >
          Sort by % Change
        </button>
      </div>

      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <tbody>
          {coins.map((coin) => (
            <tr key={coin.id} className="hover:bg-gray-50">
              <td className="border px-4 py-2">
                <img src={coin.image} alt={coin.name} className="w-10 h-10 rounded-full" />
              </td>
              <td className="border px-4 py-2">{coin.name}</td>
              <td className="border px-4 py-2 uppercase">{coin.symbol}</td>
              <td className="border px-4 py-2 text-green-600">${coin.current_price.toFixed(2)}</td>
              <td className="border px-4 py-2">Mkt Cap: {coin.total_volume.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
