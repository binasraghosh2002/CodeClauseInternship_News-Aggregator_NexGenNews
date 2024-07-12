// eslint-disable-next-line no-unused-vars
import { React, useState, useEffect } from 'react';
import EverythingCard from './EverythingCard';
import Loader from './Loader.jsx';

function AllNews() {

  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  function handlePrev() {
    setPage(page - 1);
  }
  
  function handleNext() {
    setPage(page + 1);
  }
  
  let pageSize = 12;

  useEffect(() => {
    setIsLoading(true);
    fetch(`http://localhost:3000/all-news?page=${page}&pageSize=${pageSize}`)
      .then(response => {
        if (response.ok) {
          return response.clone().json();
        } else {
          throw new Error('Network response was not ok.');
        }
      })
      .then(myJson => {
        setTotalResults(myJson.data.totalResults);
        setData(myJson.data.articles);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        setIsLoading(false);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <>
      <div className='my-10 cards grid lg:place-content-center md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 xs:grid-cols-1 xs:gap-4 md:gap-10 lg:gap-14 md:px-16 xs:p-3 '>
        {isLoading ? <Loader /> : data.map((element, index) => {
          return (
            <EverythingCard
              title={element.title}
              description={element.description}
              imgUrl={element.urlToImage}
              publishedAt={element.publishedAt}
              url={element.url}
              author={element.author}
              source={element.source.name}
              key={index}
            />
          );
        })}
      </div>
      {!isLoading && (
        <div className="pagination flex justify-center gap-14 my-10 items-center">
          <button disabled={page <= 1} className='pagination-btn text-center' onClick={() => handlePrev()}>&larr; Prev</button>
          <p className='font-semibold opacity-80'>{page} of {Math.ceil(totalResults / pageSize)}</p>
          <button className='pagination-btn text-center' disabled={page >= Math.ceil(totalResults / pageSize)} onClick={() => handleNext()}>Next &rarr;</button>
        </div>
      )}
    </>
  );
}

export default AllNews;
