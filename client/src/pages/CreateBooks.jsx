import React, { useState, useEffect } from "react";
import BackButton from "../components/BackButton";
import Loader from "../components/Loader";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateBooks = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [publicationDate, setPublicationDate] = useState(""); // This we could probably consider turning into a date picker later.
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Re-Routes after creating a book

  const handleSaveBook = () => {
    const data = {
      title,
      author,
      publicationDate,
    };
    setLoading(true);
    axios
      .post(
        `https://5555-digimori-bookstore-6c00cvdc0rz.ws-eu106.gitpod.io/books/${id}`,
        data
      ) // Second parameter is the data posted
      .then(() => {
        setLoading(false); // Stops data moving once sent
        navigate("/"); // Returns to home page after posting
      })
      .catch((error) => {
        setLoading(false);
        alert(
          `An Error has occured: ${error}. Please Check console for further information.`
        );
        console.log(error);
      });
  };

  return <div>CreateBooks</div>;
};

export default CreateBooks;
