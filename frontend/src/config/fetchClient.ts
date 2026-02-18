interface FetchOptions extends RequestInit {
  credentials?: "include" | "omit" | "same-origin";
}

export const fetchWithCreds = (
  input: RequestInfo | URL,
  init?: FetchOptions,
) => {
  const token = localStorage.getItem("authToken");
  
  const options: FetchOptions = {
    ...init,
    headers: {
      ...init?.headers,
    },
  };

  // Add Authorization header ONLY if token exists
  if (token && token !== "null") {
    (options.headers as any)["Authorization"] = `Bearer ${token}`;
  }

  return fetch(input, options);
};
