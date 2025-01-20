import { redirect } from "next/navigation";
import connectMongo from "@/libs/mongoose";
import Board from "@/models/Board";

const getBoard = async (boardId) => {
  await connectMongo();

  const board = await Board.findById(boardId);

  if (!board) {
    redirect("/");
  }

  return board;
};

export default async function PublicFeedbackBoard({ params }) {
  const { boardId } = params; // Pravilno destrukturiranje

  const board = await getBoard(boardId);
  if (!boardId) {
    return <main>Board ID not provided</main>; // Provera da li je `boardId` definisan
  }

  // Možete ovde učitati podatke sa servera ili uraditi neku validaciju
  return <main>{board.name}(public)</main>;
}
