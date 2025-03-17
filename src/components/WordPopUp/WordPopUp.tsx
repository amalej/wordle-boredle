import { useGetWordInfo } from "./WordPopUp.hooks";
import wpCss from "./WordPopUp.module.css";
import CircularProgress from "@mui/material/CircularProgress";
import CloseIcon from "@mui/icons-material/Close";

interface WordPopUpProps {
  word: string;
  close?: () => any;
}

function WordPopUp(props: WordPopUpProps) {
  const wordData = useGetWordInfo(props.word);

  return (
    <div
      className={`${wpCss["main"]}`}
      onClick={() => {
        if (props.close) {
          props.close();
        }
      }}
    >
      <div
        className={`${wpCss["container"]}`}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className={`${wpCss["header"]}`}>
          <div className={`${wpCss["word-string"]}`}>word: {wordData.word}</div>
          <CloseIcon
            onClick={(e) => {
              e.stopPropagation();
              if (props.close) {
                props.close();
              }
            }}
          />
        </div>
        {wordData.status === "loading" ? (
          <div className={`${wpCss["loading"]}`}>
            <CircularProgress size="5em" />
          </div>
        ) : wordData.status === "error" ? (
          "error"
        ) : (
          <div className={`${wpCss["word-info"]}`}>
            {wordData.meanings.map((data, i) => {
              return (
                <div key={`word-popup-meaning-${i}`}>
                  <div className={`${wpCss["word-part-of-speech"]}`}>
                    {data.partOfSpeech}
                  </div>
                  {data.definitions
                    .sort((a, b) => {
                      if (a.example && !b.example) {
                        return -1;
                      } else if (!a.example && b.example) {
                        return 1;
                      } else {
                        return 0;
                      }
                    })
                    .splice(0, 3)
                    .map((data, i) => {
                      return (
                        <div
                          key={`word-popup-meaning-definition-${i}`}
                          className={`${wpCss["word-definition-example"]}`}
                        >
                          <div className={`${wpCss["word-definition"]}`}>
                            {data.definition ? (
                              <div>
                                <div>Definition</div>
                                <div className={`${wpCss["content"]}`}>
                                  {data.definition}
                                </div>{" "}
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                          {data.example ? (
                            <div className={`${wpCss["word-example"]}`}>
                              <div>Example</div>
                              <div className={`${wpCss["content"]}`}>
                                {data.example}
                              </div>{" "}
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                      );
                    })}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default WordPopUp;
