// answers[0] is what we show. Other entries are accepted spellings.
const r = (kind, question, answers, hints, why) => ({ kind, question, answers, hints, why });

export const riddles = [
  r('riddle', "What has keys but can't open a single door?", ['A piano', 'keyboard'], ['It makes music.', 'Its keys are black and white.'], 'A piano is full of keys, and not one of them fits a lock.'),
  r('riddle', 'What gets wetter the more it dries?', ['A towel'], ["You'll find it in the bathroom.", 'You use it after a shower.'], 'It takes on the water as it dries you.'),
  r('riddle', 'What has hands but cannot clap?', ['A clock', 'watch'], ['It hangs on the wall.', 'It tells you something all day long.'], 'A clock has an hour hand and a minute hand.'),
  r('riddle', 'What has a neck but no head?', ['A bottle'], ['It is usually made of glass.', 'It holds a drink.'], 'The narrow top of a bottle is called its neck.'),
  r('riddle', 'What can you catch but never throw?', ['A cold', 'cold', 'flu'], ['You might get it in winter.', 'It comes with sneezing.'], 'You catch a cold, and nobody ever throws one back.'),
  r('riddle', "What has an eye but can't see?", ['A needle', 'storm', 'hurricane'], ['You will find it in a sewing box.', 'Thread goes through it.'], "The hole in a needle is called its eye. A storm's eye counts too."),
  r('riddle', "What has many teeth but can't bite?", ['A comb', 'saw', 'zip', 'zipper'], ['You would use it in the morning.', 'It runs through your hair.'], 'The fine prongs of a comb are called teeth.'),
  r('riddle', 'What runs but never walks, and has a bed but never sleeps?', ['A river', 'stream'], ['Think of the outdoors.', 'It flows to the sea.'], 'A river runs along a riverbed.'),
  r('riddle', 'What goes up but never comes down?', ['Your age', 'age'], ['It happens to everyone.', 'It changes once a year.'], 'Every birthday, it only goes one way.'),
  r('riddle', 'The more you take, the more you leave behind. What are they?', ['Footsteps', 'steps', 'footprints'], ['You do this when you go for a walk.', 'Think of a sandy beach.'], 'Each step you take leaves another behind you.'),
  r('riddle', 'What has one head, one foot and four legs?', ['A bed'], ['You use it every night.', 'It is in your bedroom.'], 'A bed has a head, a foot and four legs.'),
  r('riddle', 'What can travel around the world while staying in a corner?', ['A stamp', 'postage stamp'], ['It belongs on an envelope.', 'You need one to post a letter.'], 'A stamp stays in the corner of the envelope.'),
  r('riddle', 'What has to be broken before you can use it?', ['An egg'], ['You might have one at breakfast.', 'It comes from a hen.'], 'An omelette needs a few of these broken first.'),
  r('riddle', 'What begins with T, ends with T and has T in it?', ['A teapot'], ['You will find it in a kitchen.', 'Think of the word "tea".'], 'A teapot has tea in it, and its name starts and ends with T.'),
  r('riddle', 'Which word is spelled incorrectly in every dictionary?', ['Incorrectly'], ['Read the question very carefully.', 'The answer is right there in the question.'], 'The word "incorrectly" is always spelled i-n-c-o-r-r-e-c-t-l-y.'),
  r('riddle', 'What is full of holes but still holds water?', ['A sponge'], ['You would use it for washing up.', 'It is soft and squishy.'], 'The holes in a sponge are what soak the water up.'),
  r('riddle', "I'm tall when I'm young and short when I'm old. What am I?", ['A candle'], ['I give off light.', 'I am made of wax.'], 'A candle gets shorter as it burns.'),
  r('riddle', 'What has words but never speaks?', ['A book', 'newspaper', 'magazine'], ['You would find plenty in a library.', 'You turn its pages.'], 'A book is full of words and silent as can be.'),
  r('riddle', "What has a thumb and four fingers but isn't alive?", ['A glove', 'mitten'], ['You would wear it in winter.', 'It usually comes in a pair.'], 'A glove has the shape of a hand with nothing living in it.'),
  r('riddle', 'What belongs to you, but other people use it more than you do?', ['Your name', 'name'], ['You have had it since you were born.', 'People call you by it.'], 'You rarely need to say your own name.'),
  r('riddle', 'What can fill a room but takes up no space?', ['Light', 'sunlight', 'darkness', 'sound', 'air'], ['You can turn it on.', 'It comes in through the window.'], 'Light fills a room but has no bulk.'),
  r('riddle', 'What gets bigger the more you take away from it?', ['A hole'], ['You might dig one.', 'You would use a spade.'], 'Every spadeful removed makes a hole larger.'),
  r('riddle', 'What kind of room has no doors or windows?', ['A mushroom'], ['It grows in the woods.', 'It can be a pizza topping.'], 'The room is in the name of a mushroom.'),
  r('riddle', 'What can you hold in your left hand but never in your right hand?', ['Your right elbow', 'right elbow', 'right hand'], ['It is part of your body.', 'It is on the right side of you.'], 'Your right hand can never reach your right elbow.'),
  r('riddle', 'What has its bottom at the top?', ['Your legs', 'legs', 'leg'], ['It is part of your body.', 'You stand on them.'], 'The top of your legs meets your bottom.'),
  r('riddle', 'Which question can you never answer yes to?', ['Are you asleep?', 'asleep', 'sleeping', 'dead'], ['It is something you could be asked at night.', 'If you could answer, it would not be true.'], 'If you can say yes, you must be awake.'),
  r('riddle', 'What has four wheels and flies?', ['A rubbish truck', 'garbage truck', 'bin lorry', 'dustcart', 'truck', 'lorry'], ['Not the kind of flying you are thinking of.', 'Think of insects, and collection day.'], 'The flies are insects, buzzing around the bins.'),
  r('riddle', 'Which five-letter word gets shorter when you add two letters to it?', ['Short'], ['Look closely at the question.', 'Add E and R.'], 'Short plus "er" makes "shorter".'),
  r('riddle', 'What comes once in a minute, twice in a moment, but never in a thousand years?', ['The letter M', 'm'], ['Think about spelling.', 'Look at the words themselves.'], 'The word "minute" has one M, and "moment" has two.'),
  r('riddle', 'What starts with E, ends with E, and only has one letter in it?', ['An envelope'], ['Think of the post.', 'The "letter" is the kind you send.'], 'An envelope holds one letter.'),
  r('riddle', 'What has a head and a tail, but no body?', ['A coin'], ['You might flip it.', 'You would find it in your purse.'], 'A coin has a heads side and a tails side.'),
  r('riddle', 'Feed me and I live. Give me a drink and I die. What am I?', ['Fire', 'flame'], ['I am hot.', 'I need wood to keep going.'], 'Fuel makes a fire grow, and water puts it out.'),
  r('riddle', 'What goes through towns and over hills, but never moves?', ['A road', 'path', 'street', 'motorway'], ['Cars rely on it.', 'It might have white lines on it.'], 'A road stays put while everything travels along it.'),
  r('riddle', "What's black when you buy it, red when you use it, and grey when you throw it away?", ['Charcoal', 'coal'], ['Think of a barbecue.', 'You burn it.'], 'Charcoal glows red and burns down to grey ash.'),
  r('riddle', 'What can ring but has no finger?', ['A telephone', 'phone', 'bell', 'doorbell'], ['You answer it.', 'You might say hello to it.'], 'A telephone rings without wearing any jewellery.'),
  r('riddle', 'What can be cracked, made, told and played?', ['A joke'], ['It is supposed to make you laugh.', 'A comedian has plenty.'], 'You can crack a joke, make one, tell one or play one.'),
  r('riddle', "If you have me, you want to share me. If you share me, you don't have me. What am I?", ['A secret'], ['You might whisper me.', 'You promise not to tell.'], 'A secret stops being one once it is shared.'),
  r('riddle', "What has lots of eyes but can't see?", ['A potato'], ['It grows underground.', 'It might end up as chips.'], 'The little buds on a potato are called eyes.'),
  r('riddle', 'What has ears but cannot hear?', ['Corn', 'maize', 'wheat', 'field'], ['It grows on a farm.', 'It pops at the cinema.'], 'Corn grows in ears.'),
  r('riddle', 'What flies without wings?', ['Time'], ['You might notice it when having fun.', 'A clock measures it.'], 'Time flies when you are having fun.'),

  r('logic', 'A farmer has 17 sheep. All but 9 run away. How many are left?', ['9', 'nine'], ['Read "all but 9" slowly.', '"All but 9" means every sheep except 9.'], 'If all but 9 ran away, then 9 stayed.'),
  r('logic', 'There are 3 apples and you take away 2. How many apples do you have?', ['2', 'two'], ['The question is about you, not the pile.', 'How many did you pick up?'], 'You took 2, so 2 is what you have.'),
  r('logic', 'How many months of the year have 28 days?', ['12', 'twelve', 'all'], ['February is not the only one.', 'Do any months have fewer than 28?'], 'Every month has at least 28 days.'),
  r('logic', 'A rooster lays an egg on the very top of a barn roof. Which way does it roll?', ["It doesn't. Roosters don't lay eggs", 'none', 'neither', 'doesnt', 'no egg', 'rooster', 'roosters', 'wont'], ['Think about the bird.', 'Which chickens lay eggs?'], 'Roosters are male, so there is no egg.'),
  r('logic', "Mary's father has five daughters: Nana, Nene, Nini, Nono and who?", ['Mary'], ['Go back to the very first word.', 'Whose father is it?'], 'The fifth daughter is Mary herself.'),
  r('logic', 'You are running a race and overtake the person in second place. What place are you in now?', ['Second', '2nd', '2', 'two'], ['You have not passed the leader.', 'Whose position did you take?'], 'You took their place, which was second.'),
  r('logic', 'Which weighs more: a kilogram of feathers or a kilogram of bricks?', ['Neither, they weigh the same', 'same', 'neither', 'equal', 'both'], ['Read the units again.', 'A kilogram is a kilogram.'], 'They are both exactly one kilogram.'),
  r('logic', 'A bat and a ball cost £1.10 together. The bat costs £1 more than the ball. How many pence does the ball cost?', ['5', 'five', '5p', '0.05'], ['It is not 10p. Check: the bat would then be £1.10.', 'Try the ball at less than 10p.'], 'The ball is 5p and the bat £1.05, which makes £1.10.'),
  r('logic', 'If 5 machines take 5 minutes to make 5 toys, how many minutes do 100 machines take to make 100 toys?', ['5', 'five', '5 minutes'], ['How long does one machine take for one toy?', 'Each machine works at the same time as the others.'], 'One machine makes one toy in 5 minutes, so 100 machines make 100 in the same time.'),
  r('logic', 'A patch of lily pads doubles in size each day and covers a lake in 48 days. On which day does it cover half the lake?', ['47', 'forty seven', 'day 47', 'forty-seven'], ['Think backwards from the last day.', 'What happens on the final doubling?'], 'It doubles from half to full on day 48, so it was half on day 47.'),
  r('logic', 'A clock takes 5 seconds to strike 6. How many seconds does it take to strike 12?', ['11', 'eleven', '11 seconds'], ['Count the gaps, not the strikes.', 'Six strikes have five gaps, so each gap is one second.'], 'Twelve strikes have eleven gaps of one second.'),
  r('logic', 'In a family, each boy has as many brothers as sisters, and each girl has twice as many brothers as sisters. How many children are there?', ['7', 'seven'], ['Try a family with one more boy than girls.', 'Try 4 boys and 3 girls.'], 'With 4 boys and 3 girls, a boy has 3 and 3, and a girl has 4 and 2.'),
  r('logic', 'A plane crashes exactly on the border of two countries. Where do they bury the survivors?', ['Nowhere', 'dont', "don't", 'survivors', 'alive', 'not buried'], ['Read the last word again.', 'What is a survivor?'], 'Survivors are alive, so nobody buries them.'),
  r('logic', 'How many times can you subtract 5 from 25?', ['Once', 'one', '1'], ['Think about the number after you subtract.', 'After the first time, is it still 25?'], 'After one subtraction you are subtracting from 20.'),
  r('logic', 'You are given three pills and told to take one every half hour. How many minutes will they last?', ['60', '60 minutes', 'sixty', 'an hour', 'one hour', '1 hour', 'hour'], ['When do you take the first one?', 'You take one right away.'], 'You take them at 0, 30 and 60 minutes.'),
  r('logic', 'A mother has 7 sons and each son has one sister. How many children does she have?', ['8', 'eight'], ['How many sisters do they each have?', 'They all share the same one.'], 'Seven sons and one daughter they all share.'),
  r('logic', 'You walk into a dark room with one match. There is a candle, a stove and a gas lamp. What do you light first?', ['The match', 'match'], ['Think about what comes before all of these.', 'What do you need in order to light any of them?'], 'Nothing gets lit until the match is.'),
  r('logic', 'A red house is made of red bricks and a blue house of blue bricks. What is a greenhouse made of?', ['Glass'], ['What kind of greenhouse?', 'Think of a garden.'], 'Greenhouses are mostly glass.'),
  r('logic', 'How many animals of each kind did Moses take on the ark?', ['None', 'zero', '0', 'noah'], ['Check the story.', 'Who built the ark?'], 'It was Noah, not Moses.'),
  r('logic', 'Tom is taller than Sam. Sam is taller than Ben. Who is the shortest?', ['Ben'], ['Line them up.', 'Tom is at the tall end.'], 'From tallest to shortest: Tom, Sam, Ben.'),
  r('logic', 'Anna is older than Beth but younger than Cara. Who is the oldest?', ['Cara'], ['Put them in order.', 'Who is Anna younger than?'], 'From oldest to youngest: Cara, Anna, Beth.'),
  r('logic', 'Today is Wednesday. What day will it be in 10 days?', ['Saturday'], ['Seven days takes you to Wednesday again.', 'Now you just need 3 more.'], '7 days brings you to Wednesday, and 3 more is Saturday.'),
  r('logic', 'What letter comes next? J, F, M, A, M, J, ...', ['J'], ['Think of a calendar.', 'January, February...'], 'They are the first letters of the months, and July is next.'),
  r('logic', 'What letter comes next? O, T, T, F, F, S, S, ...', ['E'], ['Start counting.', 'One, Two, Three...'], 'They are the first letters of one to seven, so next is Eight.'),
  r('logic', 'What letter comes next? M, T, W, T, F, S, ...', ['S'], ['Think of a week.', 'Monday, Tuesday...'], 'They are days of the week, and next is Sunday.'),
  r('logic', 'A snail climbs 3 metres up a 10-metre wall each day and slips 2 metres each night. On which day does it reach the top?', ['8', 'eight', 'day 8', '8th'], ['It gains 1 metre per full day and night.', 'On the last day it climbs out without slipping.'], 'After 7 days it is at 7 metres, and on day 8 it climbs 3 more to the top.'),
  r('logic', 'Two fathers and two sons catch one fish each. Only three fish are caught. How many people were fishing?', ['3', 'three'], ['Someone can be both a father and a son.', 'Think of three generations.'], 'A grandfather, his son and his grandson make two fathers and two sons.'),
  r('logic', 'How much soil is in a hole that is one metre wide, long and deep?', ['None', 'zero', '0', 'no soil'], ['What is a hole?', 'What has been done with the soil?'], 'It is a hole, so it is empty.'),
  r('logic', 'A drawer holds lots of red socks and blue socks. In the dark, how many socks must you take to be sure of a matching pair?', ['3', 'three'], ['Imagine your unluckiest possible first two.', 'There are only two colours.'], 'Your first two might differ, but the third must match one of them.'),
];

function clean(text) {
  return text
    .toLowerCase()
    .replace(/[£'’]/g, '')
    .replace(/[^a-z0-9.\s-]/g, ' ')
    .replace(/\b(a|an|the|your|my)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function isCorrect(riddle, guess) {
  const tidy = ` ${clean(guess)} `;
  if (tidy.trim() === '') return false;
  return riddle.answers.some((answer) => tidy.includes(` ${clean(answer)} `));
}
