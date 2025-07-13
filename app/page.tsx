"use client";

import { useState } from "react";

export default function Home() {
  const [sourceType, setSourceType] = useState("book");
  const [formData, setFormData] = useState<any>({});
  const [footnote, setFootnote] = useState("");
  const [bibliography, setBibliography] = useState("");

  const sourceTypes = [
    { value: "book", label: "Book" },
    { value: "ukCase", label: "UK Case" },
    { value: "ukAct", label: "UK Legislation (Act)" },
    { value: "ukSI", label: "UK Statutory Instrument" },
    { value: "euLaw", label: "EU Legislation" },
    { value: "echrCase", label: "ECHR Case" },
    { value: "article", label: "Journal Article" },
  ];

  const handleInputChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const flipAuthorName = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length < 2) return name;
    const surname = parts.pop();
    return `${surname} ${parts.join(" ")}`;
  };

  const generateCitation = (e: any) => {
    e.preventDefault();
    let f = "";
    let b = "";

    switch (sourceType) {
      case "book": {
        const { author, title, edition, publisher, year } = formData;
        if (!author || !title || !year) return setFootnote("Missing required fields.");
        const editionStr = edition ? `${edition} edn` : "";
        const footnoteDetails = [editionStr, publisher, year].filter(Boolean).join(", ");
        f = `${author}, _${title}_ (${footnoteDetails}).`;
        b = `${flipAuthorName(author)}, _${title}_ (${footnoteDetails})`;
        break;
      }

      case "ukCase": {
        const { caseName, year, report, page } = formData;
        f = `${caseName} [${year}] ${report} ${page}.`;
        b = `${caseName} [${year}] ${report} ${page}`;
        break;
      }

      case "ukAct": {
        const { actName, year, section } = formData;
        f = `${actName} ${year}${section ? `, s ${section}` : ""}.`;
        b = `${actName} ${year}${section ? `, s ${section}` : ""}`;
        break;
      }

      case "ukSI": {
        const { title, year, number } = formData;
        f = `${title} ${year}, SI ${number}.`;
        b = `${title} ${year}, SI ${number}`;
        break;
      }

      case "euLaw": {
        const { title, year, series, issue } = formData;
        f = `${title} [${year}] OJ ${series}${issue ? ` ${issue}` : ""}.`;
        b = `${title} [${year}] OJ ${series}${issue ? ` ${issue}` : ""}`;
        break;
      }

      case "echrCase": {
        const { party, appNo, date } = formData;
        f = `${party} App no ${appNo} (ECtHR, ${date}).`;
        b = `${party} App no ${appNo} (ECtHR, ${date})`;
        break;
      }

      case "article": {
        const { author, title, year, volume, journal, page } = formData;
        f = `${author}, ‘${title}’ [${year}] ${volume} ${journal} ${page}.`;
        b = `${flipAuthorName(author)}, ‘${title}’ [${year}] ${volume} ${journal} ${page}`;
        break;
      }

      default:
        f = "Unsupported type.";
        b = "Unsupported type.";
    }

    setFootnote(f);
    setBibliography(b);
  };

  const renderFields = () => {
    switch (sourceType) {
      case "book":
        return (
          <>
            <Input name="author" label="Author (required)" />
            <Input name="title" label="Title (required)" />
            <Input name="edition" label="Edition (optional)" />
            <Input name="publisher" label="Publisher (optional)" />
            <Input name="year" label="Year (required)" />
          </>
        );
      case "ukCase":
        return (
          <>
            <Input name="caseName" label="Case Name" />
            <Input name="year" label="Year" />
            <Input name="report" label="Law Report" />
            <Input name="page" label="Page Number" />
          </>
        );
      case "ukAct":
        return (
          <>
            <Input name="actName" label="Act Title" />
            <Input name="year" label="Year" />
            <Input name="section" label="Section (optional)" />
          </>
        );
      case "ukSI":
        return (
          <>
            <Input name="title" label="SI Title" />
            <Input name="year" label="Year" />
            <Input name="number" label="SI Number" />
          </>
        );
      case "euLaw":
        return (
          <>
            <Input name="title" label="Title" />
            <Input name="year" label="Year" />
            <Input name="series" label="Series (e.g. L or C)" />
            <Input name="issue" label="Issue Number (optional)" />
          </>
        );
      case "echrCase":
        return (
          <>
            <Input name="party" label="Case Name" />
            <Input name="appNo" label="Application Number" />
            <Input name="date" label="Judgment Date (e.g. 20 July 2004)" />
          </>
        );
      case "article":
        return (
          <>
            <Input name="author" label="Author" />
            <Input name="title" label="Article Title" />
            <Input name="year" label="Year" />
            <Input name="volume" label="Volume" />
            <Input name="journal" label="Journal Name" />
            <Input name="page" label="First Page" />
          </>
        );
      default:
        return null;
    }
  };

  // ✅ FIXED HERE: added "bg-white" to ensure visibility
  const Input = ({ name, label }: { name: string; label: string }) => (
    <div>
      <label className="block text-sm mb-1 font-semibold text-orange-600">{label}</label>
      <input
        name={name}
        onChange={handleInputChange}
        className="w-full px-4 py-2 border border-orange-500 bg-white text-black rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-600"
      />
    </div>
  );

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-start p-6">
      <div className="max-w-xl w-full bg-white p-6 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-center text-orange-600 mb-6">
          OSCOLA Citation Generator
        </h1>

        <form onSubmit={generateCitation} className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold text-orange-600">Select Source Type</label>

            <select
              value={sourceType}
              onChange={(e) => {
                setSourceType(e.target.value);
                setFormData({});
                setFootnote("");
                setBibliography("");
              }}
              className="w-full p-2 border border-orange-500 rounded-md text-black bg-white"
            >
              {sourceTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {renderFields()}

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
          >
            Generate Citation
          </button>
        </form>

        {footnote && (
          <div className="mt-6 p-4 bg-gray-50 border-l-4 border-blue-600 text-gray-800">
            <strong className="block mb-2">Footnote Citation:</strong>
            <p className="italic">{footnote}</p>
          </div>
        )}

        {bibliography && (
          <div className="mt-4 p-4 bg-gray-50 border-l-4 border-green-600 text-gray-800">
            <strong className="block mb-2">Bibliography Citation:</strong>
            <p className="italic">{bibliography}</p>
          </div>
        )}
      </div>
    </main>
  );
}

