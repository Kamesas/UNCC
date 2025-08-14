import * as fs from "fs";
import * as path from "path";

class InteractiveCLI {
  private questions: string[];
  private answers: Record<string, string> = {};
  private currentQuestionIndex: number = 0;
  private outputFileName: string;

  /**
   * Creates an instance of InteractiveCLI.
   * @param questions An array of questions to ask the user.
   * @param outputFileName The name of the file to save answers to.
   */
  constructor(questions: string[], outputFileName: string = "answers.txt") {
    this.questions = questions;
    this.outputFileName = outputFileName;
  }

  /**
   * Asks the current question in the console.
   */
  private askQuestion(): void {
    // 1. Get the question first and store it in a variable.
    const currentQuestion = this.questions[this.currentQuestionIndex];

    // 2. 🛡️ Add a type guard to check if the question actually exists.
    if (currentQuestion !== undefined) {
      // Inside this block, TypeScript now knows `currentQuestion` is a `string`.
      process.stdout.write(currentQuestion);
    } else {
      // It's good practice to handle the case where the question is missing.
      console.error("Error: Attempted to ask a non-existent question.");
      process.exit(1); // Exit with an error code.
    }
  }
  /**
   * Formats the collected answers and writes them to a file.
   */
  private generateOutputFile(): void {
    console.log(`\nThank you! Generating ${this.outputFileName}...`);

    let formattedAnswers = "--- User Answers ---\n\n";
    for (const question in this.answers) {
      formattedAnswers += `${question}: ${this.answers[question]}\n`;
    }

    try {
      fs.writeFileSync(
        path.resolve(process.cwd(), this.outputFileName),
        formattedAnswers
      );
      console.log(`✅ Successfully created ${this.outputFileName}!`);
    } catch (error) {
      console.error("❌ Error writing to file:", error);
    }

    process.exit();
  }

  /**
   * Starts the interactive command-line prompt.
   */
  public run(): void {
    // Ask the first question to start the process
    this.askQuestion();

    // Set up a listener for when the user provides data
    process.stdin.on("data", (data: Buffer) => {
      // ✅ MOVED INSIDE: Get the current question *every time* an answer is received.
      const questionText = this.questions[this.currentQuestionIndex];

      // Now the rest of the logic works correctly.
      if (questionText !== undefined) {
        const questionKey = questionText.trim();
        const answer = data.toString().trim();

        // Save the answer with the correct key
        this.answers[questionKey] = answer;

        // Move to the next question
        this.currentQuestionIndex++;

        if (this.currentQuestionIndex < this.questions.length) {
          this.askQuestion(); // Ask the next question
        } else {
          this.generateOutputFile(); // All questions answered, finish up
        }
      } else {
        console.error("Critical Error: Question index is out of bounds.");
        process.exit(1);
      }
    });
  }
}

// --- How to use the class ---

// 1. Define the list of questions.
const myQuestions = [
  "What is your name? ",
  "What is your favorite programming language? ",
  "What city do you live in? ",
];

// 2. Create an instance of the CLI.
const cli = new InteractiveCLI(myQuestions, "user-profile.txt");

// 3. Run the CLI.
cli.run();
