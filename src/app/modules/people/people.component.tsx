import { Person } from "./model";
import { usePeopleQuery } from "./query";

import "./people.css";
import { useState } from "react";

export function People() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const { data: people, loading, error } = usePeopleQuery();
  const indexLastPerson = currentPage * perPage;
  const indexFirstPerson = indexLastPerson - perPage;

  const currentPeople = people?.slice(indexFirstPerson, indexLastPerson) ?? [];
  const totalPages = people?.length ? Math.ceil(people.length / perPage) : 1;
  const startRange = indexFirstPerson + 1;
  const endRange = Math.min(indexLastPerson);

  const gotoPage = (page: number) => {
    setCurrentPage(page);
  };
  const renderCells = ({ name, show, actor, movies, dob }: Person) => (
    <>
      <td>{name}</td>
      <td>{show}</td>
      <td>{actor}</td>
      <td>{dob}</td>
      <td
        dangerouslySetInnerHTML={{
          __html: movies.map(({ title }) => title).join(", "),
        }}
      ></td>
    </>
  );

  if (loading) {
    return <p>Fetching People...</p>;
  }

  if (people === undefined || error) {
    return <h2>Oops! looks like something went wrong!</h2>;
  }
  // if (people.length === 0) {
  //   return <h2>No People Available.</h2>;
  // }

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Show</th>
            <th>Actor/Actress</th>
            <th>Date of birth</th>
            <th>Movies</th>
          </tr>
        </thead>

        <tbody>
          {currentPeople?.map((people, index) => (
            <tr key={index}>{renderCells(people)}</tr>
          ))}
        </tbody>
      </table>

      <div>
        <select onChange={(e) => setPerPage(+e.target.value)}>
          <option value={10}>10</option>
          <option value={15}>15</option>
          <option value={20}>20</option>
        </select>
        <button onClick={() => gotoPage(1)} disabled={currentPage === 1}>
          First
        </button>
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Showing {startRange}-{endRange} of {people?.length}
        </span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
        <button
          onClick={() => gotoPage(totalPages)}
          disabled={currentPage === totalPages}
        >
          Last
        </button>
      </div>
    </>
  );
}
