import { NextResponse } from "next/server";
import { auth } from "@/auth"; // Preverite, če je auth ustrezno implementiran
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import Board from "@/models/Board";

export async function POST(req) {
  try {
    const body = await req.json();

    if (!body.name) {
      return NextResponse.json(
        { error: "Board name is required" },
        { status: 400 }
      );
    }

    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    await connectMongo();

    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const board = await Board.create({
      userId: user._id,
      name: body.name,
    });

    user.boards.push(board._id);
    await user.save();

    return NextResponse.json({
      message: "Board created successfully",
      board,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    // Kreiranje URL objekta za dobijanje query parametara
    const url = new URL(req.url, `http://${req.headers.host}`);
    const boardId = url.searchParams.get("boardId");

    if (!boardId) {
      return NextResponse.json(
        { error: "boardId is required" },
        { status: 400 }
      );
    }

    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    await connectMongo();

    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Brisanje board-a
    const result = await Board.deleteOne({
      _id: boardId,
      userId: session.user.id,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Board not found or not authorized to delete" },
        { status: 404 }
      );
    }

    // Ažuriranje liste korisničkih board-ova
    user.boards = user.boards.filter((id) => id.toString() !== boardId);
    await user.save();

    return NextResponse.json({ message: "Board deleted successfully" });
  } catch (error) {
    console.error("Error in DELETE API:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
