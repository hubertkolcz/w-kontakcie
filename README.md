# _W kontakcie_

Prototyp jest demonstracją podstawowej funkcjonalności aplikacji w-kontakcie, 
która ma na celu poprawienie świadomości ekologicznej obywateli Wrocławia, 
poprzez poprawienie jakości relacji rodzic-dziecko i obustronne wzmacnianie wiedzy ekologicznej.
Odbywa się ona dzięki aplikacji, która pozwala na obserwację i analizę sposobu poruszania się 
dziecka z i do szkoły, wraz z nagradzaniem go za wybory ekologiczne, poprzez system gratyfikacji.
Dodatkową motywację stanowi możliwość porównywania swoich wyników z innymi dziećmi/rodzicami.

Trzonem aplikacji jest komunikator oparty na WebSocket.
Kiedy mowa o komunikatorze, nie chodzi o chat w sensie dosłownym, 
a sposób wymiany informacji między dwoma użytkownikami - dzieckiem i rodzicem. Dziecko i rodzic otrzymują powiadomienia o aktywności drugiego. 
Np. system, na podstawie lokalizacji dziecka, przesyła do rodzica informację: "Syn dotarł do szkoły o 8:20", a do syna: "Gratulacje! Właśnie otrzymałeś od taty odznakę Eko-zbieracza".
Innymi słowy: dziecko komunikuje swojemu rodzicowi za pomocą swojego zachowania - nie musi nic pisać, żeby rodzic otrzymał od dziecka wiadomość, że jest 1km od szkoły, 
lub też że wybrał ekologiczny środek transportu.

Tak wygenerowane informacje mogą stanowić twardą bazę analityczną dla miasta Wrocław. 

Aplikacja w obecnym kształcie skupia się przede wszystkim na rozwoju back-endu, 
front-end jest webowy i pozwala na zasymulowanie znalezienia się dziecka w różnych miejscach,
a zatem - różnych scenariuszy komunikatów i nagród.

Docelowo, aplikacja mobilna będzie napisana w React Native.



Sposób działania:

1. Synchronizacja
   - Aplikacja wymaga zarejestrowania się zarówno rodzica, jak i dziecka
   - Dziecko paruje się z rodzicem poprzez zeskanowanie kodu QR (na kształt integracji telefonu z komputer w WhatsApp)
   - Aplikacja wymaga włączonej lokalizacji i internetu po stronie dziecka, w czasie gdy przechodzi z/do szkoły
2. Background. Aplikacja sprawdza, czy dziecko dotarło do szkoły. 
   - Aplikacja automatycznie sprawdza lokalizację dziecka w ustalonych godzinach, 
   np. od 8:00 do 8:45
     - Jeśli dziecko dotrze na wskazane w aplikacje miejsce (z początku dwie podstawowe: dom i szkoła), do rodzica zostaje przesłany komunikat.
     - Jeśli dziecko nie dotrze na czas, rodzic otrzyma komunikat, a dziecko - punkty ujemne/zapytanie
3. Integracje:
   - Jakość powietrza (Airly) https://developer.airly.org/pl/docs
   - Hulajnogi (Tier/Hive/Bolt/...) https://github.com/ubahnverleih/WoBike
   - Trasa piesza (Google Maps) https://developers.google.com/maps/documentation/directions/overview
4. Output
    - Kalkulator, ile zanieczyszczeń udało się uniknąć
    - Poziomy/odznaczenia za działalność zgodną z rekomendacjami ekologicznymi
    - Sprawdzenie, czy przy wybranej szkole zdażają się wypadki. 
   Jeśli tak, to jak często i czy szczególnie w analogicznym okresie 
   https://www.wroclaw.pl/portal/szkolna-ulica
    - 
5. W przyszłości:
   - Automatyczne komunikaty, gdy dziecko np. przejdzie pierwszy 1km trasy (z 3km)
   - Komunikat o wybranym środku transportu (na podstawie prędkości poruszania się)
   - Rekomendacja (publiczny środek transportu/hulajnoga/rower/piechota) na podstawie:
     - jakości powietrza
     - korków
     - poziomu hałasu