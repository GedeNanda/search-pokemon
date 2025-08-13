import { useEffect, useState } from "react";
import "./Pokemon.css";



function Pokemon() {
  const [showMenu, setShowMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(false); 


  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  useEffect(() => {
    document.body.classList.remove("dark-mode");
  }, []);
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState(false);
  const [dataDetail, setDataDetail] = useState(null);
  const [prevUrl, setPrevUrl] = useState("");
  const [nextUrl, setNextUrl] = useState("");
  const [apiUrl, setApiUrl] = useState("https://pokeapi.co/api/v2/pokemon");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [sort, setSort] = useState("id-asc");

  async function getAllPokemon() {
    try {
      setLoading(true);
      const resData = await fetch(apiUrl);
      const jsonData = await resData.json();
      setPrevUrl(jsonData.previous || "");
      setNextUrl(jsonData.next || "");
      const detailPromises = jsonData.results.map(async (item) => {
        const resDataDetail = await fetch(item.url);
        return resDataDetail.json();
      });
      const allPokemonDetails = await Promise.all(detailPromises);
      setPokemonList(allPokemonDetails);
      setLoading(false);
    } catch (error) {
      console.error("Gagal mengambil data Pokemon:", error);
      setLoading(false);
    }
  }

  async function handleSearch(e) {
    e.preventDefault();
    if (!search) return;
    setLoading(true);
    setSearchResult(null);
    try {
      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${search.toLowerCase()}`
      );
      if (!res.ok) throw new Error("Not found");
      const data = await res.json();
      setSearchResult(data);
    } catch {
      setSearchResult("notfound");
    }
    setLoading(false);
  }

  useEffect(() => {
    getAllPokemon();

  }, [apiUrl]);

  const PokemonDetail = () => {

    if (!dataDetail || !dataDetail.sprites) {
      return null;
    }

    return (
      <div className="detail" onClick={() => setDetail(false)}>
        <div className="item" onClick={(e) => e.stopPropagation()}>
          <button
            className="close-detail-btn"
            onClick={() => setDetail(false)}
            aria-label="Tutup"
          >
            &times;
          </button>
          <div className="image">
            <img
              src={dataDetail.sprites.other.dream_world.front_default}
              alt={dataDetail.name}
            />
          </div>
          <div className="title">{dataDetail.name}</div>
          <div className="abilities">
            {dataDetail.abilities.map((item, index) => {
              return <span key={index}>{item.ability.name}</span>;
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="wrapper">
      {}
      <button
        className="fab-menu-btn"
        onClick={() => setShowMenu((v) => !v)}
        aria-label="Menu"
      >
        {}
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="16" cy="16" r="14" stroke="#222" strokeWidth="2.5" />
          <path d="M2 16h28" stroke="#222" strokeWidth="2.5" />
          <path
            d="M16 10a6 6 0 1 1 0 12a6 6 0 0 1 0-12z"
            fill="#fff"
            stroke="#222"
            strokeWidth="2.5"
          />
          <circle
            cx="16"
            cy="16"
            r="3.5"
            fill="#ef5350"
            stroke="#222"
            strokeWidth="2"
          />
        </svg>
      </button>
      {showMenu && (
        <div className="fab-menu-popup">
          <button
            className="fab-menu-item"
            onClick={() => setDarkMode((v) => !v)}
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
          <button
            className="fab-menu-item"
            onClick={() => {
              setApiUrl("https://pokeapi.co/api/v2/pokemon");
              setSearch("");
              setSearchResult(null);
              setShowMenu(false);
            }}
          >
            Beranda
          </button>
          <button className="fab-menu-item" disabled>
            Fitur Lain (Coming Soon)
          </button>
        </div>
      )}
      <div className="content">
        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Cari nama atau ID Pokémon..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit">Cari</button>
        </form>

        {}
        {!searchResult && (
          <div className="sort-menu">
            <label htmlFor="sort-select">Sortir: </label>
            <select
              id="sort-select"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="name-asc">Nama A-Z</option>
              <option value="name-desc">Nama Z-A</option>
            </select>
          </div>
        )}

        {loading && (
          <div className="loading">
            <div className="pokeball-loader"></div>
            <div className="loading-text">Loading Pokémon...</div>
          </div>
        )}

        {detail && <PokemonDetail />}

        {}
        {searchResult && (
          <div className="grid" style={{ marginTop: 32 }}>
            {searchResult === "notfound" ? (
              <div
                style={{
                  gridColumn: "1/-1",
                  textAlign: "center",
                  color: "#b91c1c",
                  fontWeight: 500,
                  fontSize: "1.1rem",
                }}
              >
                Pokémon tidak ditemukan.
              </div>
            ) : (
              <div
                className="item"
                onClick={() => {
                  setDetail(true);
                  setDataDetail(searchResult);
                }}
              >
                <div className="image">
                  <img
                    src={searchResult.sprites.front_default}
                    alt={searchResult.name}
                  />
                </div>
                <div className="title">{searchResult.name}</div>
                <div className="abilities">
                  {searchResult.abilities.map((item, idx) => (
                    <span key={idx}>{item.ability.name}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {}
        {!searchResult && (
          <div className="grid">
            {pokemonList
              .slice()
              .sort((a, b) => {
                if (sort === "id-asc") return a.id - b.id;
                if (sort === "id-desc") return b.id - a.id;
                if (sort === "name-asc") return a.name.localeCompare(b.name);
                if (sort === "name-desc") return b.name.localeCompare(a.name);
                return 0;
              })
              .map((item, index) => {
                return (
                  <div
                    className="item"
                    key={index}
                    onClick={() => {
                      setDetail(true);
                      setDataDetail(item);
                    }}
                  >
                    <div className="image">
                      <img src={item.sprites.front_default} alt={item.name} />
                    </div>
                    <div className="title">{item.name}</div>
                    {}
                  </div>
                );
              })}
          </div>
        )}

        {}
        {!searchResult && (prevUrl || nextUrl) && (
          <div className="pagination-nav-top">
            {prevUrl && (
              <button
                className="pagination-btn"
                onClick={() => setApiUrl(prevUrl)}
                type="button"
                aria-label="Sebelumnya"
              >
                &laquo;
              </button>
            )}
            {nextUrl && (
              <button
                className="pagination-btn"
                onClick={() => setApiUrl(nextUrl)}
                type="button"
                aria-label="Berikutnya"
              >
                &raquo;
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Pokemon;
