import { createContext, useContext, useEffect, useState } from "react";
import api from "../lib/api";

const ContentContext = createContext(null);

export function ContentProvider({ children }) {
  const [data, setData] = useState({
    homepage: null,
    settings: null,
    services: [],
    portfolio: [],
    faqs: [],
    categories: [],
    loading: true,
  });

  useEffect(() => {
    Promise.all([
      api.get("/homepage"),
      api.get("/settings"),
      api.get("/services"),
      api.get("/portfolio"),
      api.get("/faqs"),
      api.get("/categories"),
    ])
      .then(([hp, st, sv, pf, fq, cat]) => {
        setData({
          homepage: hp.data,
          settings: st.data,
          services: sv.data,
          portfolio: pf.data,
          faqs: fq.data,
          categories: cat.data,
          loading: false,
        });
      })
      .catch(() => setData((d) => ({ ...d, loading: false })));
  }, []);

  return <ContentContext.Provider value={data}>{children}</ContentContext.Provider>;
}

export const useContent = () => useContext(ContentContext);
