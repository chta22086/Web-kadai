import { useEffect, useState } from "react";

async function fetchProducts(category, keyword) {
  const response = await fetch('products.json');
  const data = await response.json();
  return data.filter((item) => {
    return (
      (category === 'all' || category === item.type) &&
      (!keyword || item.name.includes(keyword))
    );
  });
}

export default function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    (async () => {
      const data = await fetchProducts("all");
      setProducts(data);
    })();
  }, []);

  const handleSongClick = (youtubeLink) => {
    window.open(youtubeLink,'_blank');
  };

  return (
    <>
      <header>
        <h1>ONE OK ROCK</h1>
      </header>
      <div className="container">
        <aside>
          <form
            onSubmit={async (event) => {
              event.preventDefault();
              const category = event.target.elements.category.value;
              const keyword = event.target.elements.keyword.value;
              const data = await fetchProducts(category, keyword);
              setProducts(data);
            }}
          >
            <div>
              <label htmlFor="category">カテゴリーを選ぶ:</label>
              <select id="category" name='category'>
                <option value="all">全て</option>
                <option value="アルバム">アルバム</option>
                <option value="その他">シングル</option>
              </select>
            </div>
            <div>
              <label htmlFor="searchTerm">検索:</label>
              <input
                type="text"
                id="searchTerm"
                name="keyword"
              />
            </div>
            <div>
              <button>実行</button>
            </div>
          </form>
        </aside>
        <main>
        {products.length ? (
            products.map((product) => (
              <section key={product.name} className={`album ${product.type}`}>
                <img src={`images/${product.image}`} alt={product.name} />
                <div className="info">
                  <h2>{product.name[0].toUpperCase()}{product.name.slice(1)}</h2>
                  <div className="song-list">
                    <ul>
                      {product.songs.map((song, index) => (
                        <li key={index} onClick={() => handleSongClick(song.youtubeLink)}>
                            {song.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>
            ))
          ) : (
            <p>検索結果なし</p>
          )}
        </main>
      </div>
    </>
  );
}