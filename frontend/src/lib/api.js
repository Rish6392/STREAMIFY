import axiosInstance from "./axios"; // ✅ Correct way

export const signup = async (signupData) => {
  const response = await axiosInstance.post("/auth/signup", signupData);
  return response.data;
};

export const getAuthUser = async () => {
      const res = await axiosInstance.get("/auth/me");
      return res.data;
};

export const completeOnboarding = async (userData)=>{ // completeOnboarding: A function that sends the user's onboarding data to the backend to complete the onboarding process.
  // userData: An object containing the user's onboarding information.
   const response = await axiosInstance.post("/auth/onboarding", userData);
   return response.data;
}

export const login = async (loginData) => {
  const response = await axiosInstance.post("/auth/login", loginData);
  return response.data;
};