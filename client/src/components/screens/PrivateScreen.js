import { useState, useEffect } from "react";
import axios from "axios";
import "./PrivateScreen.css";

const PrivateScreen = ({ history }) => {
  const [error, setError] = useState("");
  const [privateData, setPrivateData] = useState("");

  // useEffect 类似生命周期函数 think of useEffect Hook as componentDidMount, componentDidUpdate, and componentWillUnmount combined
  useEffect(() => {
    // 
    const fetchPrivateDate = async () => {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      };

      try {
        const { data } = await axios.get("/api/private", config);
        setPrivateData(data.data);
      } catch (error) {
        localStorage.removeItem("authToken");
        setError("You are not authorized please login");
      }
    };

    fetchPrivateDate();
  }, []);

  const logoutHandler = () => {
    localStorage.removeItem("authToken");
    history.push("/");
  }

  return error ? (
    <span className="error-message">{error}</span>
  ) : (
    <>
    <div>{privateData}</div>
    <button onClick={logoutHandler}>Logout</button>
    </>
  );
};

export default PrivateScreen;
