import { useState, useEffect } from 'react';

const useFetchRepos = (username, page) => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchRepos = async () => {
      if (!username) return;

      setLoading(true);
      try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?page=${page}`, {
          headers: {
            Authorization: 'f8397d9e6638026be1a490b95f419a5295bb73b4>',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();
        setRepos((prevRepos) => [...prevRepos, ...data]);
        setHasMore(data.length >= 30);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, [username, page]);

  return { repos, loading, hasMore };
};

export default useFetchRepos;
