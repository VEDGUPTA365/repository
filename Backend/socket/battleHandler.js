// In-memory room store: { roomCode: { quizId, quizTitle, questions, players: [...], status } }
const rooms = new Map();

function generateRoomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export function setupBattleSocket(io) {
  io.on("connection", (socket) => {
    // ==============================
    // HOST creates a room
    // ==============================
    socket.on("createRoom", ({ quizId, quizTitle, questions, playerName }) => {
      let roomCode;
      do {
        roomCode = generateRoomCode();
      } while (rooms.has(roomCode));

      const hostPlayer = {
        socketId: socket.id,
        name: playerName,
        score: 0,
        index: 0,
        finished: false,
        answers: [],
      };

      rooms.set(roomCode, {
        quizId,
        quizTitle,
        questions,
        players: [hostPlayer],
        status: "waiting", // waiting | countdown | active | finished
        hostId: socket.id,
      });

      socket.join(roomCode);
      socket.roomCode = roomCode;

      socket.emit("roomCreated", { roomCode, playerName });
      console.log(`[Battle] Room ${roomCode} created by ${playerName}`);
    });

    // ==============================
    // GUEST joins a room
    // ==============================
    socket.on("joinRoom", ({ roomCode, playerName }) => {
      const room = rooms.get(roomCode);

      if (!room) {
        socket.emit("joinError", { msg: "Room not found. Check the code and try again." });
        return;
      }
      if (room.status !== "waiting") {
        socket.emit("joinError", { msg: "Game already started. You cannot join now." });
        return;
      }
      if (room.players.length >= 2) {
        socket.emit("joinError", { msg: "Room is full (2 players max)." });
        return;
      }

      const guestPlayer = {
        socketId: socket.id,
        name: playerName,
        score: 0,
        index: 0,
        finished: false,
        answers: [],
      };

      room.players.push(guestPlayer);
      socket.join(roomCode);
      socket.roomCode = roomCode;

      // Notify both players
      io.to(roomCode).emit("playerJoined", {
        players: room.players.map((p) => ({ name: p.name, score: p.score, finished: p.finished })),
        quizTitle: room.quizTitle,
        totalQuestions: room.questions.length,
      });

      console.log(`[Battle] ${playerName} joined room ${roomCode}`);
    });

    // ==============================
    // HOST starts the game
    // ==============================
    socket.on("startGame", ({ roomCode }) => {
      const room = rooms.get(roomCode);
      if (!room || room.hostId !== socket.id) return;
      if (room.players.length < 2) {
        socket.emit("startError", { msg: "Wait for opponent to join before starting." });
        return;
      }

      room.status = "active";

      io.to(roomCode).emit("gameStarted", {
        questions: room.questions,
        players: room.players.map((p) => ({ name: p.name, score: p.score })),
      });

      console.log(`[Battle] Game started in room ${roomCode}`);
    });

    // ==============================
    // PLAYER submits an answer
    // ==============================
    socket.on("submitAnswer", ({ roomCode, questionIndex, answerIndex }) => {
      const room = rooms.get(roomCode);
      if (!room || room.status !== "active") return;

      const player = room.players.find((p) => p.socketId === socket.id);
      if (!player || player.finished) return;

      // Validate and score
      const question = room.questions[questionIndex];
      if (!question) return;

      const isCorrect = answerIndex === question.answer;
      if (isCorrect) player.score += 1;
      player.index = questionIndex + 1;

      // Broadcast live score update
      io.to(roomCode).emit("scoreUpdate", {
        players: room.players.map((p) => ({ name: p.name, score: p.score, index: p.index, finished: p.finished })),
      });
    });

    // ==============================
    // PLAYER finishes all questions
    // ==============================
    socket.on("playerFinished", ({ roomCode }) => {
      const room = rooms.get(roomCode);
      if (!room) return;

      const player = room.players.find((p) => p.socketId === socket.id);
      if (!player) return;

      player.finished = true;

      // Notify room that this player is done
      io.to(roomCode).emit("scoreUpdate", {
        players: room.players.map((p) => ({ name: p.name, score: p.score, index: p.index, finished: p.finished })),
      });

      // Check if both finished
      const allDone = room.players.every((p) => p.finished);
      if (allDone) {
        room.status = "finished";

        const sorted = [...room.players].sort((a, b) => b.score - a.score);
        const winner = sorted[0].score === sorted[1].score ? null : sorted[0]; // null = draw

        io.to(roomCode).emit("gameOver", {
          players: room.players.map((p) => ({ name: p.name, score: p.score })),
          winner: winner ? winner.name : null, // null = draw
          totalQuestions: room.questions.length,
        });

        // Cleanup room after 60s
        setTimeout(() => rooms.delete(roomCode), 60000);
        console.log(`[Battle] Game over in room ${roomCode}. Winner: ${winner ? winner.name : "Draw"}`);
      }
    });

    // ==============================
    // DISCONNECT cleanup
    // ==============================
    socket.on("disconnect", () => {
      const roomCode = socket.roomCode;
      if (!roomCode) return;

      const room = rooms.get(roomCode);
      if (!room) return;

      const leavingPlayer = room.players.find((p) => p.socketId === socket.id);
      if (!leavingPlayer) return;

      // If game not finished, notify opponent
      if (room.status !== "finished") {
        io.to(roomCode).emit("playerLeft", {
          playerName: leavingPlayer.name,
          msg: `${leavingPlayer.name} disconnected. Game ended.`,
        });
      }

      rooms.delete(roomCode);
      console.log(`[Battle] Room ${roomCode} closed (${leavingPlayer.name} left)`);
    });
  });
}
