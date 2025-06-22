import ky from "ky";

const apiClient = ky.create({
  prefixUrl: import.meta.env.VITE_API_BASE_URL,
  hooks: {
    beforeRequest: [
      (request) => {
        const accessToken = localStorage.getItem("access-token");
        if (accessToken) {
          request.headers.set("Authorization", `Bearer ${accessToken}`);
        }
      },
    ],
    afterResponse: [
      (_request, _options, response) => {
        if (response.status === 401) {
          window.location.replace("/login");
        }
        return response;
      },
    ],
  },
});

export default apiClient;
