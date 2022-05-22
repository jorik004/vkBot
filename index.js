import { VK, Keyboard} from 'vk-io'
import express from 'express'
import config from './config/config.js'
import fs from 'fs'



//Load Server
const app = express()
const port = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.send('<h1 styele="color: green">Бот работает!</h1>')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

//VARIABLES
const vk = new VK({
    token: config.token,
})

let lvlCount = 0
let isSucc = false

//BUTTON
const builder = Keyboard.builder()
    .textButton({
        label: 'Начать',
        payload: {
            command: 'start'
        },
        color: 'positive',
    })
    .textButton({
        label: 'Информация о боте',
        payload: {
            command: 'info'
        },
        color: 'secondary',
    })
    .row()
    .textButton({
        label: 'Профиль',
        payload: {
            command: 'profile',
        },
        color: 'negative',
    })

const nextButton = Keyboard.builder()  
    // .textButton({
    //     label: 'Назад',
    //     payload: {
    //         command: 'true',
    //     },
    //     color: 'primary',
    // })
    .textButton({
        label: 'След.',
        payload: {
            command: 'next',
        },
        color: 'positive',
    })
    .row()
    .textButton({
        label: "Меню",
        payload: {
            command: 'menu',
        },
        color: 'negative',
    })

const creator = Keyboard.builder()
    .urlButton ({
        label: 'WhiteLord',
        url: 'https://vk.com/@white_lordz',
    })


//UPDATES
vk.updates.on('message_new', async context => {
    let [userData] = await vk.api.users.get({ user_id: context.senderId })

    if (context.text.toLowerCase() === 'привет') {
        await context.send({
            message: `Привет, ${userData.first_name}`,
            keyboard: builder,
        })
        fs.appendFileSync('./db/db.json', JSON.stringify({
            id: context.id,
            level: 0,
        }))
    }
    else if(context.text.toLowerCase() === 'начать' && lvlCount > 0 && lvlCount < 2){
        if (lvlCount < 1) {
            lvlCount++
        }
        await context.send({
            message: `Переменная
            Переменная – это «именованное хранилище» для данных. Мы можем использовать переменные для хранения товаров, посетителей и других данных.
            
            Для создания переменной в JavaScript используйте ключевое слово let.
            
            📇 1 let message;
            📇 2
            📇 3
            Приведённая выше инструкция создаёт (другими словами: объявляет или определяет) переменную с именем «message».
            
            Теперь можно поместить в неё данные, используя оператор присваивания =:
            📇 1 let message;
            📇 2 
            📇 3 message = 'Hello'; // сохранить строку 'Hello' в переменной с именем message
            
            Строка сохраняется в области памяти, связанной с переменной. Мы можем получить к ней доступ, используя имя переменной:
            📇 1 let message;
            📇 2 message = 'Hello!';
            📇 3 
            📇 4 alert(message); // показывает содержимое переменной, выводит на экран слово <<Hello!>>
            
            Для краткости можно совместить объявление переменной и запись данных в одну строку:
            📇 1 let message = 'Hello!'; // определяем переменную и присваиваем ей значение
            📇 2 
            📇 3 alert(message); // Hello!
            
            Мы также можем объявить несколько переменных в одной строке:
            📇 1 let user = 'John', age = 25, message = 'Hello';
            
            Такой способ может показаться короче, но мы не рекомендуем его. Для лучшей читаемости объявляйте каждую переменную на новой строке.

            Многострочный вариант немного длиннее, но легче для чтения:
            📇 1 let user = 'John';
            📇 2 let age = 25;
            📇 3 let message = 'Hello';
            
            Некоторые люди также определяют несколько переменных в таком вот многострочном стиле:
            📇 1 let user = 'John',
            📇 2     age = 25,
            📇 3     message = 'Hello';
                
            …Или даже с запятой в начале строки:
            📇 1 let user = 'John'
            📇 2     , age = 25
            📇 3     , message = 'Hello';
                
            В принципе, все эти варианты работают одинаково. Так что это вопрос личного вкуса и эстетики.
            
            ПРИМЕЧАНИЕ: var вместо let
            В старых скриптах вы также можете найти другое ключевое слово: var вместо let:
            
            var message = 'Hello';
            Ключевое слово var – почти то же самое, что и let. Оно объявляет переменную, но немного по-другому, «устаревшим» способом.
            
            Есть тонкие различия между let и var, но они пока не имеют для нас значения. Мы подробно рассмотрим их в главе Устаревшее ключевое слово "var".`,
            keyboard: nextButton,
        })
        
    }

    else if(context.text.toLowerCase() === 'след.' && lvlCount == 1){
        await context.send({
            message: `Задание: 
            Создать переменную с именем 'botName' и присвоить ей значение 'PlBots'
            
            P.S: переменная с текстом заключается в кавычки(двойные "" или ординарные ''), а с числом без кавычек!`
        })
    }

    else if(context.text.toLowerCase() === "let botName = 'PlBots'"  || 'let botName = "PlBots"' && lvlCount == 1){
        lvlCount++
        isSucc = true
        await context.send({
            message: `Задание выполнено
            +1🔥`
        })
    }

    else if(context.text.toLowerCase() === 'меню'){
        await context.send({
            message: 'Меню:',
            keyboard: builder,
        })
    }

    else if(context.text.toLowerCase() === 'информация о боте'){
        await context.send({
            message: `Создатель: [vk.com/@white_lordz|WhiteLord]
            
            📇 - Строки кода.
            🔥 - Показатель уровня.
            😎 - Имя и фамилия пользователя.`,
            keyboard: creator.inline(),
        })

    }
    else if(context.text.toLowerCase() === 'профиль'){
        await context.send({
            message: `✅ Профиль:
-----------------------------------------
😎 Имя: ${userData.first_name} ${userData.last_name}
-----------------------------------------
🔥 Уровень: ${lvlCount}`,
        })

    }

    else{
        await context.send('Неизвестная команда!')
    }

})

console.log('Бот запущен!')
await vk.updates.start();