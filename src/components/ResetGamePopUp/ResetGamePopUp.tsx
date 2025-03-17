import rgCss from "./ResetGamePopUp.module.css";

interface ResetGamePopUpProps {
  cancel?: () => any;
  confirm?: () => any;
}

function ResetGamePopUp(props: ResetGamePopUpProps) {
  return (
    <div className={`${rgCss["main"]}`}>
      <div className={`${rgCss["container"]}`}>
        <div className={`${rgCss["content"]}`}>
          This will set your streak to 0, do you want to reset?
        </div>
        <div className={`${rgCss["actions"]}`}>
          <div
            className={`${rgCss["button"]}`}
            onClick={() => {
              if (props.confirm) {
                props.confirm();
              }
            }}
          >
            Confirm
          </div>
          <div
            className={`${rgCss["button"]}`}
            onClick={() => {
              if (props.cancel) {
                props.cancel();
              }
            }}
          >
            Cancel
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetGamePopUp;
