import { cn, getUrlFromString } from "@/lib/utils";
import { Editor } from "@tiptap/core";
import { Check, Trash } from "lucide-react";
import {
  Dispatch,
  FC,
  SetStateAction,
  SyntheticEvent,
  useEffect,
  useRef,
} from "react";

interface LinkSelectorProps {
  editor: Editor;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export const LinkSelector: FC<LinkSelectorProps> = ({
  editor,
  isOpen,
  setIsOpen,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Autofocus on input by default
  useEffect(() => {
    inputRef.current && inputRef.current?.focus();
  });

  const handleSubmit = (e: SyntheticEvent) => {
    if (!inputRef.current) return;
    e.preventDefault();
    const url = getUrlFromString(inputRef.current.value);
    url && editor.chain().focus().setLink({ href: url }).run();
    setIsOpen(false);
  };

  return (
    <div className="novel-relative">
      <button
        type="button"
        className="novel-flex novel-h-full novel-items-center novel-space-x-2 novel-px-3 novel-py-1.5 novel-text-sm novel-font-medium novel-text-stone-600 hover:novel-bg-stone-100 active:novel-bg-stone-200"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <p className="novel-text-base">↗</p>
        <p
          className={cn(
            "novel-underline novel-decoration-stone-400 novel-underline-offset-4",
            {
              "novel-text-blue-500": editor.isActive("link"),
            },
          )}
        >
          Link
        </p>
      </button>
      {isOpen && (
        <div className="novel-fixed novel-top-full novel-z-[99999] novel-mt-1 novel-flex novel-w-60 novel-overflow-hidden novel-rounded novel-border novel-border-stone-200 novel-bg-white novel-p-1 novel-shadow-xl novel-animate-in novel-fade-in novel-slide-in-from-top-1">
          <input
            ref={inputRef}
            type="text"
            placeholder="Paste a link"
            className="novel-flex-1 novel-bg-white novel-p-1 novel-text-sm novel-outline-none"
            defaultValue={editor.getAttributes("link").href || ""}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          {editor.getAttributes("link").href ? (
            <button
              type="button"
              className="novel-flex novel-items-center novel-rounded-sm novel-p-1 novel-text-red-600 novel-transition-all hover:novel-bg-red-100 dark:hover:novel-bg-red-800"
              onClick={() => {
                editor.chain().focus().unsetLink().run();
                setIsOpen(false);
              }}
            >
              <Trash className="novel-h-4 novel-w-4" />
            </button>
          ) : (
            <button
              type="button"
              className="novel-flex novel-items-center novel-rounded-sm novel-p-1 novel-text-stone-600 novel-transition-all hover:novel-bg-stone-100"
              onClick={handleSubmit}
            >
              <Check className="novel-h-4 novel-w-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
