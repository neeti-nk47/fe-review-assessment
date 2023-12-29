import { Person } from "./model";
import { Order, usePeopleQuery } from "./query";

import "./people.css";
import { useEffect, useMemo, useState } from "react";

export function People() {
  const [search, setSearch] = useState<string>("");
  const [input, setInput] = useState<string>("");

  const [order, setOrder] = useState<Order>(Order.Asc);
  const [currentPeople, setCurrentPeople] = useState<Person[]>([]);

  const [limit, setLimit] = useState<number>(10);
  const [startIndex, setStartIndex] = useState<number>(1);
  const [endIndex, setEndIndex] = useState<number>(10);

  const {
    data: people,
    loading,
    error,
  } = usePeopleQuery({ limit, order, search, startIndex, endIndex });

  const Showing = `Showing ${startIndex}-${endIndex} of 100`;

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

  const rows = useMemo(() => {
    return people ? (
      people.map((person: Person) => (
        <tr key={person.id}>{renderCells(person)}</tr>
      ))
    ) : (
      <></>
    );
  }, [people]);

  useEffect(() => {
    let timeout = setTimeout(() => {
      setSearch(input);
    }, 0);
    return () => clearTimeout(timeout);
  }, [input]);

  if (loading) {
    return <p>Fetching People...</p>;
  }

  if (people === undefined || error) {
    return <h2>Oops! looks like something went wrong!</h2>;
  }

  const handleChange = (val: string) => {
    setInput(val);
  };

  const handleSort = () => {
    let newOrder = order === Order.Asc ? Order.Desc : Order.Asc;
    setOrder(newOrder);
  };

  const onLimitChange = (val: number) => {
    setLimit(val);
    setStartIndex(1);
    setEndIndex(val);
    setCurrentPeople(people?.slice(0, val));
  };

  const handleNext = () => {
    setStartIndex(startIndex + limit);
    setEndIndex(Math.min(endIndex + limit, 100));
  };

  const handleLast = () => {
    setStartIndex(100 - limit + 1);
    setEndIndex(100);
  };

  const handlePrevious = () => {
    setStartIndex(Math.max(1, startIndex - limit));
    setEndIndex(endIndex - limit);
  };

  const handleFirst = () => {
    setStartIndex(1);
    setEndIndex(limit);
  };

  return (
    <>
      <div className="filters">
        <p style={people && { display: "none" }}>No People Available.</p>
        <div className="flex">
          <label className="span">Search by name:</label>
          <input
            className="inputs"
            type="text"
            role="textbox"
            aria-label="Search"
            value={input}
            onChange={(e) => handleChange(e.target.value)}
          />
        </div>
        <div className="flex">
          <label className="span">Items per page:</label>
          <select
            className="inputs"
            value={limit}
            onChange={(e) => onLimitChange(+e.target.value)}
          >
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
            <option value={25}>25</option>
            <option value={30}>30</option>
          </select>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th
              aria-sort={order === Order.Asc ? "ascending" : "descending"}
              onClick={handleSort}
            >
              Name
            </th>
            <th>Show</th>
            <th>Actor/Actress</th>
            <th>Date of birth</th>
            <th>Movies</th>
          </tr>
        </thead>

        <tbody>{rows}</tbody>
      </table>

      <div className="flex">
        <button
          onClick={handleFirst}
          disabled={startIndex === 1}
          className="buttons"
        >
          First
        </button>
        <button
          onClick={handlePrevious}
          disabled={startIndex === 1}
          className="buttons"
        >
          Previous
        </button>
        <span className="span">{Showing}</span>
        <button
          onClick={handleNext}
          disabled={endIndex === 100}
          className="buttons"
        >
          Next
        </button>
        <button
          onClick={handleLast}
          disabled={endIndex === 100}
          className="buttons"
        >
          Last
        </button>
      </div>
    </>
  );
}
