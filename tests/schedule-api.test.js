const supertest = require("supertest");
const app = require("../app");

const request = supertest(app);

describe("schedule endpoint", () => {
  const USER_MESSAGES_OLD = [
    {
      userId: "1234567",
      medium: "message",
      direction: "outbound",
      text: "How are you, Simon?",
      date: "2022-09-05T17:53:06.000Z",
    },
    {
      userId: "1234567",
      medium: "message",
      direction: "inbound",
      text: "I am pretty well today, Clare",
      date: "2022-09-05T17:53:32.000Z",
    },
    {
      userId: "1234567",
      medium: "message",
      direction: "outbound",
      text: "That's great to hear. Why do you think you feel that way?",
      date: "2022-09-05T17:53:40.000Z",
    },
    {
      userId: "1234567",
      medium: "message",
      direction: "inbound",
      text: "That's a good question. I got a really nice massage today.",
      date: "2022-09-05T17:53:44.000Z",
    },
    {
      userId: "1234567",
      medium: "message",
      direction: "outbound",
      text: "I am so happy for you! Should I save that to your happy moments?",
      date: "2022-09-05T17:53:47.000Z",
    },
    {
      userId: "1234567",
      medium: "message",
      direction: "inbound",
      text: "Yes please!",
      date: "2022-09-05T17:53:50.000Z",
    },
  ];
  const USER_MESSAGES_RECENT = [
    {
      userId: "1234567",
      medium: "message",
      direction: "outbound",
      text: "How are you, Simon?",
      date: "2022-01-15T17:53:50.000Z",
    },
    {
      userId: "1234567",
      medium: "message",
      direction: "inbound",
      text: "I am pretty well today, Clare",
      date: "2022-01-15T17:53:50.000Z",
    },
    {
      userId: "1234567",
      medium: "message",
      direction: "outbound",
      text: "2022-01-15T17:53:50.000Z",
    },
    {
      userId: "1234567",
      medium: "message",
      direction: "inbound",
      text: "That's a good question. I got a really nice massage today.",
      date: "2022-01-15T17:53:50.000Z",
    },
    {
      userId: "1234567",
      medium: "message",
      direction: "outbound",
      text: "I am so happy for you! Should I save that to your happy moments?",
      date: "2022-01-15T17:53:50.000Z",
    },
    {
      userId: "1234567",
      medium: "message",
      direction: "inbound",
      text: "Yes please!",
      date: "2022-01-15T17:53:50.000Z",
    },
  ];
  beforeAll(async () => {
    const connectDatabase = require("../src/database/connect");

    await connectDatabase();
  });
  it("should return current 7 day schedule", async () => {
    await request
      .post("/api/scheduler/1234567")
      .send({ userMessages: USER_MESSAGES_RECENT });

    const schedule = await request.get("/api/scheduler/1234567");

    expect(schedule.status).toEqual(200);
  });

  it("should not return current 7 day schedule", async () => {
    const schedule = await request.get("/api/scheduler/1234567");

    expect(schedule.status).toEqual(200);
  });

  it("should calculate schedule for next 7 days", async () => {
    const schedule = await request
      .post("/api/schedule")
      .send({ userMessages: USER_MESSAGES_RECENT });

    expect(schedule.status).toEqual(200);
  });

  it("should not calculate schedule for next 7 days", async () => {
    const schedule = await request
      .post("/api/schedule")
      .send({ userMessages: USER_MESSAGES_OLD });

    expect(schedule.status).toEqual(200);
  });
});
