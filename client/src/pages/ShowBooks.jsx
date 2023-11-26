import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import BackButton from "../components/BackButton";
import Loader from "../components/Loader";
import Book from "../components/Book";


const ShowBook = () => {
  const [books, setBooks] = useState({});
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    axios
      .get(
        `https://5555-digimori-bookstore-6c00cvdc0rz.ws-eu106.gitpod.io/books/${id}`
      )
      .then((response) => {
        setBooks(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-4">
      <BackButton />
      <h1 className="text-3xl my-4">Show Book</h1>
      {loading ? (
        <Loader />
      ) : (
        <Book books={books} />
      )}
    </div>
  );
};

export default ShowBook;
