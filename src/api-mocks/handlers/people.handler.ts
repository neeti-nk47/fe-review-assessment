import { rest } from "msw";

import { API_RESOURCE } from "../../app/shared/constant";
import { PEOPLE } from "../fixtures";
import { delayedResponse } from "../utils";
import { Person } from "../../app/modules/people";

const BASE_URL = `/mock-api/${API_RESOURCE.PEOPLE}*`;

export const getPeople = rest.get(BASE_URL, (_req, _res, ctx) => {
  const queryParams = new URL(_req.url.toString()).searchParams;

  // Access specific query parameters
  const limit = queryParams.get("limit");
  const order = queryParams.get("order");
  const search = queryParams.get("search");
  const startIndex = queryParams.get("startIndex");
  const endIndex = queryParams.get("endIndex");

  let people: Person[] = [...PEOPLE];

  if (order === "asc") {
    people.sort((a, b) => {
      return a.name < b.name ? -1 : 1;
    });
  } else if (order === "desc") {
    people.sort((a, b) => {
      return a.name < b.name ? 1 : -1;
    });
  }

  if (search) {
    people = people.filter((person: Person) => person.name.includes(search));
    console.log({ search });
  }

  if (limit && startIndex && endIndex) {
    people = people.slice(+startIndex - 1, +endIndex);
  }

  return delayedResponse(ctx.status(200), ctx.json(people));
});

export const handlers = [getPeople];
