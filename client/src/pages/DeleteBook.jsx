import React, { useState } from "react";
import BackButton from "../components/BackButton";
import Loader from "../components/Loader";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const DeleteBook = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const handleDeleteBook = () => {
    setLoading(true);
    axios
      .delete(
        `https://5555-digimori-bookstore-6c00cvdc0rz.ws-eu106.gitpod.io/books/${id}`
      )
      .then(() => {
        setLoading(false);
        console.log(`Book Deleted Successfully.`);
        navigate("/");
      })
      .catch((error) => {
        setLoading(false);
        console.log(
          `Book could not be deleted: Error: ${error},  please refer to console for more information.`
        );
      });
  };

  return (
    <div className="p-4">
      <BackButton />
      <h1 className="text-3xl my-4">Delete Book Entry</h1>
      {loading ? <Loader /> : ""}
      <div className="flex flex-col items-center border-2 border-sky-400 rounded-xl w-[600px] p-8 mx-auto">
        <h3 className="text-2xl">
          Are your sure that you want to delete this book?
        </h3>

        <button
          className="p-4 bg-red-600 text-white m-8 w-full"
          onClick={handleDeleteBook}
        >
          Yes, Delete it
        </button>
      </div>
    </div>
  );
};

export default DeleteBook;
