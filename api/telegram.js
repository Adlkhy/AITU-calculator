const BOT_TOKEN = process.env.BOT_TOKEN;

async function sendMessage(chatId, text, keyboard) {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            chat_id: chatId,
            text,
            reply_markup: keyboard
        })
    });
}

export default async function handler(req, res) {

    const update = req.body;

    const message = update.message;

    if (!message) {
        return res.status(200).send("ok");
    }

    const chatId = message.chat.id;

    const text = message.text;

    if (text === "/start") {

        await sendMessage(chatId, "👋 Welcome to Evalis!\n\nFinals are temporary.\nGPA is... slightly less temporary.\nAnd future is not promised so...\n\nChoose a calculator below and let's pretend everything is under control.", {
            inline_keyboard: [
                [
                    {
                        text: "GPA",
                        web_app: {
                            url: "https://evaiis.vercel.app/calculator/gpa"
                        }
                    },
                    {
                        text: "Attendance",
                        web_app: {
                            url: "https://evaiis.vercel.app/calculator/attendance"
                        }
                    }
                ],
                [
                    {
                        text: "Final Grade",
                        web_app: {
                            url: "https://evaiis.vercel.app/calculator/final-grade"
                        }
                    }
                ],
                [
                    {
                        text: "Budget Planner",
                        web_app: {
                            url: "https://evaiis.vercel.app/calculator/budget"
                        }
                    },
                    {
                        text: "Leaderboard",
                        web_app: {
                            url: "https://evaiis.vercel.app/leaderboard"
                        }
                    }
                ],
                [
                    {
                        text: "Open Full Website",
                        web_app: {
                            url: "https://evaiis.vercel.app/grade-tracker"
                        }
                    }
                ]
            ]
        });

    }

    if (text === "/gpa") {

        await sendMessage(chatId, "Time to see how bad it really is...", {
            inline_keyboard: [
                [
                    {
                        text: "GPA",
                        web_app: {
                            url: "https://evaiis.vercel.app/calculator/gpa"
                        }
                    }
                ]
            ]
        });

    }
    if (text === "/attendance") {

        await sendMessage(chatId, "Attendance?", {
            inline_keyboard: [
                [
                    {
                        text: "Attendance",
                        web_app: {
                            url: "https://evaiis.vercel.app/calculator/attendance"
                        }
                    }
                ]
            ]
        });

    }
    if (text === "/final") {

        await sendMessage(chatId, "The moment of truth. Let's calculate your last hope...", {
            inline_keyboard: [
                [
                    {
                        text: "Final Grade",
                        web_app: {
                            url: "https://evaiis.vercel.app/calculator/final-grade"
                        }
                    }
                ]
            ]
        });

    }
    if (text === "/budget") {

        await sendMessage(chatId, "Money in, money out. Can you actually afford this lifestyle?", {
            inline_keyboard: [
                [
                    {
                        text: "Budget Planner",
                        web_app: {
                            url: "https://evaiis.vercel.app/calculator/budget"
                        }
                    }
                ]
            ]
        });

    }
    if (text === "/leaderboard") {

        await sendMessage(chatId, "See who's crushing it (and who's just... existing).", {
            inline_keyboard: [
                [
                    {
                        text: "Leaderboard",
                        web_app: {
                            url: "https://evaiis.vercel.app/leaderboard"
                        }
                    }
                ]
            ]
        });

    }
    if (text === "/help") {

        await sendMessage(chatId, "Help? 💀 \n\nThere's no such thing as help here. \nNo one's coming to help, nor save you. \nGo figure out the rest on your own. \n\nThat's life.", {
        });

    }

    res.status(200).send("ok");

}