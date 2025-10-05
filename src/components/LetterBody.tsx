import {  useState } from "react";
import { openDB, deleteDB, wrap, unwrap } from 'idb';

// const API_BASE = "https://ai.jcpd.xyz"
const API_BASE = "http://localhost:8123"

// Map each to a robust CSS font-family stack
export const FONT_STACKS: Record<string, string> = {
  // Sans
  'Inter': "'Inter','Segoe UI',Arial,system-ui,sans-serif",
  'Open Sans': "'Open Sans','Segoe UI',Arial,sans-serif",
  'Lato': "'Lato','Segoe UI',Arial,sans-serif",
  'Poppins': "'Poppins','Segoe UI',Arial,sans-serif",
  'Roboto': "'Roboto','Segoe UI',Arial,sans-serif",
  'Source Sans 3': "'Source Sans 3','Segoe UI',Arial,sans-serif",
  'Nunito': "'Nunito','Segoe UI',Arial,sans-serif",
  'Work Sans': "'Work Sans','Segoe UI',Arial,sans-serif",
  'DM Sans': "'DM Sans','Segoe UI',Arial,sans-serif",
  'Manrope': "'Manrope','Segoe UI',Arial,sans-serif",
  'Outfit': "'Outfit','Segoe UI',Arial,sans-serif",

  // Serif
  'Merriweather': "'Merriweather',Georgia,'Times New Roman',serif",
  'Source Serif 4': "'Source Serif 4',Georgia,'Times New Roman',serif",
  'EB Garamond': "'EB Garamond','Garamond',Georgia,serif",
  'Playfair Display': "'Playfair Display',Georgia,serif",
  'Libre Baskerville': "'Libre Baskerville','Baskerville',Georgia,serif",
  'Crimson Text': "'Crimson Text',Georgia,serif",
  'Cormorant Garamond': "'Cormorant Garamond','Garamond',Georgia,serif",
  'Lora': "'Lora',Georgia,serif",
  'Noto Serif': "'Noto Serif',Georgia,serif",

  // Mono
  'IBM Plex Mono': "'IBM Plex Mono','SFMono-Regular',Consolas,Menlo,Monaco,monospace",
  'Source Code Pro': "'Source Code Pro','SFMono-Regular',Consolas,Menlo,Monaco,monospace",
  'Fira Code': "'Fira Code','SFMono-Regular',Consolas,Menlo,Monaco,monospace",
  'JetBrains Mono': "'JetBrains Mono','SFMono-Regular',Consolas,Menlo,Monaco,monospace",
  'Inconsolata': "'Inconsolata','SFMono-Regular',Consolas,Menlo,Monaco,monospace",
};

export default function LetterBody({
  endpoint = `${API_BASE}/get_feedback`,
  method = "POST",
  initialText = "Type body here",
  headers = {},
}) {

  const [text, setText] = useState(initialText);
  const [previous, setPrevious] = useState(initialText);
  const [feedback, setFeedback] = useState<string[]>([]);
  const [font, setFont] = useState<string>('Inter')

  const handleInput = (e: any) => {
    const t = e.currentTarget.textContent ?? "";
    setText(t);
  };

  const saveIfChanged = async () => {
		if (!text) return
		if (previous == text) return

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
			setPrevious(text)
    } catch (err) {
    } finally {
      // Briefly show saved/error, then return to idle
    }
  };

  return (
    <div 
		className={`flex w-full flex-col gap-1`}
		style={{fontFamily: FONT_STACKS[font]}}
		>
		  <button className="p-4 bg-slate-200 hover:bg-slate-400 font-mono print:hidden">
					GET FEEDBACK
			</button>
			<div className={[
					"w-full min-h-12 overflow-auto p-2",
					"border-2 rounded-lg border-red-500",
					"print:hidden font-mono text-sm",
					"flex flex-col"
			].join(" ")}>
				{feedback.length == 0 ? "No feedback" : (
						<>
						<p> LLM Feedback: </p>
						<ul>
						{feedback.map((el: string) => <li> {el} </li>)}
						</ul>
						</>
				)}
      </div>
			<select
			  id="yolo"
        value={font}
        onChange={(e) => setFont(e.target.value)}
        className="w-full rounded-lg border border-gray-300 bg-white p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        aria-label="Choose a font"
      >
        {Object.keys(FONT_STACKS).map((f) => (
          <option key={f} value={f}>
            {f}
          </option>
        ))}
      </select>
		  <div className={`flex flex-col h-48 font-[${FONT_STACKS[font]}] justify-end items-end p-4`}>
					<div contentEditable className="">  
							My Name
					</div>
					<div contentEditable className="">  
							Position
					</div>
					<div contentEditable className="">  
							Email
					</div>
					<div contentEditable className="">  
							Address
					</div>

			</div>
		  <div 
			  className={`flex flex-col h-48 font-[${FONT_STACKS[font]}] justify-end items-start p-4`}
				>
					<div contentEditable className="">  
							Ms Hiring Person
					</div>
					<div contentEditable className="">  
							Position
					</div>
					<div contentEditable className="">  
							Organisation
					</div>
					<div contentEditable className="">  
							Address
					</div>
					<div contentEditable className="mt-2">  
							RE: purpose
					</div>
			</div>

      <div
        aria-multiline="true"
        tabIndex={0}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onBlur={saveIfChanged}
        className={[
          // box
          "min-h-24 w-full p-4 mb-4",
					`font-[${FONT_STACKS[font]}]`
        ].join(" ")}
      > {initialText} </div>

		  <div 
			  className={`flex flex-col h-48 font-[${FONT_STACKS[font]}] justify-end items-start p-4 mb-20`}
				>
					<div contentEditable className="pb-20">  
							Yours sincerely,
					</div>
					<div contentEditable className="">  
							My name
					</div>
			</div>

    </div>
  );
}

