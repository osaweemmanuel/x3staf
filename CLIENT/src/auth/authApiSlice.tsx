import { apiSlice } from "../api/apiSlice";
import { logOut, setCredentials } from "./authSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: { ...credentials },
      }),
    }),
    adminLogin: builder.mutation({
      query: (credentials) => ({
        url: "/auth/admin/login",
        method: "POST",
        body: { ...credentials },
      }),
    }),
    customerLogin: builder.mutation({
      query: (credentials) => ({
        url: "/auth/customer/login",
        method: "POST",
        body: { ...credentials },
      }),
    }),
    update: builder.mutation({
      query: (credentials) => ({
        url: "/auth/update",
        method: "PATCH",
        body: { ...credentials },
      }),
    }),
    delete: builder.mutation({
      query: (credentials) => ({
        url: "/auth/delete",
        method: "DELETE",
        body: { ...credentials },
      }),
    }),
    googleHandler: builder.mutation({
      query: (credentials) => ({
        url: "/auth/google",
        method: "POST",
        body: { ...credentials },
      }),
    }),
    register: builder.mutation({
      query: (credentials) => ({
        url: "/auth/register",
        method: "POST",
        body: { ...credentials },
      }),
    }),
    // To send the OTP for the user's email
    createOTP: builder.mutation({
      query: (credentials) => ({
        url: "/auth/createnewotp",
        method: "POST",
        body: { ...credentials },
      }),
    }),
     // To send the OTP for the user's email
     createNewLink: builder.mutation({
      query: (credentials) => ({
        url: "/auth/createnewlink",
        method: "POST",
        body: { ...credentials },
      }),
    }),
    // To verify the OTP for the user's email
    verifyOTP: builder.mutation({
      query: (credentials) => ({
        url: "/auth/verifyotp",
        method: "POST",
        body: { ...credentials },
      }),
    }),
    // send OTP for user's password recreation
    sendForgotPasswordOTP: builder.mutation({
      query: (credentials) => ({
        url: "/auth/forgotpassword/sendotp",
        method: "POST",
        body: { ...credentials },
      }),
    }),
    // verify the email otp when the user sends the otp
    verifyForgotPasswordOTP: builder.mutation({
      query: (credentials) => ({
        url: "/auth/forgotpassword/verifyotp",
        method: "POST",
        body: { ...credentials },
      }),
    }),
    //use the otp, email and password to reset the password
    ResetPassword: builder.mutation({
      query: (credentials) => ({
        url: "/auth/forgotpassword/reset",
        method: "POST",
        body: { ...credentials },
      }),
    }),
    sendLogout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          console.log("Logout successful server-side");

        } catch (err) {
          console.error("Logout failed server-side or network error:", err);
        } finally {
          // Always clear the token locally and reset API state
          dispatch(logOut());
          setTimeout(() => {
            dispatch(apiSlice.util.resetApiState());
          }, 1000);
        }
      },
    }),
    refresh: builder.mutation({
      query: () => ({
        url: "/auth/refresh",
        method: "GET",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data && data.accessToken) {
             console.log("Refresh successful, updating credentials");
             dispatch(setCredentials({ accessToken: data.accessToken }));
          }
        } catch (err) {
          console.error("Refresh token verification failed:", err);
          dispatch(logOut());
        }
      },
    }),
  }),
});

export const {
  useAdminLoginMutation,
  useCustomerLoginMutation,
  useGoogleHandlerMutation,
  useResetPasswordMutation,
  useVerifyForgotPasswordOTPMutation,
  useSendForgotPasswordOTPMutation,
  useVerifyOTPMutation,
  useCreateOTPMutation,
  useLoginMutation,
  useCreateNewLinkMutation,
  useRegisterMutation,
  useSendLogoutMutation,
  useRefreshMutation,
  useUpdateMutation,
  useDeleteMutation,
} = authApiSlice;
