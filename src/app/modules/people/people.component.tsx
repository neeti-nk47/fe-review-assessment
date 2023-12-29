import { Person } from "./model";
import { usePeopleQuery } from "./query";

import "./people.css";
import { useEffect, useState } from "react";

export function People() {
  const { data: people, loading, error } = usePeopleQuery();
  const [value, setValue] = useState<string>("");

  const [isAsc, setIsAsc] = useState<boolean>(true);
  const [currentPeople, setCurrentPeople] = useState<Person[]>([]);

  const [limit, setLimit] = useState<number>(10);
  const [startIndex, setStartIndex] = useState<number>(1);
  const [endIndex, setEndIndex] = useState<number>(10);

  useEffect(() => {
    if (people) {
      let newPeople = people.sort((a, b) => {
        if (a.name < b.name) {
          return -1;
        } else {
          return 1;
        }
      });
      setCurrentPeople(newPeople.slice(startIndex - 1, endIndex));
    }
  }, [people]);

  const Showing = `Showing ${startIndex}-${endIndex} of ${people?.length}`;

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

  const rows = currentPeople.map((people, index) => (
    <tr key={index}>{renderCells(people)}</tr>
  ));

  const defaultRows = people ? (
    people
      .slice(0, 10)
      .map((people, ind) => <tr key={ind}>{renderCells(people)}</tr>)
  ) : (
    <></>
  );

  if (loading) {
    return <p>Fetching People...</p>;
  }

  if (people === undefined || error) {
    return <h2>Oops! looks like something went wrong!</h2>;
  }
  console.log(people[0].name);

  const handleChange = (val: string) => {
    setValue(val);
    let newPeople = people.filter((person: Person) =>
      person.name.includes(val)
    );
    setCurrentPeople(newPeople.slice(0, 10));
  };

  const handleSort = () => {
    setIsAsc(!isAsc);
    let newPeople = people.sort((a, b) => {
      if (a.name < b.name) {
        return isAsc ? 1 : -1;
      } else {
        return isAsc ? -1 : 1;
      }
    });
    setCurrentPeople(newPeople.slice(startIndex - 1, endIndex));
  };

  const onLimitChange = (val: number) => {
    setLimit(val);
    setStartIndex(1);
    setEndIndex(val);
    setCurrentPeople(people?.slice(0, val));
  };

  const handleNext = () => {
    let firstVal = startIndex + limit - 1;
    let lastValue = endIndex + limit;
    setCurrentPeople(people.slice(firstVal, lastValue));
    setStartIndex(startIndex + limit);
    setEndIndex(endIndex + limit);
  };

  const handleLast = () => {
    let firstVal = people.length - limit;
    let lastValue = people.length;
    setCurrentPeople(people.slice(firstVal, lastValue));
    setStartIndex(people.length - limit + 1);
    setEndIndex(people.length);
  };

  const handlePrevious = () => {
    let firstVal = startIndex - limit - 1;
    let lastValue = endIndex - limit;
    setCurrentPeople(people.slice(firstVal, lastValue));

    setStartIndex(startIndex - limit);
    setEndIndex(endIndex - limit);
  };

  const handleFirst = () => {
    let firstVal = 0;
    let lastValue = limit;
    setCurrentPeople(people.slice(firstVal, lastValue));
    setStartIndex(1);
    setEndIndex(limit);
  };

  return (
    <>
      <div className="flex">
        <p style={people && { display: "none" }}>No People Available.</p>
        <input
          type="text"
          role="textbox"
          aria-label="Search"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
        />
        <select value={limit} onChange={(e) => onLimitChange(+e.target.value)}>
          <option value={10}>10</option>
          <option value={15}>15</option>
          <option value={20}>20</option>
          <option value={25}>25</option>
          <option value={30}>30</option>
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th
              aria-sort={isAsc ? "ascending" : "descending"}
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

        {/* <tbody>{currentPeople.length === 0 ? <>{defaultRows}</> : rows}</tbody> */}
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
        <span>{Showing}</span>
        <button
          onClick={handleNext}
          disabled={endIndex === people.length}
          className="buttons"
        >
          Next
        </button>
        <button
          onClick={handleLast}
          disabled={endIndex === people.length}
          className="buttons"
        >
          Last
        </button>
      </div>
    </>
  );
}
