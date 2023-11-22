import { useState, useEffect } from "react";
import axios from "axios";
import BackButton from "../components/BackButton";
import Loader from "../components/Loader";
import { useNavigate, useParams } from "react-router-dom";

const EditBook = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [publicationDate, setPublicationDate] = useState(""); // This we could probably consider turning into a date picker later.
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Re-Routes after creating a book
  const { id } = useParams(); // Destructure the ID to allow us to GET and POST the request.

  useEffect(() => {
    setLoading(true);
    axios
      .get(
        `https://5555-digimori-bookstore-6c00cvdc0rz.ws-eu106.gitpod.io/books/${id}`
      )
      .then((response) => {
        setAuthor(response.data.author);
        setTitle(response.data.title);
        setPublicationDate(response.data.publicationDate);
        setDescription(response.data.description);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        alert(
          `An error has Occured: ${error}, please check the console for more information.`
        );
        console.log(`Error: ${error}`);
      });
  }, []);

  const handleEditBook = () => {
    const data = {
      title,
      author,
      publicationDate,
      description,
    };
    setLoading(true);
    axios
      .put(
        `https://5555-digimori-bookstore-6c00cvdc0rz.ws-eu106.gitpod.io/books/${id}`,
        data
      )
      .then(() => {
        setLoading(false);
        navigate("/");
      })
      .catch((error) => {
        setLoading(false);
        alert(
          `An Error has occured: ${error}. Please Check console for further information.`
        );
        console.log(error);
      });
  };

  return (
    <div className="p-4">
      <BackButton />
      <h1 className="text-3cl my-4">Edit Book Entry:</h1>
      {loading ? <Loader /> : ""}
      <div className="flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto">
        <div className="my-4">
          <label className="text-cl mr-4 text-gray-500">Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full"
          />
        </div>

        <div className="my-4">
          <label className="text-cl mr-4 text-gray-500">Author:</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full"
          />
        </div>

        <div className="my-4">
          <label className="text-cl mr-4 text-gray-500">
            Publication Date:
          </label>
          <input
            type="text"
            value={publicationDate}
            onChange={(e) => setPublicationDate(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full"
          />
        </div>
        <div className="my-4">
          <label className="text-cl mr-4 text-gray-500">Description:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full"
          />
        </div>
        <button className="p-2 bk-sky-300 m-8" onClick={handleEditBook}>
          Save Entry
        </button>
      </div>
    </div>
  );
};

export default EditBook;
