/**
 * Приветственное сообщение при входе в навык.
 */
 exports.welcome = () => {
  return {
    text: `👋 Привет.\n🎥 Ваша задача - отгадать название фильма, сериала или мультфильма по музыкальному отрывку.\n${help_text}\n🚩 Начинаем игру?`,
    tts: `<speaker audio="alice-sounds-game-powerup-1.opus">Привет. Ваша задача - отгадать название фильма, сериала или мультфильма по музыкальному отрывку. Прослушайте список доступных команд: ${help_sound} Начинаем игру?`,
    buttons: [
      { title: 'Начинаем', hide: true },
    ],
    end_session: false
  };
};

/**
* Первый вопрос пользователю.
*
* @param {Number} size
* @param {Map} movie
*/
exports.firstQuestion = (size, movie) => {
 sound = movie["sound"]
 return {
   text: `👍 Отлично.\nКоличество вопросов в базе на данный момент: ${size}.\nПрослушайте первый отрывок ➡`,
   tts: `Отлично. Количество вопросов в базе на данный момент: ${size}. Прослушайте первый отрывок: ${sound}`,
   buttons: [capitulateButton, hintButton, repeatButton, statsButton, exitButton],
   end_session: false
 };
};

/**
* Реакция на неправильный ответ.
*
* @param {Map} movie
*/
exports.incorrectAnswer = (movie) => {
 sound = movie["sound"]
 const no = getRandomElement(['Неверно', 'Неправильно', 'Нет', 'Не могу принять ответ']);
 return {
   text: `⚠ ${no}. Попробуйте еще раз`,
   tts: `${no}. Попробуйте еще раз`,
   buttons: [capitulateButton, hintButton, repeatButton, statsButton, exitButton],
   end_session: false
 };
};

/**
* Реакция на правильный ответ.
*
* @param {Map} movie
*/
exports.correctAnswer = (movie) => {
 sound = movie["sound"]
 const yes = getRandomElement(['Правильно', 'Отлично', 'Верно', 'А Вы молодец', 'Браво', 'Принято']);
 return {
   text: `😎 ${yes}!\nСледующий вопрос ➡`,
   tts: `${yes}! Следующий вопрос: ${sound}`,
   buttons: [capitulateButton, hintButton, repeatButton, statsButton, exitButton],
   end_session: false
 };
};

/**
* Реакция на "подсказка".
*
* @param {String} hint
*/
exports.hint = (hint) => {
 return {
   text: `💡 ${hint}`,
   tts: `${hint}`,
   buttons: [capitulateButton, hintButton, repeatButton, statsButton, exitButton],
   end_session: false
 };
};

/**
* Реакция на "повтори".
*
* @param {String} repeat
*/
exports.repeat = (repeat) => {
 return {
   text: `Хорошо, прослушайте еще раз ↩`,
   tts: `Хорошо, прослушайте еще раз. ${repeat}`,
   buttons: [capitulateButton, hintButton, repeatButton, statsButton, exitButton],
   end_session: false
 };
};

/**
* Реакция на "сдаюсь".
*
* @param {String} answer
* @param {Map} movie
*/
exports.capitulate = (answer, movie) => {
  sound = movie["sound"]
  return {
    text: `🙁 Правильный ответ: "${answer}".\nПрослушайте следующий отрывок ➡`,
    tts: `<speaker audio="alice-sounds-game-boot-1.opus"> Правильный ответ ${answer}. Прослушайте следующий отрывок: ${sound}`,
    buttons: [capitulateButton, hintButton, repeatButton, statsButton, exitButton],
    end_session: false
  };
};

/**
* Варианты исчерпаны.
*
* @param {Number} questions
* @param {Number} answers
* @param {Number} answersWithoutHints
* @param {Boolean} questionAnswered
* @param {String} answer
*/
exports.gameOver = (questions, answers, answersWithoutHints, questionAnswered, answer="") => {
 if (questionAnswered) {
   return {
     text: `😎 Верно.\n🏁 Поздравляю! 😊 Вы прошли всю игру!\n📊 Вопросов задано: ${questions}.\n☑ Правильных ответов: ${answers}.\n✅ Правильных ответов без подсказок: ${answersWithoutHints}.\nДля повторной игры запустите навык еще раз.`,
     tts: `Верно. Поздравляю! Вы прошли всю игру! Вопросов задано: ${questions}. Правильных ответов: ${answers}. Правильных ответов без подсказок: ${answersWithoutHints}. Для повторной игры запустите навык еще раз.`,
     end_session: true
   };
 }
 else {
   return {
     text: `🙁 Правильный ответ: "${answer}".\n🏁 Поздравляю! 😊 Вы прошли всю игру!\n📊 Вопросов задано: ${questions}.\n☑ Правильных ответов: ${answers}.\n✅ Правильных ответов без подсказок: ${answersWithoutHints}.\nДля повторной игры запустите навык еще раз.`,
     tts: `Правильный ответ ${answer}. Поздравляю! Вы прошли всю игру! Вопросов задано: ${questions}. Правильных ответов: ${answers}. Правильных ответов без подсказок: ${answersWithoutHints}. Для повторной игры запустите навык еще раз.`,
     end_session: true
   };
 }
};

/**
* Реакция на "помощь".
*
*/
exports.help = () => {
 return {
   text: `${help_text}`,
   tts: `${help_sound}`,
   buttons: [capitulateButton, hintButton, repeatButton, statsButton, exitButton],
   end_session: false
 };
};

/**
* Реакция на неправильное начало.
*
*/
exports.wrongWelcome = () => {
 return {
   text: `😑 Простите, принимаю ответ "Да"/"Начинаем" или "Нет".\n🚩 Начинаем игру?`,
   tts: `Простите, принимаю ответ "Да" или "Нет". Начинаем игру?`,
   buttons: [
     { title: 'Начинаем', hide: true },
   ],
   end_session: false
 };
};

/**
* Реакция на конец игры в самом начале.
*
*/
exports.exitGameHard = () => {
 return {
   text: `😩 Очень жаль, надеюсь сыграть с вами в будущем.`,
   tts: `Очень жаль, надеюсь сыграть с вами в будущем.`,
   end_session: true
 };
};

/**
* Реакция на статистику.
*
* @param {Number} questions
* @param {Number} questionsRemained
* @param {Number} answers
* @param {Number} answersWithoutHints
*/
exports.stats = (questions, questionsRemained, answers, answersWithoutHints) => {
 return {
   text: `📊 Вопросов задано: ${questions}.\n↘ Вопросов осталось: ${questionsRemained}.\n☑ Правильных ответов: ${answers}.\n✅ Правильных ответов без подсказок: ${answersWithoutHints}`,
   tts: `Вопросов задано: ${questions}. Вопросов осталось: ${questionsRemained}. Правильных ответов: ${answers}. Правильных ответов без подсказок: ${answersWithoutHints}`,
   buttons: [capitulateButton, hintButton, repeatButton, statsButton, exitButton],
   end_session: false
 };
};

/**
* Реакция на конец игры.
*
* @param {Number} questions
* @param {Number} answers
* @param {Number} answersWithoutHints
*/
exports.exitGame = (questions, answers, answersWithoutHints) => {
 return {
   text: `😊 Спасибо за игру.\n📊 Вопросов задано: ${questions}.\n☑ Правильных ответов: ${answers}.\n✅ Правильных ответов без подсказок: ${answersWithoutHints}.\nБуду рада видеть вас снова!`,
   tts: `Спасибо за игру. Вопросов задано: ${questions}. Правильных ответов: ${answers}. Правильных ответов без подсказок: ${answersWithoutHints}. Буду рада видеть вас снова.`,
   end_session: true
 };
};

/**
* Реакция на бонусный раунд.
*
*/
exports.bonusRound = () => {
 return {
   text: `😁 Угадайте исполнителя`,
   tts: `Угадайте исполнителя: <speaker audio="dialogs-upload/ae608e1e-83a3-49fe-8047-142d8873b6ca/c464b123-9432-44ab-a1b0-9d2c22136413.opus">`,
   buttons: [capitulateButton, hintButton, repeatButton, statsButton, exitButton],
   end_session: false
 };
};

/**
* Реакция на верный бонусный раунд.
*
*/
exports.correctBonusRound = () => {
 return {
   text: `🙌 Браво.\nВы настоящий знаток дагестанской эстрады. Чтобы продолжить игру и прослушать музыкальный отрывок еще раз, нажмите на "Повтори".`,
   tts: `Верно. Вы настоящий знаток дагестанской эстрады. Чтобы продолжить игру и прослушать музыкальный отрывок еще раз, скажите: "Алиса, повтори".`,
   buttons: [capitulateButton, hintButton, repeatButton, statsButton, exitButton],
   end_session: false
 };
};

/**
* Реакция на неверный бонусный раунд.
*
*/
exports.wrongBonusRound = () => {
 return {
   text: `😟 К сожалению, нет.\nЧтобы пройти бонусный раунд еще раз, скажите: "Алиса, бонусный раунд".\nЧтобы продолжить игру и прослушать музыкальный отрывок еще раз, нажмите на "Повтори".`,
   tts: `К сожалению, нет. Чтобы пройти бонусный раунд еще раз, скажите: "Алиса, бонусный раунд". Чтобы продолжить игру и прослушать музыкальный отрывок еще раз, скажите: "Алиса, повтори"`,
   buttons: [capitulateButton, hintButton, repeatButton, statsButton, exitButton],
   end_session: false
 };
};

const capitulateButton = {
 title: 'Сдаюсь', hide: true
};

const repeatButton = {
 title: 'Повтори', hide: true
};

const hintButton = {
 title: 'Подсказка', hide: true
};

const statsButton = {
 title: 'Статистика', hide: true
};

const bonusButton = {
 title: 'Бонусный раунд', hide: true
};

const exitButton = {
 title: 'Выход', hide: true
};

const exit_text = '🚪 Для выхода из игры нажмите на "Выход"\n'
const exit_sound = 'Для выхода из игры скажите: "Алиса, выход."'

const hint_text = '💡 Для подсказки нажмите на "Подсказка".\nВам доступны 3 подсказки на каждый вопрос.\n'
const hint_sound = 'Для подсказки произнесите: "Алиса, подсказка".Вам доступны 3 подсказки на каждый вопрос.'

const repeat_text = '↩ Чтобы повторить отрывок, нажмите на "Повтори".\n'
const repeat_sound = 'Чтобы повторить отрывок, скажите: "Алиса, повтори".'

const capitulate_text = '🙁 Если не знаете, нажмите на "Сдаюсь".\n'
const capitulate_sound = 'Если не знаете, произнесите: "Алиса, сдаюсь" или "Алиса, дальше".'

const stats_text = '📊 Чтобы узнать текущий счет, нажмите на "Статистика".\n'
const stats_sound = 'Чтобы узнать текущий счет, произнесите: "Алиса, статистика".'

const help_text = `${hint_text} ${repeat_text} ${capitulate_text} ${stats_text} ${exit_text}\nℹ Чтобы прослушать список команд еще раз, скажите: "Алиса, помощь".`
const help_sound = `${hint_sound} ${repeat_sound} ${capitulate_sound} ${stats_sound} ${exit_sound} Чтобы прослушать список команд еще раз, скажите: "Алиса, помощь".`

function getRandomElement(arr) {
  const index = Math.floor(Math.random() * arr.length);
  return arr[index];
}

exports.getRandomElement = getRandomElement
