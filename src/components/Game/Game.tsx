import { JSX, useEffect, useState } from "react";
import gCss from "./Game.module.css";
import { wordAnswerList, wordExtraList } from "../../utils/words";
import Keyboard from "../Keyboard/Keyboard";
import { toast } from "react-toastify";
import HelpIcon from "@mui/icons-material/Help";
import WordPopUp from "../WordPopUp/WordPopUp";
import ResetGamePopUp from "../ResetGamePopUp/ResetGamePopUp";

function Game() {
  const fullWordList = [...wordAnswerList, ...wordExtraList];

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [wordAnswer, setWordAnswer] = useState<string>("");
  const [pastGuesses, setPastGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [correctLetters, setCorrectLetters] = useState<string[]>([]);
  const [partiallyCorrectLetters, setPartialyCorrectLetters] = useState<
    string[]
  >([]);
  const [wrongLetters, setWrongLetters] = useState<string[]>([]);

  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [didGuessCorrect, setDidGuessCorrect] = useState<boolean>(false);
  const [streakCount, setStreakCount] = useState<number>(0);

  const [showWordInfoPopUp, setShowWordInfoPopUp] = useState<boolean>(false);
  const [showResetGamePopUp, setShowResetGamePopUp] = useState<boolean>(false);

  useEffect(() => {
    nextGame();
    setIsLoading(false);
  }, []);

  function nextGame() {
    const index = Math.floor(Math.random() * wordAnswerList.length);
    const wordAnswer = wordAnswerList[index];
    setWordAnswer(wordAnswer);
    setPastGuesses([]);
    setCurrentGuess("");

    setCorrectLetters([]);
    setPartialyCorrectLetters([]);
    setWrongLetters([]);

    setIsGameOver(false);
    setDidGuessCorrect(false);
  }

  function resetGame() {
    nextGame();
    setStreakCount(0);
  }

  function handleKeypress(key: string) {
    if (isGameOver) return;
    if (key === "delete") {
      setCurrentGuess(currentGuess.slice(0, -1));
      return;
    } else if (key === "enter") {
      if (currentGuess.length !== wordAnswer.length) {
        toast.warning("Too short");
        return;
      }

      const _correctLetters: string[] = [...correctLetters];
      const _partiallyCorrectLetters: string[] = [...partiallyCorrectLetters];
      const _wrongLetters: string[] = [...wrongLetters];
      if (!fullWordList.includes(currentGuess)) {
        toast.error("Word not in list");
        return;
      }

      for (let i = 0; i < currentGuess.length; i++) {
        const char = currentGuess.charAt(i);
        if (char === wordAnswer.charAt(i) && !_correctLetters.includes(char)) {
          if (_partiallyCorrectLetters.includes(char)) {
            const index = _partiallyCorrectLetters.indexOf(char);
            _partiallyCorrectLetters.splice(index, 1);
          }
          _correctLetters.push(char);
        } else if (
          wordAnswer.includes(char) &&
          !_correctLetters.includes(char) &&
          !_partiallyCorrectLetters.includes(char)
        ) {
          _partiallyCorrectLetters.push(char);
        } else if (
          !wordAnswer.includes(char) &&
          !_wrongLetters.includes(char)
        ) {
          _wrongLetters.push(char);
        }
      }

      setCorrectLetters(_correctLetters);
      setPartialyCorrectLetters(_partiallyCorrectLetters);
      setWrongLetters(_wrongLetters);
      setPastGuesses([...pastGuesses, currentGuess]);

      if (currentGuess === wordAnswer) {
        toast.success("You guessed correct!");
        setStreakCount(streakCount + 1);
        setIsGameOver(true);
        setDidGuessCorrect(true);
      } else if (pastGuesses.length === wordAnswer.length) {
        toast.error("You lose!");
        setIsGameOver(true);
        setDidGuessCorrect(false);
      }

      setCurrentGuess("");
      return;
    }

    if (currentGuess.length >= wordAnswer.length) {
      return;
    }

    if (/[a-zA-Z]/.test(key) && key.length === 1) {
      setCurrentGuess(currentGuess + key);
    }
  }

  function line(row: number): JSX.Element[] {
    const tiles: JSX.Element[] = [];
    const pastGuess = pastGuesses[row] ?? "".repeat(wordAnswer.length);

    const cleanAnswer: string[] = wordAnswer.split("");
    const pastGuessArr = [...cleanAnswer];
    for (let i = 0; i < wordAnswer.length; i++) {
      if (pastGuess?.charAt(i) == wordAnswer.charAt(i)) {
        cleanAnswer[i] = "_";
        pastGuessArr[i] = "_";
      }
    }

    for (let i = 0; i < wordAnswer.length; i++) {
      if (pastGuessArr[i] === "_" || pastGuessArr[i] === "-") continue;
      if (cleanAnswer.includes(pastGuess?.charAt(i))) {
        const index = cleanAnswer.indexOf(pastGuess.charAt(i));
        cleanAnswer[index] = "-";
        pastGuessArr[i] = "-";
      }
    }

    for (let i = 0; i < cleanAnswer.length; i++) {
      const char =
        pastGuesses.length === row
          ? currentGuess[i]
          : pastGuess?.charAt(i) ?? "";

      function tileClass() {
        if (pastGuesses.length > row) {
          if (pastGuessArr[i] === "_") {
            return gCss["correct-char-correct-index"];
          } else if (pastGuessArr[i] === "-") {
            return gCss["correct-char-incorrect-index"];
          } else {
            return gCss["incorrect-char-incorrect-index"];
          }
        }
        return "";
      }

      tiles.push(
        <div
          className={`${gCss["tile"]} ${tileClass()}`}
          key={`line_${row.toString().padStart(wordAnswer.length, "0")}-tile_${i
            .toString()
            .padStart(wordAnswer.length, "0")}`}
        >
          {char}
        </div>
      );
    }

    return tiles;
  }

  function grid(): JSX.Element[] {
    const lines: JSX.Element[] = [];
    for (let i = 0; i < wordAnswer.length + 1; i++) {
      lines.push(
        <div
          key={`line_${i.toString().padStart(wordAnswer.length, "0")}`}
          className={`${gCss["line"]}`}
        >
          {line(i)}
        </div>
      );
    }

    return lines;
  }

  return (
    <div className={`${gCss["main"]}`}>
      {!isLoading ? (
        <div className={`${gCss["board-container"]}`}>
          <div className={`${gCss["streak-data"]}`}>streak: {streakCount}</div>
          <div className={`${gCss["control-container"]}`}>
            <div className={`${gCss["word-answer"]}`}>
              {isGameOver ? (
                <>
                  <div className={`${gCss["word"]}`}>WORD: {wordAnswer}</div>
                  <div className={`${gCss["help"]}`}>
                    <HelpIcon
                      onClick={() => {
                        setShowWordInfoPopUp(true);
                      }}
                    />
                  </div>
                </>
              ) : (
                ""
              )}
            </div>

            {didGuessCorrect ? (
              <div className={`${gCss["next-button"]}`} onClick={nextGame}>
                next
              </div>
            ) : (
              <div
                className={`${gCss["reset-button"]}`}
                onClick={() => {
                  if (isGameOver) {
                    resetGame();
                  } else {
                    setShowResetGamePopUp(true);
                  }
                }}
              >
                reset
              </div>
            )}
          </div>
          <div className={`${gCss["board"]}`}>{grid()}</div>
          <div className={`${gCss["keyboard"]}`}>
            <Keyboard
              onKeypress={handleKeypress}
              correctLetters={correctLetters}
              partiallyCorrectLetters={partiallyCorrectLetters}
              wrongLetters={wrongLetters}
            />
          </div>
        </div>
      ) : (
        ""
      )}
      {/* Word Info pop up */}
      {showWordInfoPopUp ? (
        <WordPopUp
          word={wordAnswer}
          close={() => setShowWordInfoPopUp(false)}
        />
      ) : (
        ""
      )}
      {/* Reset game pop up */}
      {showResetGamePopUp ? (
        <ResetGamePopUp
          confirm={() => {
            resetGame();
            setShowResetGamePopUp(false);
          }}
          cancel={() => setShowResetGamePopUp(false)}
        />
      ) : (
        ""
      )}
    </div>
  );
}

export default Game;
