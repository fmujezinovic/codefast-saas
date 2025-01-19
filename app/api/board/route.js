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
