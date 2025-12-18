export interface Question {
  id?: string; // ID pytania (opcjonalne dla lokalnych pytań)
  question: string;
  answers: string[];
  correctAnswer: number | number[]; // liczba dla pojedynczego wyboru, tablica dla wielokrotnego
  type: 'single' | 'multiple';
  category: string;
  explanation: string;
}

import { projectId, publicAnonKey } from '../utils/supabase/info';

// Klucz do przechowywania historii pytań w localStorage
const QUESTION_HISTORY_KEY = 'quiz_question_history';
const MAX_HISTORY_SIZE = 40; // Przechowuj ostatnie 40 pytań

// Funkcja do pobierania historii pytań z localStorage
function getQuestionHistory(): string[] {
  try {
    const history = localStorage.getItem(QUESTION_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error reading question history:', error);
    return [];
  }
}

// Funkcja do zapisywania pytań do historii
export function saveQuestionHistory(questionIds: string[]): void {
  try {
    const currentHistory = getQuestionHistory();
    
    // Dodaj nowe pytania na początek historii
    const updatedHistory = [...questionIds, ...currentHistory];
    
    // Usuń duplikaty i ogranicz do MAX_HISTORY_SIZE
    const uniqueHistory = Array.from(new Set(updatedHistory)).slice(0, MAX_HISTORY_SIZE);
    
    localStorage.setItem(QUESTION_HISTORY_KEY, JSON.stringify(uniqueHistory));
    console.log(`Saved ${questionIds.length} questions to history. Total in history: ${uniqueHistory.length}`);
  } catch (error) {
    console.error('Error saving question history:', error);
  }
}

export const allQuestions: Question[] = [
  // Pytania pojedynczego wyboru
  {
    question: 'W którym roku została założona uczelnia UWSB Merito?',
    answers: ['1998', '2001', '2005', '1995'],
    correctAnswer: 0,
    type: 'single',
    category: 'Historia',
    explanation: 'UWSB Merito (dawniej Wyższa Szkoła Bankowa w Gdańsku) została założona w 1998 roku.'
  },
  {
    question: 'Jak nazywa się poprzednia nazwa uczelni przed rebrandingiem na Merito?',
    answers: ['Akademia Gdańska', 'Wyższa Szkoła Bankowa', 'Uczelnia Trójmiejska', 'Szkoła Biznesu w Gdańsku'],
    correctAnswer: 1,
    type: 'single',
    category: 'Historia',
    explanation: 'Uczelnia była znana jako Wyższa Szkoła Bankowa (WSB) przed zmianą nazwy na UWSB Merito.'
  },
  {
    question: 'Który z poniższych kierunków studiów oferuje UWSB Merito w Gdańsku?',
    answers: ['Medycyna', 'Zarządzanie', 'Weterynaria', 'Archeologia'],
    correctAnswer: 1,
    type: 'single',
    category: 'Oferta edukacyjna',
    explanation: 'Zarządzanie to jeden z kluczowych kierunków oferowanych przez UWSB Merito, obok informatyki, finansów i innych kierunków ekonomicznych.'
  },
  {
    question: 'Który obszar nauki jest szczególnie rozwijany w UWSB Merito Gdańsk?',
    answers: ['Nauki przyrodnicze', 'Ekonomia i biznes', 'Medycyna', 'Sztuki piękne'],
    correctAnswer: 1,
    type: 'single',
    category: 'Specjalizacje',
    explanation: 'UWSB Merito koncentruje się na naukach ekonomicznych, zarządzaniu, finansach i informatyce.'
  },
  {
    question: 'Jaki poziom studiów oferuje UWSB Merito?',
    answers: ['Tylko licencjackie', 'Licencjackie i magisterskie', 'Tylko magisterskie', 'Tylko podyplomowe'],
    correctAnswer: 1,
    type: 'single',
    category: 'Oferta edukacyjna',
    explanation: 'UWSB Merito oferuje studia I stopnia (licencjackie) oraz II stopnia (magisterskie) na różnych kierunkach.'
  },
  {
    question: 'Który kierunek związany z technologią oferuje UWSB Merito?',
    answers: ['Robotyka', 'Informatyka', 'Inżynieria kosmiczna', 'Biotechnologia'],
    correctAnswer: 1,
    type: 'single',
    category: 'Oferta edukacyjna',
    explanation: 'Informatyka to jeden z popularnych kierunków w UWSB Merito, przygotowujący studentów do pracy w branży IT.'
  },
  {
    question: 'Jaki jest główny profil absolwenta UWSB Merito?',
    answers: ['Tylko teoretyk bez praktycznych umiejętności', 'Praktyk gotowy do pracy w biznesie', 'Naukowiec akademicki', 'Urzędnik państwowy'],
    correctAnswer: 1,
    type: 'single',
    category: 'Misja',
    explanation: 'UWSB Merito kształci praktyków biznesu - osoby gotowe do podjęcia pracy i skutecznego działania w środowisku zawodowym.'
  },
  {
    question: 'Jaki jest charakter zajęć w UWSB Merito?',
    answers: ['Tylko teoretyczne wykłady', 'Połączenie teorii z praktyką i case study', 'Tylko samodzielna nauka', 'Tylko egzaminy testowe'],
    correctAnswer: 1,
    type: 'single',
    category: 'Dydaktyka',
    explanation: 'Zajęcia w UWSB Merito łączą teorię z praktyką, wykorzystując case study, projekty biznesowe i warsztaty z ekspertami.'
  },
  {
    question: 'W którym roku UWSB otrzymała akredytację Ministerstwa?',
    answers: ['2000', '2003', '1999', '2005'],
    correctAnswer: 2,
    type: 'single',
    category: 'Historia',
    explanation: 'Uczelnia otrzymała akredytację wkrótce po swojej inauguracji, co potwierdziło wysoką jakość kształcenia.'
  },
  {
    question: 'Ile kampusów w Polsce posiada sieć UWSB Merito?',
    answers: ['3', '5', '7', '10'],
    correctAnswer: 2,
    type: 'single',
    category: 'Lokalizacje',
    explanation: 'UWSB Merito ma kampusy w siedmiu największych miastach Polski, zapewniając dostęp do edukacji w całym kraju.'
  },
  {
    question: 'Jakie języki obce można studiować w UWSB Merito?',
    answers: ['Tylko angielski', 'Angielski i niemiecki', 'Angielski, niemiecki i hiszpański', 'Wszystkie języki europejskie'],
    correctAnswer: 2,
    type: 'single',
    category: 'Oferta edukacyjna',
    explanation: 'Uczelnia oferuje naukę kilku języków obcych, koncentrując się na językach biznesowych.'
  },
  {
    question: 'Ile wynosi średnia liczba studentów w grupach ćwiczeniowych?',
    answers: ['50-60', '30-40', '15-25', '5-10'],
    correctAnswer: 2,
    type: 'single',
    category: 'Dydaktyka',
    explanation: 'Małe grupy ćwiczeniowe pozwalają na indywidualne podejście do każdego studenta.'
  },
  {
    question: 'Czy UWSB Merito posiada własną platformę e-learningową?',
    answers: ['Nie posiada', 'Tak, nowoczesną platformę', 'Tylko dla wybranych kierunków', 'Tylko dla studiów podyplomowych'],
    correctAnswer: 1,
    type: 'single',
    category: 'Technologia',
    explanation: 'Uczelnia inwestuje w nowoczesne technologie edukacyjne, w tym platformę e-learningową.'
  },
  {
    question: 'Jaki procent wykładowców to praktycy biznesu?',
    answers: ['10%', '30%', '50%', '70%'],
    correctAnswer: 3,
    type: 'single',
    category: 'Kadra',
    explanation: 'UWSB Merito zatrudnia wielu ekspertów-praktyków, co zapewnia praktyczny wymiar edukacji.'
  },
  {
    question: 'Czy absolwenci UWSB Merito mogą kontynuować studia doktoranckie?',
    answers: ['Nie mogą', 'Tak, w Polsce i za granicą', 'Tylko w Polsce', 'Tylko za granicą'],
    correctAnswer: 1,
    type: 'single',
    category: 'Rozwój kariery',
    explanation: 'Absolwenci mogą kontynuować edukację na studiach doktoranckich w kraju i za granicą.'
  },
  {
    question: 'Jakie wydarzenia organizuje UWSB Merito dla studentów?',
    answers: ['Tylko wykłady', 'Konferencje i warsztaty', 'Tylko egzaminy', 'Nie organizuje wydarzeń'],
    correctAnswer: 1,
    type: 'single',
    category: 'Życie studenckie',
    explanation: 'Uczelnia regularnie organizuje konferencje, warsztaty, spotkania z ekspertami i wydarzenia networkingowe.'
  },
  {
    question: 'Czy UWSB Merito współpracuje z lokalnymi przedsiębiorstwami?',
    answers: ['Nie współpracuje', 'Tak, z setkami firm', 'Tylko z jedną firmą', 'Tylko z firmami zagranicznymi'],
    correctAnswer: 1,
    type: 'single',
    category: 'Biznes',
    explanation: 'Uczelnia ma rozbudowaną sieć partnerów biznesowych, co ułatwia studentom praktyki i staże.'
  },
  {
    question: 'Ile trwają studia licencjackie w UWSB Merito?',
    answers: ['2 lata', '3 lata', '4 lata', '5 lat'],
    correctAnswer: 1,
    type: 'single',
    category: 'Oferta edukacyjna',
    explanation: 'Studia pierwszego stopnia trwają standardowo 3 lata (6 semestrów).'
  },
  {
    question: 'Ile trwają studia magisterskie w UWSB Merito?',
    answers: ['1 rok', '1,5 roku', '2 lata', '3 lata'],
    correctAnswer: 2,
    type: 'single',
    category: 'Oferta edukacyjna',
    explanation: 'Studia drugiego stopnia trwają 2 lata (4 semestry).'
  },
  {
    question: 'Czy UWSB Merito oferuje studia dualne?',
    answers: ['Nie oferuje', 'Tak, w wybranych specjalnościach', 'Tylko dla zagranicznych studentów', 'Tylko wieczorowe'],
    correctAnswer: 1,
    type: 'single',
    category: 'Oferta edukacyjna',
    explanation: 'Studia dualne łączą naukę z pracą zawodową, zapewniając praktyczne doświadczenie.'
  },
  {
    question: 'Jaki jest maksymalny czas na ukończenie studiów?',
    answers: ['3 lata', '5 lat', '7 lat', '10 lat'],
    correctAnswer: 2,
    type: 'single',
    category: 'Regulamin',
    explanation: 'Studenci mają określony czas na ukończenie studiów, z możliwością przedłużenia w uzasadnionych przypadkach.'
  },
  {
    question: 'Czy UWSB Merito posiada akademik dla studentów?',
    answers: ['Nie posiada', 'Tak, współpracuje z akademikami', 'Tylko dla zagranicznych studentów', 'Tylko dla studentów stacjonarnych'],
    correctAnswer: 1,
    type: 'single',
    category: 'Infrastruktura',
    explanation: 'Uczelnia pomaga studentom w znalezieniu zakwaterowania, współpracując z akademikami i domami studenckimi.'
  },
  {
    question: 'Czy studenci UWSB Merito mają zniżki na komunikację miejską?',
    answers: ['Nie mają', 'Tak, ulgi studenckie', 'Tylko studenci stacjonarni', 'Tylko do 24 roku życia'],
    correctAnswer: 1,
    type: 'single',
    category: 'Wsparcie studentów',
    explanation: 'Studenci mogą korzystać z ulgowych biletów na komunikację miejską na podstawie legitymacji.'
  },
  {
    question: 'Jaką bibliografię naukową oferuje biblioteka UWSB Merito?',
    answers: ['Tylko podstawowe podręczniki', 'Szeroką gamę publikacji naukowych', 'Tylko e-booki', 'Nie posiada biblioteki'],
    correctAnswer: 1,
    type: 'single',
    category: 'Infrastruktura',
    explanation: 'Biblioteka uczelni oferuje dostęp do tysięcy pozycji książkowych i czasopism naukowych.'
  },
  {
    question: 'Czy UWSB Merito organizuje wyjazdy studyjne?',
    answers: ['Nie organizuje', 'Tak, krajowe i zagraniczne', 'Tylko krajowe', 'Tylko dla wybranych kierunków'],
    correctAnswer: 1,
    type: 'single',
    category: 'Życie studenckie',
    explanation: 'Uczelnia regularnie organizuje wyjazdy edukacyjne do firm, instytucji i na wydarzenia branżowe.'
  },
  {
    question: 'Jaki średni wiek ma kadra wykładowców UWSB Merito?',
    answers: ['25-30 lat', '35-45 lat', '50-60 lat', '70+ lat'],
    correctAnswer: 1,
    type: 'single',
    category: 'Kadra',
    explanation: 'Uczelnia zatrudnia doświadczonych wykładowców w sile wieku, będących aktywnych zawodowo.'
  },
  {
    question: 'Czy UWSB Merito oferuje kursy przygotowawcze do certyfikatów?',
    answers: ['Nie oferuje', 'Tak, różne certyfikaty branżowe', 'Tylko językowe', 'Tylko IT'],
    correctAnswer: 1,
    type: 'single',
    category: 'Oferta edukacyjna',
    explanation: 'Uczelnia przygotowuje do wielu certyfikatów branżowych, zwiększając szanse na rynku pracy.'
  },
  {
    question: 'Ile wynosi średni czas znalezienia pierwszej pracy przez absolwentów?',
    answers: ['12 miesięcy', '6 miesięcy', '3 miesiące', '1 miesiąc'],
    correctAnswer: 2,
    type: 'single',
    category: 'Rozwój kariery',
    explanation: 'Większość absolwentów UWSB Merito znajduje pracę w ciągu kilku miesięcy od ukończenia studiów.'
  },
  {
    question: 'Czy UWSB Merito posiada akredytacje międzynarodowe?',
    answers: ['Nie posiada', 'Tak, kilka renomowanych akredytacji', 'Tylko krajowe', 'Jest w trakcie ubiegania się'],
    correctAnswer: 1,
    type: 'single',
    category: 'Jakość',
    explanation: 'Uczelnia posiada międzynarodowe akredytacje potwierdzające wysoką jakość kształcenia.'
  },
  {
    question: 'Jakie formy egzaminów są stosowane w UWSB Merito?',
    answers: ['Tylko pisemne', 'Tylko ustne', 'Różnorodne formy', 'Tylko testy'],
    correctAnswer: 2,
    type: 'single',
    category: 'Dydaktyka',
    explanation: 'Uczelnia stosuje różne formy sprawdzania wiedzy, w tym projekty, prezentacje, testy i egzaminy.'
  },
  {
    question: 'Czy UWSB Merito oferuje mentoring dla studentów?',
    answers: ['Nie oferuje', 'Tak, programy mentoringowe', 'Tylko dla wybitnych studentów', 'Tylko płatny'],
    correctAnswer: 1,
    type: 'single',
    category: 'Wsparcie studentów',
    explanation: 'Programy mentoringowe łączą studentów z doświadczonymi praktykami biznesu.'
  },
  {
    question: 'Jaki procent zajęć to ćwiczenia praktyczne?',
    answers: ['10%', '30%', '50%', '70%'],
    correctAnswer: 2,
    type: 'single',
    category: 'Dydaktyka',
    explanation: 'Duża część programu to zajęcia praktyczne, warsztaty i projekty.'
  },
  {
    question: 'Czy UWSB Merito uczestniczy w rankingach uczelni?',
    answers: ['Nie uczestniczy', 'Tak, z wysokimi ocenami', 'Tylko w lokalnych', 'Jest na ostatnich miejscach'],
    correctAnswer: 1,
    type: 'single',
    category: 'Jakość',
    explanation: 'Uczelnia regularnie zajmuje wysokie miejsca w rankingach uczelni niepublicznych.'
  },
  {
    question: 'Ile wynosi maksymalny limit nieobecności na zajęciach?',
    answers: ['10%', '20%', '30%', '50%'],
    correctAnswer: 1,
    type: 'single',
    category: 'Regulamin',
    explanation: 'Regulamin studiów określa dopuszczalną liczbę nieobecności na zajęciach.'
  },
  {
    question: 'Czy UWSB Merito oferuje double degree?',
    answers: ['Nie oferuje', 'Tak, z uczelniami partnerskimi', 'Tylko dla magistrów', 'Tylko dla kierunków ekonomicznych'],
    correctAnswer: 1,
    type: 'single',
    category: 'Międzynarodowość',
    explanation: 'Programy double degree pozwalają uzyskać dyplom dwóch uczelni jednocześnie.'
  },
  {
    question: 'Jaki jest stosunek studentów do wykładowców?',
    answers: ['50:1', '30:1', '15:1', '5:1'],
    correctAnswer: 2,
    type: 'single',
    category: 'Dydaktyka',
    explanation: 'Korzystny stosunek liczby studentów do wykładowców zapewnia indywidualne podejście.'
  },
  {
    question: 'Czy UWSB Merito ma własne centrum sportowe?',
    answers: ['Nie ma', 'Współpracuje z obiektami sportowymi', 'Ma własne centrum', 'Tylko siłownia'],
    correctAnswer: 1,
    type: 'single',
    category: 'Infrastruktura',
    explanation: 'Uczelnia zapewnia studentom dostęp do zajęć sportowych poprzez współpracę z obiektami sportowymi.'
  },
  {
    question: 'Jaki jest system oceniania w UWSB Merito?',
    answers: ['1-6', '2-5', 'A-F', 'Pass/Fail'],
    correctAnswer: 1,
    type: 'single',
    category: 'Regulamin',
    explanation: 'Uczelnia stosuje standardowy polski system ocen od 2 do 5 (z plusami).'
  },
  {
    question: 'Czy UWSB Merito organizuje targi pracy?',
    answers: ['Nie organizuje', 'Tak, coroczne targi pracy', 'Tylko online', 'Tylko dla absolwentów'],
    correctAnswer: 1,
    type: 'single',
    category: 'Rozwój kariery',
    explanation: 'Regularne targi pracy łączą studentów z potencjalnymi pracodawcami.'
  },
  {
    question: 'Jaka jest minimalna średnia do otrzymania stypendium naukowego?',
    answers: ['3.0', '3.5', '4.0', '4.5'],
    correctAnswer: 3,
    type: 'single',
    category: 'Wsparcie studentów',
    explanation: 'Stypendium naukowe przyznawane jest studentom z najwyższymi wynikami w nauce.'
  },
  {
    question: 'Czy UWSB Merito oferuje studia w weekendy?',
    answers: ['Nie oferuje', 'Tak, dla studiów niestacjonarnych', 'Tylko latem', 'Tylko dla podyplomowych'],
    correctAnswer: 1,
    type: 'single',
    category: 'Oferta edukacyjna',
    explanation: 'Studia niestacjonarne odbywają się głównie w weekendy, umożliwiając łączenie nauki z pracą.'
  },
  {
    question: 'Jaka jest pojemność największej auli w UWSB Merito Gdańsk?',
    answers: ['50 osób', '100 osób', '200 osób', '500 osób'],
    correctAnswer: 2,
    type: 'single',
    category: 'Infrastruktura',
    explanation: 'Uczelnia posiada przestronne aule wykładowe dla większych grup studentów.'
  },
  {
    question: 'Czy UWSB Merito ma własne wydawnictwo naukowe?',
    answers: ['Nie ma', 'Tak, wydaje publikacje', 'Tylko e-booki', 'Tylko dla pracowników'],
    correctAnswer: 1,
    type: 'single',
    category: 'Nauka',
    explanation: 'Wydawnictwo uczelni publikuje prace naukowe, monografie i materiały dydaktyczne.'
  },
  {
    question: 'Jaki procent wykładowców ma stopień doktora lub wyższy?',
    answers: ['30%', '50%', '70%', '90%'],
    correctAnswer: 3,
    type: 'single',
    category: 'Kadra',
    explanation: 'Większość kadry to doktorzy i profesorowie z wieloletnim doświadczeniem.'
  },
  {
    question: 'Czy UWSB Merito prowadzi badania naukowe?',
    answers: ['Nie prowadzi', 'Tak, w różnych obszarach', 'Tylko podstawowe', 'Tylko we współpracy'],
    correctAnswer: 1,
    type: 'single',
    category: 'Nauka',
    explanation: 'Uczelnia prowadzi badania naukowe i zachęca studentów do uczestnictwa w projektach badawczych.'
  },
  {
    question: 'Ile wynosi roczne czesne na studiach dziennych (średnio)?',
    answers: ['2000 zł', '4000 zł', '6000 zł', '10000 zł'],
    correctAnswer: 2,
    type: 'single',
    category: 'Opłaty',
    explanation: 'Czesne zależy od kierunku i formy studiów, uczelnia oferuje również różne formy finansowania.'
  },
  {
    question: 'Czy UWSB Merito oferuje możliwość ratalnej płatności czesnego?',
    answers: ['Nie oferuje', 'Tak, ratalne płatności', 'Tylko dla wybranych', 'Tylko przy pełnej opłacie'],
    correctAnswer: 1,
    type: 'single',
    category: 'Opłaty',
    explanation: 'Uczelnia umożliwia rozłożenie opłat na raty, ułatwiając finansowanie studiów.'
  },
  {
    question: 'Jaki język jest głównym językiem wykładowym?',
    answers: ['Angielski', 'Polski', 'Niemiecki', 'Mieszany'],
    correctAnswer: 1,
    type: 'single',
    category: 'Oferta edukacyjna',
    explanation: 'Głównym językiem wykładowym jest polski, choć oferowane są też programy anglojęzyczne.'
  },
  {
    question: 'Czy UWSB Merito organizuje letnie szkoły biznesu?',
    answers: ['Nie organizuje', 'Tak, programy letnie', 'Tylko dla zagranicznych', 'Tylko dla absolwentów'],
    correctAnswer: 1,
    type: 'single',
    category: 'Oferta edukacyjna',
    explanation: 'Letnie szkoły biznesu to intensywne programy szkoleniowe dla studentów i profesjonalistów.'
  },
  {
    question: 'Jaka jest średnia frekwencja na zajęciach?',
    answers: ['50%', '70%', '85%', '95%'],
    correctAnswer: 2,
    type: 'single',
    category: 'Życie studenckie',
    explanation: 'Studenci UWSB Merito charakteryzują się wysoką frekwencją na zajęciach.'
  },
  {
    question: 'Czy UWSB Merito oferuje kursy online?',
    answers: ['Nie oferuje', 'Tak, platformę e-learningową', 'Tylko w pandemii', 'Tylko dla podyplomowych'],
    correctAnswer: 1,
    type: 'single',
    category: 'Technologia',
    explanation: 'Uczelnia rozwija ofertę kursów online i hybrydowych, wykorzystując nowoczesne technologie.'
  },
  {
    question: 'Jaki jest średni czas trwania obrony pracy dyplomowej?',
    answers: ['15 minut', '30 minut', '45 minut', '60 minut'],
    correctAnswer: 1,
    type: 'single',
    category: 'Egzaminy',
    explanation: 'Obrona pracy dyplomowej to publiczna prezentacja i odpowiedzi na pytania komisji.'
  },
  {
    question: 'Czy UWSB Merito ma samorząd studencki?',
    answers: ['Nie ma', 'Tak, aktywny samorząd', 'Tylko formalny', 'W trakcie tworzenia'],
    correctAnswer: 1,
    type: 'single',
    category: 'Życie studenckie',
    explanation: 'Samorząd studencki reprezentuje interesy studentów i organizuje wydarzenia.'
  },
  {
    question: 'Ile publikacji naukowych rocznie wydaje UWSB Merito?',
    answers: ['10', '50', '100', '200'],
    correctAnswer: 2,
    type: 'single',
    category: 'Nauka',
    explanation: 'Pracownicy naukowi publikują dziesiątki artykułów i monografii rocznie.'
  },
  {
    question: 'Czy UWSB Merito oferuje studia online?',
    answers: ['Nie oferuje', 'Tak, wybrane kierunki', 'Tylko podyplomowe', 'Wszystkie kierunki'],
    correctAnswer: 1,
    type: 'single',
    category: 'Oferta edukacyjna',
    explanation: 'Wybrane programy dostępne są w formie studiów online dla większej elastyczności.'
  },
  {
    question: 'Jaka jest długość semestru w UWSB Merito?',
    answers: ['10 tygodni', '12 tygodni', '15 tygodni', '20 tygodni'],
    correctAnswer: 2,
    type: 'single',
    category: 'Organizacja',
    explanation: 'Semestr trwa standardowo 15 tygodni zajęć plus sesja egzaminacyjna.'
  },
  {
    question: 'Czy UWSB Merito prowadzi działalność charytatywną?',
    answers: ['Nie prowadzi', 'Tak, wiele inicjatyw', 'Tylko okazjonalnie', 'Tylko studenci'],
    correctAnswer: 1,
    type: 'single',
    category: 'Społeczność',
    explanation: 'Uczelnia angażuje się w działania charytatywne i społeczne, wspierając lokalne społeczności.'
  },
  {
    question: 'Ile trwa przerwa semestralna (ferie)?',
    answers: ['1 tydzień', '2 tygodnie', '3 tygodnie', '1 miesiąc'],
    correctAnswer: 1,
    type: 'single',
    category: 'Organizacja',
    explanation: 'Przerwa zimowa i letnia dają studentom czas na odpoczynek i praktyki.'
  },
  {
    question: 'Czy UWSB Merito ma program ambasadorów uczelni?',
    answers: ['Nie ma', 'Tak, studenci mogą zostać ambasadorami', 'Tylko absolwenci', 'Tylko wykładowcy'],
    correctAnswer: 1,
    type: 'single',
    category: 'Życie studenckie',
    explanation: 'Program ambasadorów pozwala studentom promować uczelnię i dzielić się doświadczeniem.'
  },
  {
    question: 'Jaki procent absolwentów kontynuuje kontakt z uczelnią?',
    answers: ['10%', '30%', '50%', '70%'],
    correctAnswer: 3,
    type: 'single',
    category: 'Alumni',
    explanation: 'Większość absolwentów pozostaje w kontakcie z uczelnią przez sieć alumni.'
  },
  {
    question: 'Czy UWSB Merito organizuje konkursy dla studentów?',
    answers: ['Nie organizuje', 'Tak, regularne konkursy', 'Tylko naukowe', 'Tylko sportowe'],
    correctAnswer: 1,
    type: 'single',
    category: 'Życie studenckie',
    explanation: 'Uczelnia organizuje konkursy naukowe, biznesowe i kreatywne dla studentów.'
  },
  {
    question: 'Ile średnio trwa konsultacja z wykładowcą?',
    answers: ['15 minut', '30 minut', '45 minut', '60 minut'],
    correctAnswer: 1,
    type: 'single',
    category: 'Dydaktyka',
    explanation: 'Wykładowcy mają wyznaczone godziny konsultacji dla studentów.'
  },
  {
    question: 'Czy UWSB Merito ma własny parking dla studentów?',
    answers: ['Nie ma', 'Tak, płatny parking', 'Tak, darmowy parking', 'Tylko dla wykładowców'],
    correctAnswer: 1,
    type: 'single',
    category: 'Infrastruktura',
    explanation: 'Uczelnia zapewnia miejsca parkingowe dla studentów i pracowników.'
  },
  {
    question: 'Jaka jest polityka plagiatów w UWSB Merito?',
    answers: ['Tolerancyjna', 'Bardzo restrykcyjna', 'Nie ma polityki', 'Zależy od wykładowcy'],
    correctAnswer: 1,
    type: 'single',
    category: 'Etyka',
    explanation: 'Uczelnia stosuje system antyplagiatowy i surowo karze nieuczciwość akademicką.'
  },
  {
    question: 'Czy UWSB Merito oferuje wsparcie psychologiczne dla studentów?',
    answers: ['Nie oferuje', 'Tak, darmowe konsultacje', 'Tylko płatne', 'Tylko w kryzysach'],
    correctAnswer: 1,
    type: 'single',
    category: 'Wsparcie studentów',
    explanation: 'Uczelnia dba o zdrowie psychiczne studentów, oferując dostęp do psychologa.'
  },
  {
    question: 'Ile wynosi deposit przy zapisie na studia?',
    answers: ['Nie ma depozytu', '500 zł', '1000 zł', '2000 zł'],
    correctAnswer: 0,
    type: 'single',
    category: 'Opłaty',
    explanation: 'Proces rekrutacji nie wymaga wpłacania depozytu zabezpieczającego.'
  },
  {
    question: 'Czy UWSB Merito ma kafeterię dla studentów?',
    answers: ['Nie ma', 'Tak, z pełnym menu', 'Tylko automaty', 'Tylko w wybranych kampusach'],
    correctAnswer: 1,
    type: 'single',
    category: 'Infrastruktura',
    explanation: 'Kafeteria oferuje posiłki i przekąski dla studentów i pracowników.'
  },
  {
    question: 'Jaki jest minimalny próg punktowy na rekrutacji?',
    answers: ['Nie ma progu', '30 punktów', '50 punktów', '70 punktów'],
    correctAnswer: 0,
    type: 'single',
    category: 'Rekrutacja',
    explanation: 'Rekrutacja odbywa się na podstawie rozmowy kwalifikacyjnej i dokumentów.'
  },
  {
    question: 'Czy UWSB Merito oferuje zajęcia wieczorowe?',
    answers: ['Nie oferuje', 'Tak, dla studentów pracujących', 'Tylko w weekendy', 'Tylko latem'],
    correctAnswer: 1,
    type: 'single',
    category: 'Oferta edukacyjna',
    explanation: 'Zajęcia wieczorowe umożliwiają studentom pracującym łączenie nauki z pracą.'
  },
  {
    question: 'Ile wynosi maksymalna liczba przedmiotów do wyboru w semestrze?',
    answers: ['2', '5', '10', 'Bez limitu'],
    correctAnswer: 1,
    type: 'single',
    category: 'Organizacja',
    explanation: 'Studenci mogą wybierać przedmioty fakultatywne w ramach określonego limitu.'
  },

  // Pytania wielokrotnego wyboru
  {
    question: 'Które z poniższych form studiów oferuje UWSB Merito?',
    answers: ['Stacjonarne', 'Niestacjonarne', 'Dualne', 'Online'],
    correctAnswer: [0, 1, 2, 3],
    type: 'multiple',
    category: 'Oferta edukacyjna',
    explanation: 'UWSB Merito oferuje pełną gamę form kształcenia: stacjonarne, niestacjonarne, dualne i online.'
  },
  {
    question: 'Które miasta w Polsce mają kampusy UWSB Merito?',
    answers: ['Gdańsk', 'Warszawa', 'Poznań', 'Wrocław'],
    correctAnswer: [0, 1, 2, 3],
    type: 'multiple',
    category: 'Lokalizacje',
    explanation: 'UWSB Merito ma kampusy w największych miastach Polski, w tym Gdańsku, Warszawie, Poznaniu i Wrocławiu.'
  },
  {
    question: 'Które obszary są częścią oferty edukacyjnej UWSB Merito?',
    answers: ['Zarządzanie', 'Finanse', 'Informatyka', 'Marketing'],
    correctAnswer: [0, 1, 2, 3],
    type: 'multiple',
    category: 'Oferta edukacyjna',
    explanation: 'Uczelnia oferuje szerokie spektrum kierunków biznesowych i technologicznych.'
  },
  {
    question: 'Jakie formy wsparcia oferuje Biuro Karier UWSB Merito?',
    answers: ['Pomoc w znalezieniu praktyk', 'Warsztaty CV', 'Targi pracy', 'Konsultacje zawodowe'],
    correctAnswer: [0, 1, 2, 3],
    type: 'multiple',
    category: 'Wsparcie studentów',
    explanation: 'Biuro Karier oferuje kompleksowe wsparcie w rozwoju zawodowym studentów.'
  },
  {
    question: 'Które stypendia są dostępne dla studentów UWSB Merito?',
    answers: ['Naukowe', 'Socjalne', 'Dla niepełnosprawnych', 'Sportowe'],
    correctAnswer: [0, 1, 2],
    type: 'multiple',
    category: 'Wsparcie studentów',
    explanation: 'Uczelnia oferuje różne formy wsparcia finansowego dla studentów spełniających kryteria.'
  },
  {
    question: 'Które kompetencje miękkie rozwija UWSB Merito?',
    answers: ['Przywództwo', 'Komunikacja', 'Praca zespołowa', 'Zarządzanie stresem'],
    correctAnswer: [0, 1, 2],
    type: 'multiple',
    category: 'Kompetencje',
    explanation: 'Program studiów rozwija kluczowe kompetencje miękkie: przywództwo, komunikację i pracę zespołową.'
  },
  {
    question: 'Które programy międzynarodowe są dostępne w UWSB Merito?',
    answers: ['Erasmus+', 'Double degree', 'Wymiana studencka', 'Praktyki zagraniczne'],
    correctAnswer: [0, 1, 2, 3],
    type: 'multiple',
    category: 'Międzynarodowość',
    explanation: 'UWSB Merito oferuje szeroki wachlarz możliwości międzynarodowych dla studentów.'
  },
  {
    question: 'Jakie elementy infrastruktury posiada UWSB Merito?',
    answers: ['Nowoczesne sale wykładowe', 'Biblioteka', 'Laboratoria komputerowe', 'Kafeteria'],
    correctAnswer: [0, 1, 2, 3],
    type: 'multiple',
    category: 'Infrastruktura',
    explanation: 'Uczelnia dysponuje nowoczesną infrastrukturą wspierającą proces edukacyjny.'
  },
  {
    question: 'Które metody dydaktyczne stosuje UWSB Merito?',
    answers: ['Case study', 'Projekty grupowe', 'Wykłady gościnne ekspertów', 'Symulacje biznesowe'],
    correctAnswer: [0, 1, 2, 3],
    type: 'multiple',
    category: 'Dydaktyka',
    explanation: 'Uczelnia stosuje nowoczesne metody dydaktyczne łączące teorię z praktyką.'
  },
  {
    question: 'W jakich językach można studiować w UWSB Merito?',
    answers: ['Polski', 'Angielski', 'Niemiecki', 'Hiszpański'],
    correctAnswer: [0, 1],
    type: 'multiple',
    category: 'Oferta edukacyjna',
    explanation: 'Główne języki wykładowe to polski i angielski, dodatkowo oferowana jest nauka innych języków.'
  },
  {
    question: 'Które sektory biznesowe są reprezentowane przez partnerów UWSB Merito?',
    answers: ['Finanse i bankowość', 'IT i technologie', 'Consulting', 'E-commerce'],
    correctAnswer: [0, 1, 2],
    type: 'multiple',
    category: 'Biznes',
    explanation: 'Uczelnia współpracuje z firmami z sektorów finansowego, IT i consultingu.'
  },
  {
    question: 'Jakie wydarzenia organizuje UWSB Merito?',
    answers: ['Konferencje naukowe', 'Warsztaty biznesowe', 'Spotkania networkingowe', 'Dzień otwarty'],
    correctAnswer: [0, 1, 2, 3],
    type: 'multiple',
    category: 'Życie studenckie',
    explanation: 'Uczelnia regularnie organizuje różnorodne wydarzenia dla studentów i kandydatów.'
  },
  {
    question: 'Które certyfikaty można zdobyć podczas studiów w UWSB Merito?',
    answers: ['Językowe', 'IT', 'Projektowe', 'Finansowe'],
    correctAnswer: [0, 1, 3],
    type: 'multiple',
    category: 'Certyfikaty',
    explanation: 'Studenci mogą zdobywać certyfikaty językowe, IT i finansowe zwiększające ich wartość na rynku pracy.'
  },
  {
    question: 'Które formy aktywności pozalekcyjnej oferuje UWSB Merito?',
    answers: ['Koła naukowe', 'Organizacje studenckie', 'Wolontariat', 'Sport'],
    correctAnswer: [0, 1, 2],
    type: 'multiple',
    category: 'Życie studenckie',
    explanation: 'Uczelnia wspiera koła naukowe, organizacje studenckie oraz wolontariat.'
  },
  {
    question: 'Jakie narzędzia edukacyjne wykorzystuje UWSB Merito?',
    answers: ['Platforma e-learningowa', 'Wirtualne klasy', 'Aplikacje mobilne', 'Systemy symulacyjne'],
    correctAnswer: [0, 1],
    type: 'multiple',
    category: 'Technologia',
    explanation: 'Uczelnia wykorzystuje nowoczesną platformę e-learningową oraz wirtualne klasy do nauczania.'
  },
];

// Funkcja losująca pytania z bazy danych
export async function getRandomQuestions(): Promise<Question[]> {
  try {
    // Pobierz historię pytań
    const history = getQuestionHistory();
    const historyParam = history.length > 0 ? `&recent=${history.join(',')}` : '';
    
    console.log(`Fetching questions with history of ${history.length} recent questions`);
    
    // Najpierw spróbuj pobrać pytania z bazy danych
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-1bd2a132/questions/random?single=8&multiple=2${historyParam}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      }
    );
    
    if (response.ok) {
      const data = await response.json();
      console.log('Questions loaded from database:', data.questions.length);
      return data.questions;
    } else {
      console.warn('Failed to load questions from database, using local fallback');
      // Fallback do pytań lokalnych
      return getRandomQuestionsFromLocal();
    }
  } catch (error) {
    console.error('Error fetching questions from database:', error);
    // Fallback do pytań lokalnych w przypadku błędu
    return getRandomQuestionsFromLocal();
  }
}

// Funkcja pomocnicza - lokalne losowanie (fallback)
function getRandomQuestionsFromLocal(): Question[] {
  const singleChoiceQuestions = allQuestions.filter(q => q.type === 'single');
  const multipleChoiceQuestions = allQuestions.filter(q => q.type === 'multiple');
  
  // Losowanie 8 pytań pojedynczego wyboru
  const shuffledSingle = [...singleChoiceQuestions].sort(() => Math.random() - 0.5);
  const selectedSingle = shuffledSingle.slice(0, 8);
  
  // Losowanie 2 pytań wielokrotnego wyboru
  const shuffledMultiple = [...multipleChoiceQuestions].sort(() => Math.random() - 0.5);
  const selectedMultiple = shuffledMultiple.slice(0, 2);
  
  // Połączenie i losowe przemieszanie wszystkich wybranych pytań
  const allSelected = [...selectedSingle, ...selectedMultiple];
  return allSelected.sort(() => Math.random() - 0.5);
}