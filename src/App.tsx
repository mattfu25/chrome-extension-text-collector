import React, { useState, useEffect } from "react";
import "./App.css";
import { Snippet, SnippetList } from "./components/SnippetList";

// *** IMPORT RECHARTS ***
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  LabelList,
} from "recharts";

// Define a sample snippet for initial state when local storage is empty
const sample_snippet: Snippet = { id: 1, text: "Sample snippet" };

function App() {
  // *** COURSE STATE ***
  const sample = {
    id: "CIS-1200",
    title: "Prog Lang & Tech I",
    description:
      "A fast-paced introduction to the fundamental concepts of programming and software design. This course assumes some previous programming experience, at the level of a high school computer science class or CIS 1100. (If you got at least 4 in the AP Computer Science A or AB exam, you will do great.) No specific programming language background is assumed: basic experience with any language (for instance Java, C, C++, VB, Python, Perl, or Scheme) is fine. If you have never programmed before, you should take CIS 1100 first.",
    prerequisites: "",
    course_quality: 2.806,
    instructor_quality: 2.879,
    difficulty: 1.058,
    work_required: 3.358,
    credits: 1,
    instructors: [
      {
        name: "Swapneel Sheth",
      },
      {
        name: "Benjamin Pierce",
      },
    ],
  };
  const [course, setCourse] = useState(sample);

  // *** DATA ***
  const data = [
    { name: "Course Quality", value: course.course_quality },
    { name: "Instructor Quality", value: course.instructor_quality },
    { name: "Difficulty", value: course.difficulty },
    { name: "Work Required", value: course.work_required },
  ];

  // *** COLOR FUNCTION ***
  const getColor = (index, value) => {
    if (index <= 1) {
      if (value <= 2.5) return "#d00000";
      if (value <= 3) return "#ffd60a";
      return "#a3b18a";
    }

    if (index >= 2) {
      if (value <= 2.5) return "#a3b18a";
      if (value <= 3) return "#ffd60a";
      return "#d00000";
    }
  };

  // Define the state variable for storing the list of snippets
  const [snippets, setSnippets] = useState<Snippet[]>([]);

  // Use useEffect to load snippets from local storage when the component mounts
  useEffect(() => {
    chrome.storage.local.get("snippets", (result) => {
      if (result.snippets === undefined) {
        // If 'snippets' key doesn't exist in local storage, set the initial state with the sample snippet
        setSnippets([sample_snippet]);
      } else {
        // If 'snippets' key exists in local storage, set the state with the stored snippets
        setSnippets(result.snippets);
      }
    });
  }, []);

  // Handler for editing a snippet
  const handleEditSnippet = (id: number, newText: string) => {
    // Create a new array with the updated snippet
    const updatedSnippets = snippets.map((snippet) =>
      snippet.id === id ? { ...snippet, text: newText } : snippet
    );
    // Update the state with the new array
    setSnippets(updatedSnippets);
    // Save the updated snippets to local storage
    chrome.storage.local.set({ snippets: updatedSnippets });
  };

  // Handler for deleting a snippet
  const handleDeleteSnippet = (id: number) => {
    // Create a new array without the deleted snippet
    const updatedSnippets = snippets.filter((snippet) => snippet.id !== id);
    // Update the state with the new array
    setSnippets(updatedSnippets);
    // Save the updated snippets to local storage
    chrome.storage.local.set({ snippets: updatedSnippets });
  };

  return (
    <div className="App">
      {/* *** BAR CHART *** */}
      <BarChart
        width={350}
        height={150}
        data={data}
        layout="vertical"
        margin={{ top: 5, right: 50, left: 20, bottom: 5 }}
      >
        <XAxis type="number" hide={true} />
        <YAxis
          dataKey="name"
          type="category"
          axisLine={false}
          tickLine={false}
        />
        <Bar
          dataKey="value"
          fill="#8884d8"
          barSize={20}
          radius={[10, 10, 10, 10]}
        >
          <LabelList
            dataKey="value"
            position="right"
            style={{ fill: "#000", fontSize: 14 }}
          />
          {data.map((entry, index) => (
            <Cell key={`${index}`} fill={getColor(index, entry.value)} />
          ))}
        </Bar>
      </BarChart>

      {/* <h1>Snippet Collector</h1> */}
      {/* Render the SnippetList component with the snippets and event handlers */}
      {/* <SnippetList
        snippets={snippets}
        onEditSnippet={handleEditSnippet}
        onDeleteSnippet={handleDeleteSnippet}
      /> */}
    </div>
  );
}

export default App;
