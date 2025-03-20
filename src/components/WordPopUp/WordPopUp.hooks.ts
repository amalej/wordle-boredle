import { useEffect, useState } from "react";

type Status = "loading" | "ok" | "error";

interface WordMeaning {
  definitions: {
    definition: string;
    example: string;
  }[];
  example: string;
  partOfSpeech: string;
}

interface WordData {
  status: Status;
  word: string;
  meanings: WordMeaning[];
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

    const json = JSON.parse(text) as Array<{
      meanings: WordMeaning[];
    }>;

    const meanings: WordMeaning[] = [];
    for (let data of json) {
      meanings.push(...data.meanings);
    }
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
