import React, { useState } from "react";
import { SearchBar, Sidebar } from "../../components";
import { useNavigate } from "react-router-dom"; // Import useHistory for navigation
import { toast } from "react-toastify";

export const SimpleVideo = () => {
  const history = useNavigate(); // Initialize useHistory

  const handleFinish = () => {
    history("/homework"); // Navigate to the /homework page
  };

  return (
    <div className="m-6 p-6 bg-gray-800 rounded-xl shadow-lg">
      {/* Video Player Section */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white mb-4">
          Lesson Title: Present Simple
        </h2>
        <div className="aspect-w-16 aspect-h-9 h-[500px]">
          <iframe
            className="w-full h-full rounded-lg shadow-lg border-2 border-gray-600"
            src="https://www.youtube.com/embed/xhDLXFJNwBY" // Correct embed link
            title="Video Player"
            allowFullScreen
          ></iframe>
        </div>
      </div>

      {/* Video Description Section */}
      <div className="p-6 bg-gray-700 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-white mb-2">Description</h3>
        <p className="text-gray-300 leading-relaxed mb-4">
          In this lesson, we will explore the Present Simple tense, its usage,
          and how to form sentences. The Present Simple tense is used to
          describe habits, general truths, and repeated actions. It is also used
          to express facts and routines.
        </p>

        <h4 className="text-lg font-semibold text-white mb-2">
          Forms of the Present Simple
        </h4>

        <h5 className="text-md font-semibold text-gray-300">
          1. Positive Sentences
        </h5>
        <p className="text-gray-300 leading-relaxed mb-2">
          The structure for positive sentences in the Present Simple is:
          <br />
          <strong>
            Subject + base form of the verb (+ s/es for third person singular)
          </strong>
        </p>
        <p className="text-gray-300 leading-relaxed mb-2">
          Example:
          <br />
          - I play football.
          <br />- She plays tennis.
        </p>

        <h5 className="text-md font-semibold text-gray-300">
          2. Negative Sentences
        </h5>
        <p className="text-gray-300 leading-relaxed mb-2">
          The structure for negative sentences in the Present Simple is:
          <br />
          <strong>Subject + do/does not + base form of the verb</strong>
        </p>
        <p className="text-gray-300 leading-relaxed mb-2">
          Example:
          <br />
          - I do not (don't) play football.
          <br />- She does not (doesn't) play tennis.
        </p>

        <h5 className="text-md font-semibold text-gray-300">
          3. Question Sentences
        </h5>
        <p className="text-gray-300 leading-relaxed mb-2">
          The structure for question sentences in the Present Simple is:
          <br />
          <strong>Do/Does + subject + base form of the verb?</strong>
        </p>
        <p className="text-gray-300 leading-relaxed mb-2">
          Example:
          <br />
          - Do you play football?
          <br />- Does she play tennis?
        </p>

        <h4 className="text-lg font-semibold text-white mb-2">
          Usage of the Present Simple
        </h4>
        <p className="text-gray-300 leading-relaxed">
          The Present Simple tense is commonly used in the following situations:
          <ul className="list-disc list-inside text-gray-300">
            <li>
              To express habits and routines (e.g., I wake up at 7 AM every
              day).
            </li>
            <li>
              To state general truths or facts (e.g., Water boils at 100 degrees
              Celsius).
            </li>
            <li>
              To describe scheduled events in the near future (e.g., The train
              leaves at 6 PM).
            </li>
          </ul>
        </p>
      </div>

      {/* Finish Button */}
      <div className="mt-6">
        <button
          onClick={handleFinish}
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-300"
        >
          Finish
        </button>
      </div>
    </div>
  );
};

export const SimpleHomework = () => {
  const history = useNavigate(); // Initialize useNavigate
  const [answers, setAnswers] = useState(Array(9).fill("")); // Array to hold answers for 10 blanks
  const [results, setResults] = useState(Array(9).fill(null)); // Array to hold results for each answer
  const [availableWords, setAvailableWords] = useState([
    "go",
    "goes",
    "have",
    "likes",
    "like",
    "love",
    "play",
    "plays",
    "works",
  ]); // Array to hold available words
  const [mistakes, setMistakes] = useState(null); // State to hold the number of mistakes

  const correctAnswers = [
    "likes",
    "plays",
    "have",
    "works",
    "live",
    "goes",
    "love",
    "go",
    "play",
  ];

  const handleWordClick = (word) => {
    const newAnswers = [...answers];
    const wordIndex = newAnswers.findIndex((answer) => answer === ""); // Find the first empty answer

    if (wordIndex !== -1) {
      newAnswers[wordIndex] = word; // Set the clicked word in the corresponding blank
      setAnswers(newAnswers);
      setAvailableWords(availableWords.filter((w) => w !== word)); // Remove the word from available words
    }
  };

  const handleAnswerClick = (index) => {
    const newAnswers = [...answers];
    const wordToRemove = newAnswers[index];

    if (wordToRemove) {
      newAnswers[index] = ""; // Clear the answer
      setAnswers(newAnswers);
      setAvailableWords([...availableWords, wordToRemove]); // Add the word back to available words
    }
  };

  const handleCheckAnswers = () => {
    const newResults = answers.map((answer, index) =>
      answer.trim() === correctAnswers[index] ? true : false
    );
    setResults(newResults);

    // Calculate the number of mistakes
    const mistakeCount = newResults.filter((result) => result === false).length;
    setMistakes(mistakeCount);
  };

  const allFilled = answers.every((answer) => answer !== "");
  const handleFinish = () => {
    if (allFilled === true) {
      history("/simple/homework=tasks1"); // Navigate to the /homework page
    } else {
      toast.error("Please fill all the blanks to finish the task");
    }
  };

  // Check if all blanks are filled
  return (
    <div className="m-6 p-6 bg-gray-800 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-white mb-4">
        Present Simple Tasks
      </h2>

      <div className="p-6 bg-gray-700 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-white mb-2">Instructions</h3>
        <p className="text-gray-300 leading-relaxed mb-4">
          Complete the sentences with the correct form of the verb in Present
          Simple.
        </p>

        <div className="text-white mb-4">
          <p className="text-white">
            This is Usain Bolt. He's an athlete. His brother Sadiki{" "}
            <input
              type="text"
              value={answers[0]}
              onClick={() => handleAnswerClick(0)}
              readOnly
              className={`border-b border-gray-400 text-center w-1/4 ${
                results[0] === true
                  ? " rounded-lg bg-green-600"
                  : results[0] === false
                  ? " rounded-lg bg-red"
                  : "bg-transparent"
              }`}
            />
            sport too, but he{" "}
            <input
              type="text"
              value={answers[1]}
              onClick={() => handleAnswerClick(1)}
              readOnly
              className={`border-b border-gray-400 w-1/4 text-center ${
                results[1] === true
                  ? " rounded-lg bg-green-600"
                  : results[1] === false
                  ? " rounded-lg bg-red"
                  : "bg-transparent"
              }`}
            />
            cricket. Usain and Sadiki{" "}
            <input
              type="text"
              value={answers[2]}
              onClick={() => handleAnswerClick(2)}
              readOnly
              className={`border-b border-gray-400 w-1/4 text-center ${
                results[2] === true
                  ? " rounded-lg bg-green-600"
                  : results[2] === false
                  ? " rounded-lg bg-red"
                  : "bg-transparent"
              }`}
            />
            the same father, but different mothers. Their father{" "}
            <input
              type="text"
              value={answers[3]}
              onClick={() => handleAnswerClick(3)}
              readOnly
              className={`border-b border-gray-400 w-1/4 text-center ${
                results[3] === true
                  ? " rounded-lg bg-green-600"
                  : results[3] === false
                  ? " rounded-lg bg-red"
                  : "bg-transparent"
              }`}
            />
            in a shop. The two brothers{" "}
            <input
              type="text"
              value={answers[4]}
              onClick={() => handleAnswerClick(4)}
              readOnly
              className={`border-b border-gray-400 w-1/4 text-center ${
                results[4] === true
                  ? " rounded-lg bg-green-600"
                  : results[4] === false
                  ? " rounded-lg bg-red"
                  : "bg-transparent"
              }`}
            />
            in Jamaica, but Usain often{" "}
            <input
              type="text"
              value={answers[5]}
              onClick={() => handleAnswerClick(5)}
              readOnly
              className={`border-b border-gray-400 w-1/4 text-center ${
                results[5] === true
                  ? " rounded-lg bg-green-600"
                  : results[5] === false
                  ? " rounded-lg bg-red"
                  : "bg-transparent"
              }`}
            />
            abroad for International competitions. They both{" "}
            <input
              type="text"
              value={answers[6]}
              onClick={() => handleAnswerClick(6)}
              readOnly
              className={`border-b border-gray-400 w-1/4 text-center ${
                results[6] === true
                  ? " rounded-lg bg-green-600"
                  : results[6] === false
                  ? " rounded-lg bg-red"
                  : "bg-transparent"
              }`}
            />
            reggae music, and they often{" "}
            <input
              type="text"
              value={answers[7]}
              onClick={() => handleAnswerClick(7)}
              readOnly
              className={`border-b border-gray-400 w-1/4 text-center ${
                results[7] === true
                  ? " rounded-lg bg-green-600"
                  : results[7] === false
                  ? " rounded-lg bg-red"
                  : "bg-transparent"
              }`}
            />
            to clubs. In their free time, they{" "}
            <input
              type="text"
              value={answers[8]}
              onClick={() => handleAnswerClick(8)}
              readOnly
              className={`border-b border-gray-400 w-1/4 text-center ${
                results[8] === true
                  ? " rounded-lg bg-green-600"
                  : results[8] === false
                  ? " rounded-lg bg-red"
                  : "bg-transparent"
              }`}
            />
            dominoes or video games.
          </p>
        </div>

        <h4 className="text-lg font-semibold text-white mb-2">Words to Use</h4>
        <div className="flex flex-wrap mb-4">
          {availableWords.map((word, index) => (
            <button
              key={index}
              onClick={() => handleWordClick(word)}
              className="bg-blue-600 text-white rounded-lg px-3 py-1 m-1 hover:bg-blue-700"
            >
              {word}
            </button>
          ))}
        </div>

        {/* Result Display */}
        {mistakes !== null && (
          <div
            className={`mt-4 p-4 text-center transition-all duration-300 ${
              mistakes > 0 ? "bg-red" : "bg-green-600"
            } text-white rounded-lg`}
          >
            {mistakes > 0
              ? `${mistakes} mistake(s) made.`
              : "Everything correct!"}
          </div>
        )}
      </div>

      {/* Check Answers Button */}
      {allFilled && (
        <div className="mt-6">
          <button
            onClick={handleCheckAnswers}
            className="w-full py-2 bg-yellow-500 hover:bg-yellow-700 text-white font-semibold rounded-lg transition duration-300"
          >
            Check Answers
          </button>
        </div>
      )}

      {/* Finish Button */}
      <div className="mt-2">
        <button
          onClick={handleFinish}
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-300"
        >
          Next
        </button>
      </div>
    </div>
  );
};


export const SimpleSentence1 = () => {
  const [answers, setAnswers] = useState(["", ""]); // Array to hold answers for the two blanks
  const [results, setResults] = useState([null, null]); // Array to hold results for each answer
  const correctAnswers = ["go", "by car"]; // Correct answers for the blanks

  const handleChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value; // Update the answer for the corresponding blank
    setAnswers(newAnswers);
  };

  const handleCheckAnswers = () => {
    const newResults = answers.map(
      (answer, index) => answer.trim().toLowerCase() === correctAnswers[index]
    );
    setResults(newResults);
  };

  return (
    <div className="m-6 p-6 bg-gray-800 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-white mb-4">Fill in the Blanks</h2>

      {/* Image related to the sentence */}
      <img
        src="https://via.placeholder.com/400x200.png?text=Work+Image"
        alt="Work"
        className="mb-4 rounded-lg"
      />

      <p className="text-gray-300 mb-4">
        Complete the sentence:
        <span className="text-white font-bold">
          {" "}
          I{" "}
          <input
            type="text"
            value={answers[0]}
            onChange={(e) => handleChange(0, e.target.value)}
            className={`border-b border-gray-400 rounded-lg w-1/4 ${
              results[0] === true
                ? "bg-green-600"
                : results[0] === false
                ? "bg-red"
                : "bg-gray-700"
            }`}
          />{" "}
          to work{" "}
          <input
            type="text"
            value={answers[1]}
            onChange={(e) => handleChange(1, e.target.value)}
            className={`border-b border-gray-400 rounded-lg  w-1/4 ${
              results[1] === true
                ? "bg-green-600"
                : results[1] === false
                ? "bg-red"
                : "bg-gray-700"
            }`}
          />
          .
        </span>
      </p>

      <button
        onClick={handleCheckAnswers}
        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-300"
      >
        Check Answers
      </button>

      {/* Result Display */}
      {results.some((result) => result !== null) && (
        <div className="mt-4 p-4 text-center text-white rounded-lg">
          {results.every((result) => result === true)
            ? "Everything correct!"
            : "Please try again."}
        </div>
      )}
    </div>
  );
};


// export const SimpleVocabulary = () => {
//   return (
//     <div className="flex container gap-10">
//       <Sidebar />
//       <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%]">
//         <SearchBar flex={"hidden"} />
//         <div className="p-4 rounded-lg bg-[#2c2a2a] borderClass w-full">
//           <h2>Present Simple</h2>
//         </div>
//       </div>
//     </div>
//   );
// };

// No default export, both components are named exports
