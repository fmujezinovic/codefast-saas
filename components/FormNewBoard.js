"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

const FormNewBoard = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isLoading) return;

    setIsLoading(true);

    try {
      const data = await axios.post("/api/board", { name });

      // Resetuj polje za unos nakon uspešnog kreiranja boarda
      setName("");
      toast.success("Board created!");
      router.refresh();
    } catch (error) {
      const errorMessage =
        error.response.data.error || error.message || "Something went wrong";
      toast.error(errorMessage);
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className="bg-base-100 p-8 rounded-3xl space-y-8"
      onSubmit={handleSubmit}
    >
      <p className="font-bold text-lg">Create a new feedback board</p>
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">Board name</span>
        </div>
        <input
          type="text"
          placeholder="Future Unicorn Inc. 🦄"
          className="input input-bordered w-full"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </label>
      <button className="btn btn-primary btn-block" type="submit">
        {isLoading ? (
          <span className="loading loading-spinner loading-xs"></span>
        ) : (
          "Create board"
        )}
      </button>
    </form>
  );
};

export default FormNewBoard;
