import { useEffect, useState } from "react";

async function fetchProducts(category, keyword, sortOption) {
  const response = await fetch('products.json');
  const data = await response.json();

  const filteredData = data.filter((item) => {
    return (
      (category === 'all' || category === item.type) &&
      (!keyword || item.name.includes(keyword))
    );
  });

  if (sortOption === 'popular') {
    filteredData.sort((a, b) => (b.songs[0].popularity || 0) - (a.songs[0].popularity || 0));
  } else if (sortOption === 'newest') {
    filteredData.sort((a, b) => new Date(b.songs[0].data) - new Date(a.songs[0].data));
  } else if (sortOption === 'oldest') {
    filteredData.sort((a, b) => new Date(a.songs[0].data) - new Date(b.songs[0].data));
  }

  return filteredData;
}

export default function App() {
  const [products, setProducts] = useState([]);
  const [sortOption, setSortOption] = useState('popular');
  const [sortInfo, setSortInfo] = useState('');

  const formatPopularity = (popularity) => {
    const billion = popularity / 100000000;
    const million = popularity % 100000000;

    if (popularity >= billion) {
      return `${billion.toFixed(1)}億回`;
    } else if (popularity >= million) {
      return `${million.toFixed(1)}百万回`;
    } else {
      return `${popularity}回`;
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchProducts("all", "", sortOption);
      setProducts(data);

      // Set sort information for display
      if (sortOption === 'popular') {
        setSortInfo('人気順');
      } else if (sortOption === 'newest') {
        setSortInfo('新しい順');
      } else if (sortOption === 'oldest') {
        setSortInfo('古い順');
      }
    };

    fetchData();
  }, [sortOption]);

  const handleSongClick = (youtubeLink) => {
    window.open(youtubeLink, '_blank');
  };

  return (
    <>
      <header>
        <h1>NCS(NoCopyrightSounds)</h1>
      </header>
      <div className="container">
        <aside>
          <div>
            <label htmlFor="sortOption">並び替え:</label>
            <button type="button" onClick={() => setSortOption('popular')}>人気順</button>
            <button type="button" onClick={() => setSortOption('newest')}>新しい順</button>
            <button type="button" onClick={() => setSortOption('oldest')}>古い順</button>
          </div>
        </aside>
        <main>
          <div>
            <strong>並び替え情報:</strong> {sortInfo}
          </div>
          {products.length ? (
            products.map((product) => (
              <section key={product.name} className={`song ${product.type}`}>
                <img src={`images/${product.image}`} alt={product.name} />
                <div className="info">
                  <div className="song-list">
                    <ul>
                      {product.songs.map((song, index) => (
                        <li key={index} onClick={() => handleSongClick(song.youtubeLink)}>
                          <div>
                            <div>{song.name}</div>
                            <div>再生数: {formatPopularity(song.popularity)}</div>
                            <div>日付: {song.data}</div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>
            ))
          ) : (
            <p></p>
          )}
        </main>
      </div>
    </>
  );
}
