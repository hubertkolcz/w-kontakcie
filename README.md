# _W kontakcie_

Prototyp jest demonstracją podstawowej funkcjonalności aplikacji w-kontakcie, 
która ma na celu poprawienie świadomości ekologicznej obywateli Wrocławia, 
poprzez poprawienie jakości relacji rodzic-dziecko i obustronne wzmacnianie wiedzy ekologicznej.
Odbywa się ona dzięki aplikacji, która pozwala na obserwację i analizę sposobu poruszania się 
dziecka z i do szkoły, wraz z nagradzaniem go za wybory ekologiczne, poprzez system gratyfikacji.
Dodatkową motywację stanowi możliwość porównywania swoich wyników z innymi dziećmi/rodzicami.

Trzonem aplikacji jest komunikator oparty na WebSocket.

Sposób działania:
- Aplikacja wymaga zarejestrowania się zarówno rodzica, jak i dziecka
- Dziecko paruje się z rodzicem poprzez zeskanowanie kodu QR
- Aplikacja wymaga włączonej lokalizacji i internetu po stronie dziecka
- Aplikacja automatycznie sprawdza lokalizację dziecka w ustalonych godzinach, 
np. od 8:00 do 8:45
- Aplikacja sprawdza, czy dziecko dotarło do szkoły. Jeśli nie, wysyła powiadomienie do rodzica

Integracje:
- Jakość powietrza (Airly) https://developer.airly.org/pl/docs
- Hulajnogi (Tier/Hive/Bolt/...) https://github.com/ubahnverleih/WoBike
- Trasa piesza (Google Maps) https://developers.google.com/maps/documentation/directions/overview

W przyszłości:
- Kalkulator, ile zanieczyszczeń udało się uniknąć
- Poziomy za stopień ekologiczności

- Automatyczne komunikaty, gdy dziecko np. przejdzie pierwszy 1km trasy (z 3km)
- Komunikat o wybranym środku transportu (na podstawie prędkości poruszania się)

- Rekomendacja (publiczny środek transportu/hulajnoga/rower/piechota) na podstawie:
  - jakości powietrza
  - korków
  - 