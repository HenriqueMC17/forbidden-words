export interface WordCard {
  word: string;
  translation: string;
  forbidden: string[];
  forbiddenTranslations: string[];
}

export const WORDS: WordCard[] = [
  { word: "ASTRONAUT", translation: "Astronauta", forbidden: ["SPACE", "MOON", "SHIP", "NASA", "FLY"], forbiddenTranslations: ["Espaço", "Lua", "Nave", "NASA", "Voar"] },
  { word: "BICYCLE", translation: "Bicicleta", forbidden: ["WHEEL", "RIDE", "PEDAL", "CHAIN", "GEAR"], forbiddenTranslations: ["Roda", "Andar", "Pedal", "Corrente", "Engrenagem"] },
  { word: "LIBRARY", translation: "Biblioteca", forbidden: ["BOOK", "READ", "SILENCE", "BORROW", "STUDY"], forbiddenTranslations: ["Livro", "Ler", "Silêncio", "Empréstimo", "Estudar"] },
  { word: "DOCTOR", translation: "Médico", forbidden: ["HOSPITAL", "SICK", "MEDICINE", "NURSE", "HEALTH"], forbiddenTranslations: ["Hospital", "Doente", "Remédio", "Enfermeira", "Saúde"] },
  { word: "GUITAR", translation: "Violão/Guitarra", forbidden: ["MUSIC", "PLAY", "STRING", "INSTRUMENT", "BAND"], forbiddenTranslations: ["Música", "Tocar", "Corda", "Instrumento", "Banda"] },
  { word: "INTERNET", translation: "Internet", forbidden: ["WEB", "ONLINE", "COMPUTER", "NETWORK", "WIFI"], forbiddenTranslations: ["Web", "Online", "Computador", "Rede", "Wi-Fi"] },
  { word: "FIREFIGHTER", translation: "Bombeiro", forbidden: ["WATER", "TRUCK", "HOSE", "SMOKE", "RESCUE"], forbiddenTranslations: ["Água", "Caminhão", "Mangueira", "Fumaça", "Resgate"] },
  { word: "CHOCOLATE", translation: "Chocolate", forbidden: ["SWEET", "DARK", "MILK", "CANDY", "BAR"], forbiddenTranslations: ["Doce", "Amargo/Preto", "Leite", "Bala", "Barra"] },
  { word: "MOVIE", translation: "Filme", forbidden: ["FILM", "CINEMA", "WATCH", "POPCORN", "ACTOR"], forbiddenTranslations: ["Filme", "Cinema", "Assistir", "Pipoca", "Ator"] },
  { word: "TREE", translation: "Árvore", forbidden: ["GREEN", "LEAF", "FOREST", "WOOD", "BRANCH"], forbiddenTranslations: ["Verde", "Folha", "Floresta", "Madeira", "Galho"] },
  { word: "AIRPLANE", translation: "Avião", forbidden: ["FLY", "SKY", "PILOT", "WING", "AIRPORT"], forbiddenTranslations: ["Voar", "Céu", "Piloto", "Asa", "Aeroporto"] },
  { word: "PHONE", translation: "Telefone", forbidden: ["CALL", "MOBILE", "SCREEN", "TALK", "APP"], forbiddenTranslations: ["Ligar", "Celular", "Tela", "Falar", "Aplicativo"] },
  { word: "RESTAURANT", translation: "Restaurante", forbidden: ["FOOD", "EAT", "CHEF", "MENU", "WAITER"], forbiddenTranslations: ["Comida", "Comer", "Chef", "Menu", "Garçom"] },
  { word: "SUNGLASSES", translation: "Óculos de Sol", forbidden: ["SUN", "EYES", "GLASS", "WEAR", "SUMMER"], forbiddenTranslations: ["Sol", "Olhos", "Vidro/Óculos", "Usar", "Verão"] },
  { word: "TEACHER", translation: "Professor", forbidden: ["SCHOOL", "CLASS", "STUDENT", "LEARN", "LESSON"], forbiddenTranslations: ["Escola", "Classe/Aula", "Estudante", "Aprender", "Lição"] },
  { word: "RAIN", translation: "Chuva", forbidden: ["WATER", "WET", "CLOUD", "SKY", "UMBRELLA"], forbiddenTranslations: ["Água", "Molhado", "Nuvem", "Céu", "Guarda-chuva"] },
  { word: "CAMERA", translation: "Câmera", forbidden: ["PHOTO", "PICTURE", "TAKE", "LENS", "SHOOT"], forbiddenTranslations: ["Foto", "Imagem", "Tirar", "Lente", "Fotografar"] },
  { word: "COFFEE", translation: "Café", forbidden: ["DRINK", "MUG", "CAFFEINE", "HOT", "MORNING"], forbiddenTranslations: ["Bebida", "Caneca", "Cafeína", "Quente", "Manhã"] },
  { word: "SHOE", translation: "Sapato", forbidden: ["FOOT", "WEAR", "WALK", "RUN", "SOCK"], forbiddenTranslations: ["Pé", "Usar", "Andar", "Correr", "Meia"] },
  { word: "KEY", translation: "Chave", forbidden: ["LOCK", "DOOR", "OPEN", "CAR", "METAL"], forbiddenTranslations: ["Fechadura", "Porta", "Abrir", "Carro", "Metal"] },
  { word: "SANDWICH", translation: "Sanduíche", forbidden: ["BREAD", "LUNCH", "EAT", "CHEESE", "HAM"], forbiddenTranslations: ["Pão", "Almoço", "Comer", "Queijo", "Presunto"] },
  { word: "DOG", translation: "Cachorro", forbidden: ["PET", "BARK", "ANIMAL", "CAT", "FRIEND"], forbiddenTranslations: ["Estimação", "Latir", "Animal", "Gato", "Amigo"] },
  { word: "CAT", translation: "Gato", forbidden: ["PET", "MEOW", "ANIMAL", "DOG", "FUR"], forbiddenTranslations: ["Estimação", "Miar", "Animal", "Cachorro", "Pelo"] },
  { word: "OCEAN", translation: "Oceano", forbidden: ["WATER", "SEA", "BLUE", "FISH", "BEACH"], forbiddenTranslations: ["Água", "Mar", "Azul", "Peixe", "Praia"] },
  { word: "CLOCK", translation: "Relógio", forbidden: ["TIME", "HOUR", "MINUTE", "WATCH", "TICK"], forbiddenTranslations: ["Tempo", "Hora", "Minuto", "Relógio de Pulso", "Tique-taque"] },
  { word: "MONEY", translation: "Dinheiro", forbidden: ["CASH", "DOLLAR", "BUY", "PAY", "BANK"], forbiddenTranslations: ["Dinheiro vivo", "Dólar", "Comprar", "Pagar", "Banco"] },
  { word: "BOOK", translation: "Livro", forbidden: ["READ", "PAGE", "LIBRARY", "PAPER", "STORY"], forbiddenTranslations: ["Ler", "Página", "Biblioteca", "Papel", "História"] },
  { word: "SOCCER", translation: "Futebol", forbidden: ["BALL", "FOOT", "PLAY", "GOAL", "GAME"], forbiddenTranslations: ["Bola", "Pé", "Jogar", "Gol", "Jogo"] },
  { word: "PIZZA", translation: "Pizza", forbidden: ["CHEESE", "TOMATO", "ITALY", "EAT", "SLICE"], forbiddenTranslations: ["Queijo", "Tomate", "Itália", "Comer", "Fatia"] },
  { word: "DESK", translation: "Escrivaninha", forbidden: ["TABLE", "CHAIR", "OFFICE", "WORK", "WRITE"], forbiddenTranslations: ["Mesa", "Cadeira", "Escritório", "Trabalho", "Escrever"] },
  { word: "TELESCOPE", translation: "Telescópio", forbidden: ["SPACE", "STARS", "SKY", "LOOK", "SEE"], forbiddenTranslations: ["Espaço", "Estrelas", "Céu", "Olhar", "Ver"] },
  { word: "PENCIL", translation: "Lápis", forbidden: ["WRITE", "DRAW", "PAPER", "ERASER", "WOOD"], forbiddenTranslations: ["Escrever", "Desenhar", "Papel", "Borracha", "Madeira"] },
  { word: "HELICOPTER", translation: "Helicóptero", forbidden: ["FLY", "SKY", "ROTOR", "BLADE", "PILOT"], forbiddenTranslations: ["Voar", "Céu", "Rotor", "Hélice", "Piloto"] },
  { word: "MICROSCOPE", translation: "Microscópio", forbidden: ["SCIENCE", "CELL", "LAB", "LOOK", "SMALL"], forbiddenTranslations: ["Ciência", "Célula", "Laboratório", "Olhar", "Pequeno"] },
  { word: "TRAIN", translation: "Trem", forbidden: ["TRACK", "STATION", "RAIL", "ENGINE", "TRAVEL"], forbiddenTranslations: ["Trilho", "Estação", "Trilhos", "Locomotiva", "Viajar"] },
  { word: "KEYBOARD", translation: "Teclado", forbidden: ["TYPE", "COMPUTER", "KEYS", "BOARD", "WRITE"], forbiddenTranslations: ["Digitar", "Computador", "Teclas", "Placa/Teclado", "Escrever"] }
];