import { useCallback, useState } from "react";


const TextInput = () => {
  const [textInput, setTextInput] = useState("Hallo");
  const onChangeInput = useCallback(
    (e) => {
      setTextInput(e.target.value);
    },
    [textInput]
  );
  return (
      <input
        type="text"
        onChange={onChangeInput}
        value={textInput}
      />
  );
}
export default TextInput
