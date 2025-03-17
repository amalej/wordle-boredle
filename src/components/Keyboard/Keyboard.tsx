import { useEffect, useState } from "react";
import kCss from "./Keyboard.module.css";

interface KeyboardProps {
  onKeypress: (key: string) => any;
  correctLetters: string[];
  partiallyCorrectLetters: string[];
  wrongLetters: string[];
}

function Keyboard(props: KeyboardProps) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const keyboardKeys: string[][] = [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
    ["enter", "z", "x", "c", "v", "b", "n", "m", "delete"],
  ];

  useEffect(() => {
    setIsLoading(false);
    function handleKeyDown(e: KeyboardEvent) {
      const key = e.key === "Backspace" ? "delete" : e.key.toLowerCase();
      props.onKeypress(key);
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [props.onKeypress]);

  return (
    <div className={`${kCss["main"]}`}>
      {!isLoading ? (
        <>
          {keyboardKeys.map((keyRow, i) => {
            return (
              <div
                key={`keyboard_row_${i}`}
                className={`${kCss["keyboard-row"]}`}
              >
                {keyRow.map((key) => {
                  return (
                    <button
                      key={`keyboard_${key}`}
                      className={`
                    ${kCss["key"]}
                    ${kCss[`key-row-${i}`]} 
                    ${
                      key === "enter" || key === "delete"
                        ? kCss["key-action"]
                        : ""
                    }
                    ${props.correctLetters.includes(key) ? kCss["correct"] : ""}
                    ${
                      props.partiallyCorrectLetters.includes(key)
                        ? kCss["partially-correct"]
                        : ""
                    }
                    ${props.wrongLetters.includes(key) ? kCss["wrong"] : ""}
                    `}
                      onClick={() => props.onKeypress(key)}
                    >
                      {key}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </>
      ) : (
        ""
      )}
    </div>
  );
}

export default Keyboard;
