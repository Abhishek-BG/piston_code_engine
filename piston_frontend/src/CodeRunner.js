import React, { useState } from 'react';
import axios from 'axios';

const languages = [
    'c', //c
  'javascript', // Node.js
  'python3',    // Python 3
  'java',       // Java
  'cpp',        // C++
  'csharp',     // C#
  'ruby',       // Ruby
  'php',        // PHP
  'swift',      // Swift
  'go',         // Go
  'typescript', // TypeScript
  'rust',       // Rust
  'kotlin',     // Kotlin
  'bash',       // Bash
  'scala',      // Scala
  'perl',       // Perl
  'haskell',    // Haskell
  'clojure',    // Clojure
  'r',          // R
  'dart',       // Dart
];

const CodeRunner = () => {
  const [language, setLanguage] = useState(languages[0]);
  const [code, setCode] = useState('');
  const [inputs, setInputs] = useState(['']);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  const handleAddInput = () => {
    setInputs([...inputs, '']);
  };

  const handleRemoveInput = (index) => {
    const newInputs = inputs.filter((_, i) => i !== index);
    setInputs(newInputs);
  };

  const handleInputChange = (index, value) => {
    const newInputs = inputs.map((input, i) => (i === index ? value : input));
    setInputs(newInputs);
  };

  const handleCodeChange = (event) => {
    setCode(event.target.value);
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const runCode = async () => {
    try {
      const response = await axios.post('http://localhost:7777/run-code', {
        language,
        code,
        inputs,
      });
      setResults(response.data.output);
      setError(null);
    } catch (error) {
      setError('Code execution failed');
      setResults([]);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Code Runner</h1>
      <div className="mb-4">
        <label className="block mb-2">Language</label>
        <select value={language} onChange={handleLanguageChange} className="w-full p-2 border border-gray-300 rounded">
          {languages.map((lang) => (
            <option key={lang} value={lang}>
              {lang.charAt(0).toUpperCase() + lang.slice(1)}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-2">Code</label>
        <textarea
          value={code}
          onChange={handleCodeChange}
          rows="10"
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Test Cases</label>
        {inputs.map((input, index) => (
          <div key={index} className="mb-2 flex items-center">
            <textarea
              value={input}
              onChange={(e) => handleInputChange(index, e.target.value)}
              rows="3"
              className="w-full p-2 border border-gray-300 rounded mr-2"
            />
            <button
              onClick={() => handleRemoveInput(index)}
              className="p-2 bg-red-500 text-white rounded"
            >
              Delete
            </button>
          </div>
        ))}
        <button
          onClick={handleAddInput}
          className="p-2 bg-blue-500 text-white rounded"
        >
          Add Test Case
        </button>
      </div>
      <button
        onClick={runCode}
        className="p-2 bg-green-500 text-white rounded"
      >
        Run Code
      </button>
      {error && <p className="mt-4 text-red-500">{error}</p>}
      <div className="mt-4">
        <h2 className="text-xl font-bold">Results</h2>
        {results.map((result, index) => (
          <pre key={index} className="p-2 border border-gray-300 rounded mb-2 bg-gray-100">{result}</pre>
        ))}
      </div>
    </div>
  );
};

export default CodeRunner;
