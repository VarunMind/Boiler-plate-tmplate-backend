import fs from "fs/promises";
import { v4 as uuidv4 } from "uuid";
const fetchRandomJoke = async () => {
  const res = await fetch(
    "https://v2.jokeapi.dev/joke/Programming?type=single"
  );
  const data = await res.json();
  return data?.joke;
};

const arr = [true, false];

const jenerateJoks = async () => {
  const rowData = await fs.readFile("data/emails.json", "utf-8");
  const allEmails = JSON.parse(rowData);

  let generatedJokes = [];

  for (const item of allEmails) {
    for (let i = 0; i < 10; i++) {
      const joke = await fetchRandomJoke();
      const jokeId = uuidv4();

      const jokeObject = {
        message: joke,
        id: jokeId,
        isSent: Math.random() < 0.5,
        mailId: item?.id,
      };
      console.log(jokeObject);

      generatedJokes.push(jokeObject);
    }
  }

  await fs.writeFile(
    "data/message.json",
    JSON.stringify(generatedJokes, null, 2),
    "utf-8"
  );
};

jenerateJoks();
