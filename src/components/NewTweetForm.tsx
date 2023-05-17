import { useSession } from "next-auth/react";
import { Button } from "./Button";
import { ProfileImage } from "./ProfileImage";
import{
  type FormEvent,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { api } from "~/utils/api";

const updateTextAreaHeight = (textArea?: HTMLTextAreaElement) => {
  if (textArea == null) return;
  textArea.style.height = "0";
  textArea.style.height = `${textArea.scrollHeight}px`;
};
export function NewTweetForm() {
  const session = useSession();

  if (session.status !== "authenticated") return null;
  return <Form />;
}

function Form() {
  const session = useSession();
  const user = session?.data?.user;
  const [inputValue, setInputValue] = useState("");
  const textAreaRef = useRef<HTMLTextAreaElement>();
  const inputRef = useCallback((textArea: HTMLTextAreaElement) => {
    updateTextAreaHeight(textArea);
    textAreaRef.current = textArea;
  }, []);

  useLayoutEffect(() => {
    updateTextAreaHeight(textAreaRef.current);
  }, [inputValue]);

  const createTweetMutation = api.tweet.create.useMutation({
    onSuccess: () => {
        setInputValue("");
    }
  });
  const createTweet = (e: FormEvent) => {
    e.preventDefault();
    if (inputValue.trim().length === 0) return;
    createTweetMutation.mutate({ content: inputValue });
  };

  return (
    <form
      className="flex flex-col gap-2 border-b px-4 py-2"
      onSubmit={createTweet}
    >
      <div className="flex gap-4">
        <ProfileImage src={user?.image} />
        <textarea
          ref={inputRef}
          style={{ height: 0 }}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
          className="flex-grow resize-none overflow-hidden p-4 text-lg outline-none"
          placeholder="What's happening?"
        ></textarea>
      </div>
      <Button className="self-end">Tweet</Button>
    </form>
  );
}
