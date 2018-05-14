import { Bot, ConsoleBot, MemorySessionStore } from 'bottender';
import { createServer } from 'bottender/express';
import WebConnector from './bot/WebConnector';

const bot = new Bot({
    connector: new WebConnector({ fallbackMethods: true}),
    sync: true,
})

// Bot will use memory session store as default if you don't assign sessionStore.
bot.setInitialState({
    asking: false,
    nickname: null
});


bot.onEvent(async context => {
   
    if (context.state.asking) {
        context.setState({ nickname: context.event.text, asking: false });
        await context.sendText(`Hello ${context.state.nickname}`);
        context.response.body = `Hello ${context.state.nickname}`;
    } else {
        context.resetState();
        context.setState({ asking: true });
        await context.sendText("Hi, what's your nickname?");
        context.response.body = "Hi, what's your nickname?";
    }
    console.log(context.response)
});
const server = createServer(bot);

server.listen(7777, () => {
    console.log('server is running on 7777 port...');
});
