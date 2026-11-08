// Word and clue bank shared by the mini crossword and word scramble. WORD|clue
const raw = {
  Animals: `PANDA|Bamboo-munching bear from China
OTTER|River mammal that floats on its back
ZEBRA|Striped African grazer
KOALA|Eucalyptus eater from Australia
HEDGEHOG|Prickly garden visitor
RABBIT|Long-eared burrower
MOUSE|Tiny rodent with a long tail
HORSE|Animal ridden by a jockey
TIGER|Largest of the big cats
LION|King of the jungle
BEAR|Honey-loving forest animal
WOLF|Howling relative of the dog
FOX|Bushy-tailed, sly one
OWL|Night bird that hoots
DUCK|Quacking pond bird
GOOSE|Honking farmyard bird
SWAN|Graceful white water bird
ROBIN|Red-breasted garden bird
EAGLE|Bird of prey on many national emblems
PARROT|Colourful bird that can mimic speech
PENGUIN|Flightless bird in a natural tuxedo
SPARROW|Small brown city bird
CAMEL|Desert animal with a hump
LLAMA|Woolly pack animal of the Andes
MONKEY|Tree-swinging primate
GORILLA|Largest of the great apes
WHALE|Enormous ocean mammal
DOLPHIN|Clever, clicking sea mammal
SHARK|Fish with a famous fin
SALMON|Fish that swims upstream to spawn
CRAB|Sideways-walking shore creature
SNAIL|Slow garden creature with a shell
SPIDER|Web spinner
MOTH|Night-flying insect drawn to light
BEETLE|Hard-shelled insect
FROG|Pond jumper that croaks
TOAD|Warty, hopping amphibian
LIZARD|Scaly, basking reptile
TURTLE|Sea reptile with a shell
SHEEP|Woolly farm animal
GOAT|Bearded, nimble climber
KITTEN|Young cat
PUPPY|Young dog
BADGER|Black-and-white striped burrower
SQUIRREL|Acorn-hoarding tree climber`,
  Food: `APPLE|Fruit that fell near Newton
BANANA|Curved yellow fruit
CHERRY|Small red stone fruit
LEMON|Sour yellow citrus
MANGO|Sweet tropical fruit with a big stone
PEACH|Fuzzy summer fruit
PEAR|Bell-shaped fruit
PLUM|Purple fruit that dries into a prune
GRAPE|Fruit crushed for wine
MELON|Large, juicy fruit with a thick rind
ORANGE|Citrus fruit and a colour
COCONUT|Hairy tropical fruit
CARROT|Orange root vegetable
ONION|Bulb that makes you cry
POTATO|Chips start as one
TOMATO|Red fruit in ketchup
GARLIC|Pungent clove said to repel vampires
PEPPER|Salt's partner on the table
CELERY|Crunchy green stalks
SPINACH|Leafy green loved by a cartoon sailor
PUMPKIN|Halloween lantern vegetable
BREAD|Loaf from the baker
BUTTER|Yellow spread made from cream
CHEESE|Cheddar or Brie
CREAM|Thick top of the milk
HONEY|Sweet stuff from bees
SUGAR|Sweetener in a bowl
FLOUR|Ground grain for baking
PASTA|Italian staple such as penne
PIZZA|Round Italian dish with toppings
NOODLE|Long strand in ramen
CURRY|Spicy dish from South Asia
SALAD|Bowl of dressed leaves
SOUP|Hot food eaten with a spoon
TOAST|Browned slice at breakfast
WAFFLE|Griddled treat with deep pockets
COOKIE|Biscuit, in America
MUFFIN|Small domed cake
TRIFLE|Layered pudding with sponge and fruit
CUSTARD|Yellow sauce poured over pudding
COFFEE|Morning drink from roasted beans
TEA|Drink brewed from leaves
JAM|Fruit spread for scones
EGG|Breakfast food, boiled or poached
OLIVE|Small fruit pressed for oil
RICE|Grain in sushi and risotto`,
  'Nature and weather': `RIVER|Flowing body of water
OCEAN|Vast stretch of salt water
LAKE|Still body of water
ISLAND|Land surrounded by water
BEACH|Sandy shore
FOREST|Large area of trees
MEADOW|Grassy field of wildflowers
MOUNTAIN|Very tall peak
VALLEY|Low land between hills
CANYON|Deep rocky gorge
DESERT|Very dry, sandy land
CAVE|Hollow in a hillside
VOLCANO|Mountain that can erupt
GLACIER|Slow-moving river of ice
CLOUD|Fluffy shape in the sky
RAIN|Drops from the sky
SNOW|White winter flakes
STORM|Thunder and lightning event
THUNDER|Rumble after lightning
FROST|Icy coating on a cold morning
BREEZE|Light wind
RAINBOW|Colourful arc after a shower
SUNSET|Evening glow in the west
MOON|Earth's natural satellite
STAR|Twinkler in the night sky
TREE|Oak or elm
LEAF|It falls in autumn
ROSE|Thorny flower, often red
DAISY|White-petalled lawn flower
TULIP|Spring bulb linked with Holland
LILY|Elegant flower with a strong scent
IVY|Climbing evergreen
MOSS|Soft green carpet on a damp rock
FERN|Feathery green shade plant
WILLOW|Tree that weeps
PEBBLE|Small smooth stone
SAND|Stuff of castles at the seaside
TIDE|Sea's regular rise and fall
WAVE|Surfer's ride
SPRING|Season after winter
SUMMER|Warmest season
AUTUMN|Season of falling leaves
WINTER|Coldest season`,
  'Around the house': `TABLE|You eat at it
CHAIR|Seat with a back
SOFA|Comfy seat for the living room
BED|Where you sleep
PILLOW|Head rest at night
BLANKET|Warm bed cover
LAMP|Bedside light
MIRROR|Reflecting glass
WINDOW|Glass in a wall
DOOR|Way in or out of a room
STAIRS|Steps between floors
KITCHEN|Room with a cooker
GARDEN|Outdoor space with flowers
ATTIC|Room under the roof
CELLAR|Underground storage room
OVEN|Baking appliance
FRIDGE|Cold food store
KETTLE|Water boiler for a cuppa
TEAPOT|Spouted brewing vessel
SPOON|Soup utensil
FORK|Pronged utensil
KNIFE|Cutting utensil
PLATE|Dinner disc
BOWL|Cereal holder
CUP|Small drinking vessel with a handle
TOWEL|Drying cloth for the bathroom
SOAP|Bar for washing
CANDLE|Wax light with a wick
CLOCK|Time teller on the wall
KEY|Lock opener
BROOM|Sweeper, or a witch's ride
BUCKET|Pail
CURTAIN|Window drape
CARPET|Floor covering
PAINT|Decorator's colourful liquid
HAMMER|Nail hitter
SCISSORS|Paper cutter
NEEDLE|Sewing tool with an eye
THREAD|Strand for sewing
BUTTON|Shirt fastener
BASKET|Woven carrier for a picnic
UMBRELLA|Rainy-day shelter
SLIPPERS|Soft shoes for the house
SOCK|Foot warmer that goes missing in the wash
SCARF|Neck warmer
GLOVE|Hand warmer
HAT|Head covering
COAT|Outdoor layer`,
  Travel: `TRAIN|Railway transport
PLANE|Transport with wings
SHIP|Large ocean vessel
FERRY|Boat shuttling passengers across water
CANOE|Narrow paddled boat
BICYCLE|Two-wheeler with pedals
TAXI|Hired car with a meter
BUS|Double-decker, perhaps
TRAM|Street-level rail vehicle
SUBWAY|New York's underground
ROAD|Way for cars
BRIDGE|River crosser
TUNNEL|Underground passage
AIRPORT|Terminal for flights
STATION|Stop for trains
HARBOUR|Shelter for ships
HOTEL|Place to stay on holiday
TENT|Camper's shelter
SUITCASE|Holiday luggage
PASSPORT|Document for crossing borders
TICKET|Proof of fare
MAP|Folded guide for getting around
COMPASS|Needle pointing north
POSTCARD|Holiday greeting with a picture
SOUVENIR|Memento from a trip
PARIS|City of the Eiffel Tower
ROME|City of the Colosseum
TOKYO|Japan's capital
LONDON|Home of Big Ben
CAIRO|Egyptian city near the Pyramids
DUBLIN|Capital of Ireland
VENICE|Italian city of canals
SYDNEY|Australian city with a famous Opera House
MADRID|Capital of Spain
OSLO|Capital of Norway
LIMA|Capital of Peru
INDIA|Home of the Taj Mahal
EGYPT|Land of the Nile
PERU|Home of Machu Picchu
ITALY|Boot-shaped country
SPAIN|Home of flamenco
GREECE|Birthplace of the Olympics
CHINA|Home of the Great Wall
JAPAN|Land of the Rising Sun
KENYA|Safari destination, capital Nairobi`,
  'Music and arts': `PIANO|Instrument with 88 keys
GUITAR|Six-stringed instrument
VIOLIN|Small bowed instrument
CELLO|Large bowed instrument played seated
FLUTE|Silver woodwind held sideways
TRUMPET|Brass instrument with three valves
DRUMS|Instrument played with sticks
HARP|Large plucked instrument with many strings
OBOE|Double-reed woodwind
TUBA|Largest brass instrument
CHOIR|Group of singers
OPERA|Sung drama
BALLET|Dance on pointe
SONG|Tune with words
MELODY|A tune
RHYTHM|Musical beat
WALTZ|Dance in three-four time
TANGO|Dance from Buenos Aires
SALSA|Latin dance, or a dip
NOVEL|Long work of fiction
POEM|Piece of verse
STORY|Bedtime tale
AUTHOR|Book writer
POET|Keats or Wordsworth
BOOK|Library item
ACTOR|Stage performer
STAGE|Theatre platform
THEATRE|Building for plays
CINEMA|Place to see a film
MOVIE|Film, in America
CAMERA|Picture taker
ARTIST|Monet or Matisse
CANVAS|Painter's surface
EASEL|Painter's stand
BRUSH|Painter's tool
SKETCH|Quick drawing
PENCIL|Drawing tool with a rubber
CRAYON|Child's wax colouring stick
STATUE|Carved figure in a square
MUSEUM|Building of exhibits
GALLERY|Art display space
SCULPTOR|Rodin, for example
PUPPET|Figure on strings
MAGIC|Conjuror's art
CIRCUS|Big-top show`,
  'Science and the body': `ATOM|Tiny building block of matter
CELL|Basic unit of life
GENE|Unit of heredity
OXYGEN|Gas we need to breathe
CARBON|Element in diamonds
IRON|Metal that rusts
COPPER|Reddish metal in wires
SILVER|Precious metal for second place
GOLD|Precious metal for first place
NEON|Gas in glowing signs
PLANET|Mars or Venus
COMET|Icy visitor with a tail
GALAXY|The Milky Way, for one
ROCKET|Space launcher
ORBIT|Path around a planet
EARTH|Our planet
MARS|The Red Planet
VENUS|Second planet from the Sun
SATURN|Ringed planet
MAGNET|Attractor of iron
PRISM|Glass that splits light
LENS|Curved glass in spectacles
ROBOT|Mechanical helper
LASER|Intense beam of light
ENERGY|Power to do work
GRAVITY|Force that pulls you down
FOSSIL|Preserved ancient remains
DINOSAUR|Extinct giant reptile
MICROBE|Tiny living organism
VIRUS|Cause of a cold
HEART|Blood pump
BRAIN|Organ you are exercising now
LUNGS|Breathing organs
BONE|Skeleton part
MUSCLE|Tissue that contracts
NERVE|Body's signal carrier
TOOTH|Dentist's concern
THUMB|Short digit on the hand
ELBOW|Arm joint
KNEE|Leg joint
ANKLE|Joint above the foot
SHOULDER|Joint at the top of the arm
ALGEBRA|Maths with letters
NUMBER|Seven or twenty
CIRCLE|Round shape
SQUARE|Four-sided shape
TRIANGLE|Three-sided shape`,
  'Sport and games': `TENNIS|Game played at Wimbledon
GOLF|Game with eighteen holes
RUGBY|Game with an oval ball
CRICKET|Game with bats, wickets and tea
HOCKEY|Game with sticks and a puck
SOCCER|Football, in America
BOXING|Sport in a ring
ROWING|Sport with oars
SKIING|Winter sport on slopes
YOGA|Stretching practice from India
PILATES|Core exercise method
SURFING|Riding waves
SAILING|Sport with wind and boats
CYCLING|Sport of the Tour de France
ARCHERY|Sport with bows and arrows
FENCING|Sport with foils
CHESS|Board game with kings and queens
DARTS|Pub game with a board
BINGO|Numbers game, eyes down
PUZZLE|Brain teaser
JIGSAW|Picture in interlocking pieces
MARBLES|Small glass balls to play with
KITE|Flying toy on a string
DICE|Pair of cubes with spots
CARDS|Deck for playing snap
LADDER|Partner to snakes on a board
TROPHY|Prize cup
MEDAL|Gold, silver or bronze prize
GOAL|Score in football
RACKET|Tennis bat
NET|Mesh across a tennis court
PITCH|Football field
REFEREE|Match official
CAPTAIN|Team leader
COACH|Team trainer
OLYMPICS|Games every four years
MARATHON|Race of 26 miles
SPRINT|Short, fast race`,
  'Family and everyday': `HAPPY|Full of joy
CALM|Peaceful and still
BRAVE|Full of courage
CLEVER|Smart
KIND|Caring and thoughtful
GENTLE|Soft and tender
FRIEND|Pal
FAMILY|Relatives
SISTER|Female sibling
BROTHER|Male sibling
MOTHER|Mum
FATHER|Dad
COUSIN|Child of your aunt
UNCLE|Husband of your aunt
AUNT|Sister of your parent
NIECE|Daughter of your brother
NEPHEW|Son of your sister
WIFE|Married woman
LOVE|Deep affection
HUG|Warm embrace
KISS|Peck on the cheek
SMILE|Happy expression
LAUGH|Response to a joke
DREAM|Story during sleep
SLEEP|Night's rest
NAP|Short rest in the afternoon
WISH|Birthday candle hope
GIFT|Present
PARTY|Celebration with balloons
BIRTHDAY|Annual candle day
WEDDING|Marriage ceremony
HOLIDAY|Time off
MONDAY|Start of the working week
FRIDAY|Last working day
SUNDAY|Day before the working week
MARCH|Third month
APRIL|Month of showers
JUNE|Sixth month
JULY|Seventh month
AUGUST|Eighth month
COLOUR|Red or blue, say
PURPLE|Mix of red and blue
YELLOW|Colour of a canary
GREEN|Colour of grass
SCARLET|Bright red`,
};

export const themes = Object.entries(raw).map(([name, text]) => ({
  name,
  words: text.split('\n').map((line) => {
    const [word, clue] = line.split('|');
    return { word, clue, theme: name };
  }),
}));

export const allWords = themes.flatMap((theme) => theme.words);
