import axios from "axios";
import React, { useEffect, useState } from "react";
import AudioTile from "../components/AudioTile";

const Discover = () => {
  const [submissions, setSubmissions] = useState([]);

  const fetchData = async () => {
    const res = await axios.get(
      `http://localhost:5000/api/submissions/discover`
    );
    console.log(res?.data);
    if (res) setSubmissions(res?.data);
  };
  useEffect(() => {
    // Fetch user submissions from the API
    // fetch(API_URL, {
    //   method: "GET",
    //   headers: {
    //     Authorization: `Bearer ${localStorage.getItem("token")}`, // Add your authentication token
    //   },
    // })
    //   .then((response) => response.json())
    //   .then((data) => setSubmissions(data))
    //   .catch((error) => console.error("Error fetching data:", error));
    fetchData();
  }, []);
  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-semibold mb-4 text-gray-200">Discover</h1>
      <div className="flex gap-4 flex-wrap">
        {submissions.map((submission) => (
          <AudioTile submission={submission} page="discover"/>
        ))}
      </div>
    </div>
  );
};

export default Discover;
