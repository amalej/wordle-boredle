import { useEffect, useState } from "react";

type Status = "loading" | "ok" | "error";

interface WordData {
  status: Status;
  word: string;
  meanings: {
    definitions: {
      definition: string;
      example: string;
    }[];
    example: string;
    partOfSpeech: string;
  }[];
}

export function useGetWordInfo(word: string) {
  const [data, setData] = useState<WordData>({
    status: "loading",
    word: word,
    meanings: [],
  });

  async function getWordMeaning(word: string) {
    const res = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );
    const text = await res.text();

    const json = JSON.parse(text);
    const meanings = json[0]["meanings"];
    setData({
      status: "ok",
      word: word,
      meanings: [...meanings],
    });
  }

  useEffect(() => {
    if (word) {
      getWordMeaning(word);
    }
  }, [word]);

  return data;
}
