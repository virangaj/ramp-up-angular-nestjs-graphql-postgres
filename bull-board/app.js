// arena-server.js
const express = require("express");
const { createBullBoard } = require("@bull-board/api");
const { BullAdapter } = require("@bull-board/api/bullAdapter");
const { ExpressAdapter } = require("@bull-board/express");
const Queue = require("bull");

const app = express();
const port = 5000;

// Connect to the existing queue
const fileUploadQueue = new Queue("FILEUPLOAD_QUEUE", {
  redis: {
    host: "localhost",
    port: 6379,
  },
});

// Setup Bull Board
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

createBullBoard({
  queues: [new BullAdapter(fileUploadQueue)],
  serverAdapter: serverAdapter,
});

app.use("/admin/queues", serverAdapter.getRouter());

app.listen(port, () => {
  console.log(`Bull Arena is running on http://localhost:${port}/admin/queues`);
});
