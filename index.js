/**
 * Entry-point for Serverless Function.
 *
 * @param event {Object} request payload.
 * @param context {Object} information about current execution context.
 *
 * @return {Promise<Object>} response to be serialized as JSON.
 */
 const replies = require('./replies');
 const movies = require('./movies');
 
 module.exports.handler = async (event, context) => {
     const {request, session, state} = event;
     const sessionState = state && state.session || {};
     const response = session.new
         ? replies.welcome()
         : checkAnswer(sessionState, request.command);
 
     return {
         response,
         session_state: sessionState,
         version: '1.0'
     };
 };
 
 function checkAnswer(sessionState, command) {
   if (!sessionState.list) {
     sessionState.list = movies.MOVIES;
   }
 
   if (!sessionState.movie || !sessionState.started) {
     const yes_words = ["да", "начинаем",]
     const no_words = ["нет", "нед"]
     if (commandInList(command, yes_words)) {
       sessionState.movie = replies.getRandomElement(sessionState.list);
       sessionState.movieCurrent = sessionState.movie
       sessionState.index = 0
       sessionState.questions = 1
       sessionState.answers = 0
       sessionState.answersWithoutHints = 0
       sessionState.started = true
       sessionState.hintUsed = false
       return replies.firstQuestion(sessionState.list.length, sessionState.movie);
     }
     else if (commandInList(command, no_words)) {
         return replies.exitGameHard();
     }
     else {
       return replies.wrongWelcome();
     }       
   }
 
   const bonus_words = ["бонусныйРаунд"]
   if (commandInList(command, bonus_words)) {
     sessionState.bonus = true
     return replies.bonusRound()
   }
 
   if (sessionState.bonus === true) {
     const bonus_author_words = ["зайнабМахаева"]
     sessionState.bonus = false
     if (commandInList(command, bonus_author_words)) {
       return replies.correctBonusRound() 
     }
     else {
       return replies.wrongBonusRound()
     }
   }
 
   const help_words = ["помощь", "помоги", "памаги", "какИграть", "чтоТыУмеешь"]
   if (commandInList(command, help_words)) {
     return replies.help()
   }
 
   const repeat_words = ["повтори", "повтор", "ещеРаз", "ещёРаз"]
   if (commandInList(command, repeat_words)) {
     var sound = sessionState.movie["sound"]
     return replies.repeat(sound)
   }
 
   if (JSON.stringify(sessionState.movieCurrent) != JSON.stringify(sessionState.movie)) {
     sessionState.hintUsed = false
   }
 
   if (isCorrectAnswer(sessionState.movie, command)) {
     sessionState.list = sessionState.list.filter(item => JSON.stringify(item) !== JSON.stringify(sessionState.movie))
     sessionState.answers++
     if (!sessionState.hintUsed) {
       sessionState.answersWithoutHints++
     }
     questionAnswered = true
     if (sessionState.list.length === 0) {
       return replies.gameOver(sessionState.questions, sessionState.answers, sessionState.answersWithoutHints, questionAnswered, sessionState.movie)
     }
     sessionState.movie = replies.getRandomElement(sessionState.list);
     sessionState.questions++
     return replies.correctAnswer(sessionState.movie);
   }
 
   const hint_words = ["подсказка", "подскаска", "потзкаска", "потскаска", "поцказка", "поцкаска", "пацказка", "пацкаска"]
   if (commandInList(command, hint_words)) {
     var tips = sessionState.movie["tips"]
     var hint = tips[sessionState.index]
     sessionState.hintUsed = true
     if (JSON.stringify(sessionState.movieCurrent) === JSON.stringify(sessionState.movie)) {
       sessionState.index++;
       if (sessionState.index === tips.length) {
         sessionState.index = 0
       }
       return replies.hint(hint)
     }
     else {
       sessionState.movieCurrent = sessionState.movie
       sessionState.index = 0
       hint = tips[sessionState.index]
       sessionState.index = sessionState.index+1;
       return replies.hint(hint)
     }
   }
 
   const surrender_words = ["сдаюсь", "здаюсь", "дальше"]
   if (commandInList(command, surrender_words)) {
     var answer = sessionState.movie["answer"]
     sessionState.list = sessionState.list.filter(item => JSON.stringify(item) !== JSON.stringify(sessionState.movie))
     questionAnswered = false
     if (sessionState.list.length === 0) {
        return replies.gameOver(sessionState.questions, sessionState.answers, sessionState.answersWithoutHints, questionAnswered, answer)
     }
     sessionState.movie = replies.getRandomElement(sessionState.list)
     sessionState.questions++
     return replies.capitulate(answer, sessionState.movie);
   }
 
   const stats_words = ["статистика"]
   if (commandInList(command, stats_words)) {
     return replies.stats(sessionState.questions, sessionState.list.length, sessionState.answers, sessionState.answersWithoutHints);
   }
 
   const stop_words = ["выход"]
   if (commandInList(command, stop_words)) {
     return replies.exitGame(sessionState.questions, sessionState.answers, sessionState.answersWithoutHints);
   }
 
   return replies.incorrectAnswer(sessionState.movie);
 }
 
 function isCorrectAnswer(movie, command) {
   command = command.replace(/\s+/g, '')
   names = movie["name"]
   return commandInList(command, names);
 }
 
 function commandInList(command, list) {
   command = command.replace(/[\s-,]+/g, '')
   matches = false
   for (item of list) {
       let exp = `.*${item}.*`
       let regex = new RegExp(exp, 'i');
       if (regex.test(command)) {
           matches = true
       }
   }
   return matches;
 }