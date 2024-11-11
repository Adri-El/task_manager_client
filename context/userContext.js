
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useContext } from "react";
import toast from "react-hot-toast";
import apiCall from "@/app/apollo-client";
import variables from "@/app/variables";

const UserContext = React.createContext();

export const UserContextProvider = ({ children }) => {
  const serverUrl = "https://taskfyer.onrender.com";

  const router = useRouter();

  const [user, setUser] = useState({});
  const [allUsers, setAllUsers] = useState([]);
  const [userState, setUserState] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  // register user
  const registerUser = async (e) => {
    e.preventDefault();
    if (
      //!userState.email.includes("@") ||
      !userState.password ||
      userState.password.length < 6
    ) {
      toast.error("Please enter a valid email and password (min 6 characters)");
      return;
    }

    try {
      const schema = `
        mutation Signup($firstName: String!, $lastName: String!, $username: String!, $password: String!) {
          signup(firstName: $firstName, lastName: $lastName, username: $username, password: $password) {
          token
        }
      }`
      const token = await apiCall( variables.host, schema, userState, true);
      console.log(token)
      toast.success("User registered successfully");

      // clear the form
      setUserState({
        firstName: "",
        lastName: "",
        username: "",
        password: ""
      });

      // redirect to login page
      router.push("/login");
    } catch (error) {
      toast.error(error.message);
    }
  };

  // login the user
  const loginUser = async (e) => {
    e.preventDefault();
    try {
      
      const schema = `
        query Login($username: String!, $password: String!) {
          login(username: $username, password: $password) {
          token
        }
      }`
      
      const result = await apiCall(variables.host, schema, userState, false);
      toast.success("User logged in successfully");

      // clear the form
      setUserState({
        username: "",
        password: "",
      });

      // refresh the user details
      const user = await getUser(); // fetch before redirecting
  
      // push user to the dashboard page
      router.push("/");
    } catch (error) {
      console.log("Error logging in user", error);
      toast.error(error.message);
    }
  };

  // get user Looged in Status
  const userLoginStatus = async () => {
   //let loggedIn = false;
    try {
      const schema = `
      query{
        login_status{
          isLogedin
        }
      }
      `
      const res = await apiCall(`${variables.host}/auth`, schema, null, false)
      // coerce the string to boolean
      //loggedIn = !!res.data;
      
      setLoading(false);

      if (!res.data.login_status.isLogedin) {
        router.push("/login");
      }
      return res.data.login_status.isLogedin
    } catch (error) {
      console.log("Error getting user login status", error);
      return false
    }

    //return loggedIn;
  };

  // logout user
  const logoutUser = async () => {
    try {
      const schema = `
      mutation{
        logout{
          message
        }
      }
      `
      const res = apiCall(`${variables.host}/auth`, schema, null, true)

      toast.success("User logged out successfully");

      setUser({});

      // redirect to login page
      router.push("/login");
    } catch (error) {
      console.log("Error logging out user", error);
      toast.error(error.response.data.message);
    }
  };

  // get user details
  const getUser = async () => {
    setLoading(true);
    try {

      const schema = `
        query {
          get_user{
            id
            firstName
            lastName
            username
          }
        }`
      
      const user = await apiCall(`${variables.host}/auth`, schema, null, false);

      setUser((prevState) => {
        return {
          ...prevState,
          ...user.data.get_user,
        };
      });

      setLoading(false);
    } catch (error) {
      console.log("Error getting user details", error);
      setLoading(false);
      toast.error(error.message);
      return error.message
    }
  };

  // update user details
  // const updateUser = async (e, data) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   try {

  //     //update the user state
  //     setUser((prevState) => {
  //       return {
  //         ...prevState,
  //         ...res.data,
  //       };
  //     });

  //     toast.success("User updated successfully");

  //     setLoading(false);
  //   } catch (error) {
  //     console.log("Error updating user details", error);
  //     setLoading(false);
  //     toast.error(error.response.data.message);
  //   }
  // };

  // email verification
  // const emailVerification = async () => {
  //   setLoading(true);
  //   try {

  //     toast.success("Email verification sent successfully");
  //     setLoading(false);
  //   } catch (error) {
  //     console.log("Error sending email verification", error);
  //     setLoading(false);
  //     toast.error(error.response.data.message);
  //   }
  // };

  // verify user/email
  // const verifyUser = async (token) => {
  //   setLoading(true);
  //   try {
  //     

  //     toast.success("User verified successfully");

  //     // refresh the user details
  //     getUser();

  //     setLoading(false);
  //     // redirect to home page
  //     router.push("/");
  //   } catch (error) {
  //     console.log("Error verifying user", error);
  //     toast.error(error.response.data.message);
  //     setLoading(false);
  //   }
  // };

  // forgot password email
  // const forgotPasswordEmail = async (email) => {
  //   setLoading(true);

  //   try {
  //     

  //     toast.success("Forgot password email sent successfully");
  //     setLoading(false);
  //   } catch (error) {
  //     console.log("Error sending forgot password email", error);
  //     toast.error(error.response.data.message);
  //     setLoading(false);
  //   }
  // };

  // reset password
  // const resetPassword = async (token, password) => {
  //   setLoading(true);

  //   try {
  //     

  //     toast.success("Password reset successfully");
  //     setLoading(false);
  //     // redirect to login page
  //     router.push("/login");
  //   } catch (error) {
  //     console.log("Error resetting password", error);
  //     toast.error(error.response.data.message);
  //     setLoading(false);
  //   }
  // };

  // change password
  // const changePassword = async (currentPassword, newPassword) => {
  //   setLoading(true);

  //   try {
  //    

  //     toast.success("Password changed successfully");
  //     setLoading(false);
  //   } catch (error) {
  //     console.log("Error changing password", error);
  //     toast.error(error.response.data.message);
  //     setLoading(false);
  //   }
  // };

  // admin routes
  // const getAllUsers = async () => {
  //   setLoading(true);
  //   try {
  //     

  //     setAllUsers(res.data);
  //     setLoading(false);
  //   } catch (error) {
  //     console.log("Error getting all users", error);
  //     toast.error(error.response.data.message);
  //     setLoading(false);
  //   }
  // };

  // dynamic form handler
  const handlerUserInput = (name) => (e) => {
    const value = e.target.value;

    setUserState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // delete user
  // const deleteUser = async (id) => {
  //   setLoading(true);
  //   try {
  //     
  //     toast.success("User deleted successfully");
  //     setLoading(false);
  //     // refresh the users list
  //     getAllUsers();
  //   } catch (error) {
  //     console.log("Error deleting user", error);
  //     toast.error(error.response.data.message);
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    const loginStatusGetUser = async () => {
      const isLoggedIn = await userLoginStatus();

      if (isLoggedIn) {
        await getUser();
      }
    };

    loginStatusGetUser();
  }, []);

  useEffect(() => {
    if (user.role === "admin") {
      getAllUsers();
    }
  }, [user.role]);

  return (
    <UserContext.Provider
      value={{
        registerUser,
        userState,
        handlerUserInput,
        loginUser,
        logoutUser,
        userLoginStatus,
        user,
        //updateUser,
        //emailVerification,
        //verifyUser,
        //forgotPasswordEmail,
        //resetPassword,
        //changePassword,
        //allUsers,
        //deleteUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(UserContext);
};
