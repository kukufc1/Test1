import React, { useState, useRef, useCallback } from 'react';
import debounce from 'lodash.debounce';

import useFetchRepos from '../useHooks/useFetchRepos'; // Измените путь импорта, если необходимо
import '../Search/Search.css';

const GitHubRepoSearch = () => {
  const [username, setUsername] = useState('');
  const [page, setPage] = useState(1);
  const observer = useRef();

  // Используем кастомный хук
  const { repos, loading, hasMore } = useFetchRepos(username, page);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setUsername(value);

    if (!value) {
      setPage(1); // Сброс страницы при очистке поля ввода
    }
    debouncedFetchRepos(value);
  };

  const debouncedFetchRepos = useCallback(
    debounce((user) => {
      if (user) {
        setPage(1);
      }
    }, 1000),
    []
  );

  const loadMoreRepos = () => {
    if (hasMore && !loading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const lastRepoElementRef = (node) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        loadMoreRepos();
      }
    });
    if (node) observer.current.observe(node);
  };

  return (
    <div id="flex__box">
      <div className="box__input">
        <input
          type="text"
          placeholder="Введите имя пользователя GitHub"
          value={username}
          onChange={handleInputChange}
        />
      </div>
      {loading && <p>Загрузка...</p>}
      <div className="box__card">
        {repos.map((repo, index) => {
          const key = `${repo.id}-${username}-${index}`;
          const isLastRepo = repos.length === index + 1;

          return (
            <div key={key} className="repo-card" ref={isLastRepo ? lastRepoElementRef : null}>
              <div id="repo_card__header">
                <h3>{repo.name}</h3>
                <p>Последнее обновление: {new Date(repo.updated_at).toLocaleDateString()}</p>
                <p>Звёзды: {repo.stargazers_count}</p>
              </div>
              <div id="repo_card__discrip">
                <p>{repo.description || 'Описание недоступно'}</p>
                <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                  Ссылка на репозиторий
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GitHubRepoSearch;
