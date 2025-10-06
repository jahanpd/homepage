import {  useState, useEffect } from "react";
import { openDB, type DBSchema } from 'idb';

const API_BASE = "https://ai.jcpd.xyz"
// const API_BASE = "http://localhost:8765"

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


const BASE_LETTER : Letter = {
		id: "letter",
		timestamp: 100,
		myName: "My Name",
		myPosition: "My Position",
		myEmail: "My Email",
		myAddress: "My address",
		toName: "To an HR person",
		toPosition: "Their position",
		toOrganisation: "The org",
		toAddress: "Address",
		purpose: "RE: the purpose",
		body: "Enter your cover letter here",
		signoff: "Sincerely,",
		myFinalName: "My name again",
}

export default function LetterBody({
  endpoint = `${API_BASE}/cover/letter/advice`,
  method = "POST",
  headers = {},
}) {

  const [letter, setLetter] = useState<Letter>(BASE_LETTER)
  const [letters, setLetters] = useState<string[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [text, setText] = useState(BASE_LETTER.body);
  const [previous, setPrevious] = useState(BASE_LETTER.body);
  const [feedback, setFeedback] = useState<string[]>([]);
  const [font, setFont] = useState<string>('Outfit')
  const [loading, setLoading] = useState<boolean>(false)

	useEffect(() => {
			getLetterKeys().then(
				(keys) => {
						setLetters(keys.map(k => k.toString()))
				}
			)
	}, [letter])

	const editLetter = async (part: string, value: string) => {
		if (part == "body") {setText(value)}
		await saveLetter({...letter, [part]: value})
		if (part == "id") {
				await delLetter(letter.id)
				setSelected(value)
		} else {
				setSelected(letter.id)
		}
		setLetter((letter) => {return {...letter, [part]: value}})
	}

	const changeLetter = async (id: string) => {
			const newLetter = await getLetter(id)
			setLetter(newLetter)
			setText(newLetter.body)
			setSelected(id)
	}

	const newLetter = async () => {
		await saveLetter({...BASE_LETTER, timestamp: Date.now()})
		setLetter(BASE_LETTER)
		setSelected(BASE_LETTER.id)
	}

  const saveIfChanged = async () => {
		console.log("checking fetch")
		if (!text) return
		// if (previous == text) return
		console.log("attempting fetch")
		setLoading(true)

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
			const body = await res.json()
			setPrevious(text)
			setFeedback(body)
    } catch (err) {
    } finally {
				setLoading(false)
      // Briefly show saved/error, then return to idle
    }
  };

  return (
    <div 
		className={`flex w-full flex-col gap-1`}
		style={{fontFamily: FONT_STACKS[font]}}
		>
		  <div className="w-full flex flex-row print:hidden">
					<select
						id="yolo"
						value={selected ? selected : ""}
						onChange={(e) => changeLetter(e.target.value)}
						className="w-full rounded-lg border border-gray-300 bg-white p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 print:hidden"
					>
						<option value="">— Select a Letter —</option>
						{letters.map((f) => (
							<option key={f} value={f}>
								{f}
							</option>
						))}
					</select>
					<input
						placeholder="new letter name"
						className="p-2 mx-2 border rounded-lg w-full print:hidden"
						value={letter.id}
						onChange={(el) => editLetter("id", el.target.value)}
						/>
					<button 
						className={`p-4 bg-green-200 hover:bg-green-400 font-mono print:hidden rounded-lg w-full`} 
						onClick={() => newLetter()}>
						NEW LETTER
					</button>
			</div>
		  <button 
				disabled={loading}
				className={`p-4 bg-slate-${loading ? "100" : "200"} hover:bg-slate-400 font-mono print:hidden`} 
				onClick={() => saveIfChanged()}>
				{loading ? "GETTING FEEDBACK......" : "GET AI FEEDBACK"}
			</button>
			<div className={[
					"w-full h-32 overflow-auto p-2",
					"border-2 rounded-lg border-red-500",
					"print:hidden font-mono text-sm",
					"flex flex-col"
			].join(" ")}>
				{feedback.length == 0 ? "No feedback" : (
						<>
						<ul className="list-disc">
						{feedback.map((el: string) => <li className="p-2"> {el} </li>)}
						</ul>
						</>
				)}
      </div>
			<select
			  id="yolo"
        value={font}
        onChange={(e) => setFont(e.target.value)}
        className="w-full rounded-lg border border-gray-300 bg-white p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 print:hidden"
        aria-label="Choose a font"
      >
        {Object.keys(FONT_STACKS).map((f) => (
          <option key={f} value={f}>
            {f}
          </option>
        ))}
      </select>
		  <div className={`flex flex-col h-48 font-[${FONT_STACKS[font]}] justify-end items-end p-4`}>
					<input onChange={(el) => editLetter("myName", el.target.value)} className="w-full text-right" value={letter.myName} />  
					<input onChange={(el) => editLetter("myPosition", el.target.value)} className="w-full text-right" value={letter.myPosition} />  
					<input onChange={(el) => editLetter("myEmail", el.target.value)} className="w-full text-right" value={letter.myEmail} />  
					<input onChange={(el) => editLetter("myAddress", el.target.value)} className="w-full text-right" value={letter.myAddress} />  
			</div>
		  <div 
			  className={`flex flex-col h-48 font-[${FONT_STACKS[font]}] justify-end items-start p-4`}
				>
					<input onChange={(el) => editLetter("toName", el.target.value)} className="w-full" value={letter.toName} />  
					<input onChange={(el) => editLetter("toPosition", el.target.value)} className="w-full" value={letter.toPosition} />  
					<input onChange={(el) => editLetter("toOrganisation", el.target.value)} className="w-full" value={letter.toOrganisation} />  
					<input onChange={(el) => editLetter("toAddress", el.target.value)} className="w-full" value={letter.toAddress} />  
					<input onChange={(el) => editLetter("purpose", el.target.value)} className="mt-2 w-full" value={letter.purpose} />  
			</div>

      <textarea
		    rows={1}
        onChange={(el) => {editLetter("body", el.target.value)}}
				value={text}
        className={[
          // box
          "w-full p-4 mb-4 h-auto",
					"resize-none [field-sizing:content]",
					`font-[${FONT_STACKS[font]}]`
        ].join(" ")}
      /> 

		  <div 
			  className={`flex flex-col h-48 font-[${FONT_STACKS[font]}] justify-end items-start px-4`}
				>
					<input onChange={(el) => editLetter("signoff", el.target.value)} className="pb-20 w-full" value={letter.signoff} />  
					<input onChange={(el) => editLetter("myFinalName", el.target.value)} className="mb-20 w-full" value={letter.myFinalName} />  
			</div>

    </div>
  );
}


async function getDB() {
	const db = await openDB('keyval-store', 1, {
			upgrade(db) {
				db.createObjectStore('keyval');
			},
  });
	return db
}


type Letter = {
		id: string,
		timestamp: number
		myName: string
		myPosition: string
		myEmail: string
		myAddress: string
		toName: string
		toPosition: string
		toOrganisation: string
		toAddress: string
		purpose: string
		body: string
		signoff: string
		myFinalName: string
}

async function saveLetter(letter: Letter) {
		const db = await getDB()
		await db.put('keyval', letter, letter.id);
}

async function getLetter(id: string) {
		const db = await getDB()
		return await db.get('keyval', id);
}

async function delLetter(id: string) {
		const db = await getDB()
		return await db.delete('keyval', id);
}

async function getLetterKeys() {
		const db = await getDB()
		return await db.getAllKeys('keyval');
}
