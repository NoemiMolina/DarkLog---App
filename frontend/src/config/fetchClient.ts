interface FetchOptions extends RequestInit {
  credentials?: "include" | "omit" | "same-origin";
}

export const fetchWithCreds = (
  input: RequestInfo | URL,
  init?: FetchOptions,
) => {
  const options: FetchOptions = {
    ...init,
    credentials: "include",
  };

  return fetch(input, options);
};
