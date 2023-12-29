import { useEffect, useMemo, useState } from "react";
import { AxiosError } from "axios";

import { API_RESOURCE } from "../../../shared/constant";
import { useAxios } from "../../../shared/context";
import { Person } from "../model";

export enum Order {
  Asc = "asc",
  Desc = "desc",
}

interface argument {
  limit: number;
  order: Order;
  search: string;
  startIndex: number;
  endIndex: number;
}
interface PeopleQueryState {
  loading: boolean;
  data?: Person[];
  error?: AxiosError;
}

export const usePeopleQuery = ({
  limit,
  order,
  search,
  startIndex,
  endIndex,
}: argument): PeopleQueryState => {
  const axios = useAxios();
  const [state, setState] = useState<PeopleQueryState>({ loading: false });

  const fetchPeoples = async () => {
    try {
      let { data } = await axios.get<Person[]>(`/${API_RESOURCE.PEOPLE}`, {
        params: {
          limit,
          order,
          search,
          startIndex,
          endIndex,
        },
      });

      setState({ data, loading: false, error: undefined });
    } catch (error) {
      setState({ data: undefined, error: error as AxiosError, loading: false });
    }
  };

  useEffect(() => {
    setState({ loading: true });

    fetchPeoples();
  }, [limit, order, search]);

  const value = useMemo(() => state, [state]);

  return value;
};
