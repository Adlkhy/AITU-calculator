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

        await sendMessage(chatId, "👋 Welcome to Evalis Choose a calculator or open the full website.", {
            inline_keyboard: [
                [
                    {
                        text: "📚 Open Evalis",
                        web_app: {
                            url: "https://evaiis.vercel.app/grade-tracker"
                        }
                    }
                ]
            ]
        });

    }

    if (text === "/gpa") {

        await sendMessage(chatId, "Open GPA Calculator", {
            inline_keyboard: [
                [
                    {
                        text: "📊 GPA Calculator",
                        web_app: {
                            url: "https://evaiis.vercel.app/calculator/gpa"
                        }
                    }
                ]
            ]
        });

    }
    if (text === "/attendance") {

        await sendMessage(chatId, "Open Attendance Tracker", {
            inline_keyboard: [
                [
                    {
                        text: "📊 Attendance Tracker",
                        web_app: {
                            url: "https://evaiis.vercel.app/calculator/attendance"
                        }
                    }
                ]
            ]
        });

    }
    if (text === "/final") {

        await sendMessage(chatId, "Open Final Grade Calculator", {
            inline_keyboard: [
                [
                    {
                        text: "📊 Final Grade Calculator",
                        web_app: {
                            url: "https://evaiis.vercel.app/calculator/final-grade"
                        }
                    }
                ]
            ]
        });

    }
    if (text === "/budget") {

        await sendMessage(chatId, "Open Budget Planner", {
            inline_keyboard: [
                [
                    {
                        text: "📊 Budget Planner",
                        web_app: {
                            url: "https://evaiis.vercel.app/calculator/budget"
                        }
                    }
                ]
            ]
        });

    }
    if (text === "/leaderboard") {

        await sendMessage(chatId, "Open Leaderboard", {
            inline_keyboard: [
                [
                    {
                        text: "📊 Leaderboard",
                        web_app: {
                            url: "https://evaiis.vercel.app/leaderboard"
                        }
                    }
                ]
            ]
        });

    }

    res.status(200).send("ok");

}