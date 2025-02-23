import React, { useState } from "react";
import { generateContent } from "../services/llmApi";
import ReactMarkdown from 'react-markdown';
import { motion } from "framer-motion";
import "./TimeMachine.css";

function CardGame() {
  const [protagonist, setProtagonist] = useState("");
  const [antagonist, setAntagonist] = useState("");
  const [startDate, setStartDate] = useState("October 25, 1985");
  const [targetDate, setTargetDate] = useState("November 5, 1955");
  const [location, setLocation] = useState("Los Angeles, California");
  const [gender, setGender] = useState("Nonbinary");
  const [tripType, setTripType] = useState("Round Trip");

  const [hoveredCard, setHoveredCard] = useState(null);


  const [storyText, setStoryText] = useState("");
  const [cards, setCards] = useState([]);
  const [conversation, setConversation] = useState([]);
  const [subgenre, setSubgenre] = useState("");
  const [storyline, setStoryline] = useState("New Story. Make it fun!");

  const handleStory = async (selectedText = "New Story. Make it fun!", e) => {
    if (e) e.preventDefault(); // Prevent form submission from reloading the page

    const prompt = `
You are the narrator for an interactive time travel story. This is a ${subgenre} ${tripType} to the year ${targetDate} from the year ${startDate}. 
The user's name is ${protagonist}, their gender is ${gender} and their opposition is ${antagonist || "None"}. 

This is the summary of what's happened so far: 
${storyline}
THe user selected: "${selectedText}" as their last response.

Replies should use this exact format:

New Story text goes here, draw out the scene with ASCII art, keeping mobile device width in mind.

|| Careful action
|| Bold action
|| Comedic action
|| Reckless action
|| Passive action
|| Evil action

|| Story summary goes here. Format the summary like this:
Key items: (Item)-(purpose)
Key Characters: (Name)-(plot relevance)
Past plot: (plot so far)
Current arc: (what is the user doing now)
Future plans: (your story plans)
Current date and time: (date and time)


Please remember to include || delimiters between each section of the response. Don't forget the summary at the end!

User inputs:
Protagonist: ${protagonist}
Protagonist's Gender: ${gender}
Antagonist: ${antagonist || "None"}
Starting Year: ${startDate}
Subgenre: ${subgenre}
Target Year to travel to: ${targetDate}


Generate story accordingly. Use tone and language appropriate to the subgenre and current date, and do the same for the user's response
options based on their starting date.
`;

    try {
      const rawText = await generateContent(prompt);
      if (rawText) {
        const parts = rawText.split("||").map(part => part.trim());
        const story = parts[0];
        const parsedOptions = parts.slice(1, 7);
        const summary = parts[7];
        console.log(rawText);
        console.log(summary);

        setStoryText(story);
        setCards(parsedOptions.map((opt) => opt));
        setStoryline("");
        setStoryline(summary);
        console.log(storyline);

        // Update conversation history
        setConversation((prev) => {
          const newEntry = { userChoice: selectedText, response: story };
          const updatedHistory = [...prev, newEntry];
          return updatedHistory;
        });
      } else {
        console.error("Failed to continue story.");
      }
    } catch (error) {
      console.error("Error processing card click:", error);
    }
  };

  return (
    
    <div className="card-game">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    </meta>
      <h1>Time Traveler</h1>
      <form onSubmit={(e) => handleStory("New Story.", e)} className="input-form">
        <label>
          Your Name:
          <input
            type="text"
            value={protagonist}
            onChange={(e) => setProtagonist(e.target.value)}
            required
          />
        </label>
        <label>
          Gender:
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="Masculine">Masculine</option>
            <option value="Feminine">Feminine</option>
            <option value="Nonbinary">Nonbinary</option>
          </select>
        </label>
        <label>
          Opposition (optional):
          <input
            type="text"
            value={antagonist}
            onChange={(e) => setAntagonist(e.target.value)}
          />
        </label>
        <label>
          Starting Date:
          <input
            type="text"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label>
          Target Date:
          <input
            type="text"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
          />
        </label>
        <label>
          Location:
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </label>
        <label>
          Type of Time Travel:
          <select value={subgenre} onChange={(e) => setTripType(e.target.value)}>
            <option value="Round Trip">Round Trip</option>
            <option value="One Way Trip">One Way Trip</option>
            <option value="Time Loop">Time Loop</option>
            <option value="Altered Timeline Round Trip">Altered Timeline Round Trip</option>
          </select>
        </label>
        <label>
          Subgenre:
          <select value={subgenre} onChange={(e) => setSubgenre(e.target.value)}>
            <option value="comedy">Comedy</option>
            <option value="rom-com">Romantic Comedy</option>
            <option value="romance">Romance</option>
            <option value="thriller">Thriller</option>
            <option value="horror">Horror</option>
            <option value="slasher">Slasher</option>
            <option value="tragedy">Tragedy</option>
            <option value="tragic comedy">Tragic Comedy</option>
            <option value="comedy of errors">Comedy of Errors</option>
            <option value="adventure">Adventure</option>
            <option value="action">Action</option>
          </select>
        </label>
        <button type="submit">Generate New Story</button>
      </form>

      <div className="story-container">
        <h2>Story</h2>
        <ReactMarkdown>{storyText}</ReactMarkdown>
      </div>

      <div className="options-container">
  <h2>Responses</h2>
  <div className="cards-container">
    {cards.map((cardText, index) => (
      <motion.div
        key={cardText + index}
        className="card"
        onClick={() => handleStory(cardText)}
        onHoverStart={() => setHoveredCard(index)}
        onHoverEnd={() => setHoveredCard(null)}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 1.2 }}
      >
      <ReactMarkdown>{cardText}</ReactMarkdown>
      </motion.div>
      ))}
    </div>
  </div>
  <div className="conversation-container">
    <h2>Conversation History</h2>
        <ul>
          {conversation.map((entry, index) => (
          <li key={index}>
            <strong>Choice:</strong> <ReactMarkdown>{entry.userChoice}</ReactMarkdown> <br />
            <strong>Response:</strong> <ReactMarkdown>{entry.response}</ReactMarkdown>
          </li>
          ))}
        </ul>
      </div>
  </div>
  );
}

export default CardGame;
