function spspGame() {
    const choices = ["stone", "paper", "scissors", "pencil"];
    let userScore = 0;
    let botScore = 0;

    const userName = prompt("Enter your name:").trim() || "Player";
    while (true) {
        const userInput = prompt(
            `${userName}'s Score: ${userScore} | Computer's Score: ${botScore}\n` +
            "Choose a number:\n" +
            "1: Stone\n" +
            "2: Paper\n" +
            "3: Scissors\n" +
            "4: Pencil\n" +
            "Type '0' to quit"
        );

        const userChoice = parseInt(userInput, 10);

        if (userChoice === 0) {
            alert(`Final Score - ${userName}: ${userScore} | Computer: ${botScore}\nThanks for playing!`);
            break;
        }

        if (userChoice < 1 || userChoice > 4 || isNaN(userChoice)) {
            alert("Invalid choice! Please choose a number between 1 and 4.");
            continue;
        }

        const user = choices[userChoice - 1];
        const bot = choices[Math.floor(Math.random() * choices.length)];
        alert(`Bot chose: ${bot}`);

        if (user === bot) {
            alert("It's a tie! 😐");
            continue;
        }

        const winsAgainst = {
            stone: ["scissors", "pencil"],   // stone breaks scissors and pencil
            paper: ["stone"],                // paper covers stone
            scissors: ["paper", "pencil"],   // scissors cuts paper and pencil
            pencil: ["paper"]                // pencil draws on paper
        };

        if (winsAgainst[user]?.includes(bot)) {
            userScore++;
            alert("You win! 🎉");
        } else {
            botScore++;
            alert("You lose! 😢");
        }
    }
}

spspGame();