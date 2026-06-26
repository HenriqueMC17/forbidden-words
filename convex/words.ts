export interface WordCard {
  word: string;
  forbidden: string[];
}

export const WORDS: WordCard[] = [
  { word: "ASTRONAUT", forbidden: ["SPACE", "MOON", "SHIP", "NASA", "FLY"] },
  { word: "BICYCLE", forbidden: ["WHEEL", "RIDE", "PEDAL", "CHAIN", "GEAR"] },
  { word: "LIBRARY", forbidden: ["BOOK", "READ", "SILENCE", "BORROW", "STUDY"] },
  { word: "DOCTOR", forbidden: ["HOSPITAL", "SICK", "MEDICINE", "NURSE", "HEALTH"] },
  { word: "GUITAR", forbidden: ["MUSIC", "PLAY", "STRING", "INSTRUMENT", "BAND"] },
  { word: "INTERNET", forbidden: ["WEB", "ONLINE", "COMPUTER", "NETWORK", "WIFI"] },
  { word: "FIREFIGHTER", forbidden: ["WATER", "TRUCK", "HOSE", "SMOKE", "RESCUE"] },
  { word: "CHOCOLATE", forbidden: ["SWEET", "DARK", "MILK", "CANDY", "BAR"] },
  { word: "MOVIE", forbidden: ["FILM", "CINEMA", "WATCH", "POPCORN", "ACTOR"] },
  { word: "TREE", forbidden: ["GREEN", "LEAF", "FOREST", "WOOD", "BRANCH"] },
  { word: "AIRPLANE", forbidden: ["FLY", "SKY", "PILOT", "WING", "AIRPORT"] },
  { word: "PHONE", forbidden: ["CALL", "MOBILE", "SCREEN", "TALK", "APP"] },
  { word: "RESTAURANT", forbidden: ["FOOD", "EAT", "CHEF", "MENU", "WAITER"] },
  { word: "SUNGLASSES", forbidden: ["SUN", "EYES", "GLASS", "WEAR", "SUMMER"] },
  { word: "TEACHER", forbidden: ["SCHOOL", "CLASS", "STUDENT", "LEARN", "LESSON"] },
  { word: "RAIN", forbidden: ["WATER", "WET", "CLOUD", "SKY", "UMBRELLA"] },
  { word: "CAMERA", forbidden: ["PHOTO", "PICTURE", "TAKE", "LENS", "SHOOT"] },
  { word: "COFFEE", forbidden: ["DRINK", "MUG", "CAFFEINE", "HOT", "MORNING"] },
  { word: "SHOE", forbidden: ["FOOT", "WEAR", "WALK", "RUN", "SOCK"] },
  { word: "KEY", forbidden: ["LOCK", "DOOR", "OPEN", "CAR", "METAL"] },
  { word: "SANDWICH", forbidden: ["BREAD", "LUNCH", "EAT", "CHEESE", "HAM"] },
  { word: "DOG", forbidden: ["PET", "BARK", "ANIMAL", "CAT", "FRIEND"] },
  { word: "CAT", forbidden: ["PET", "MEOW", "ANIMAL", "DOG", "FUR"] },
  { word: "OCEAN", forbidden: ["WATER", "SEA", "BLUE", "FISH", "BEACH"] },
  { word: "CLOCK", forbidden: ["TIME", "HOUR", "MINUTE", "WATCH", "TICK"] },
  { word: "MONEY", forbidden: ["CASH", "DOLLAR", "BUY", "PAY", "BANK"] },
  { word: "BOOK", forbidden: ["READ", "PAGE", "LIBRARY", "PAPER", "STORY"] },
  { word: "SOCCER", forbidden: ["BALL", "FOOT", "PLAY", "GOAL", "GAME"] },
  { word: "PIZZA", forbidden: ["CHEESE", "TOMATO", "ITALY", "EAT", "SLICE"] },
  { word: "DESK", forbidden: ["TABLE", "CHAIR", "OFFICE", "WORK", "WRITE"] }
];
