# Vcetmang

Progetto per il corso Fondamenti Web 2021/2022

[Clicca qui per una demo](https://www.vcetmang.online)

## Tecnologie e framework utilizzati

- Typescript
- Node.js
- Express.js
- Socket.io
- MongoDB
- Prisma (ORM)
- React.js
- Chakra-ui

## Casi d'uso implementati

### Cliente
1. Creazione di un ordine dal menù
2. Visualizzazione stato dell'ordine (realtime)

### Cuoco
1. Presa in carico di un ordine
2. Conclusione di un ordine
3. Visualizzazione degli ordini attivi (realtime)

### Amministratore
1. Aggiunta elemento al menù (con immagine)
2. Eliminazione elemento dal menù
3. Modifica elemento del menù
4. Visualizzazione delle transazioni (realtime)
5. Gestione cuochi

## Avvio
Questo progetto utilizza Docker

N.B.: il file `docker-compose.yml` e i `Dockerfile` sono configurati per il deployment. Per eseguire il progetto in locale è necessario utilizzare il file `docker-compose-dev.yml` già configurato per utilizzare i `Dockerfile-dev`

1. Eseguire la build
  ```sh
  docker compose -f docker-compose-dev.yml build
  ```
2. Avviare i container
  ```sh
  docker compose -f docker-compose-dev.yml up
  ```

## Informazioni utili

- Il menù è composto da elementi di default caricati dal file `server/src/prisma/seed.ts`
- Email (`ROOT_EMAIL`) e password (`ROOT_PASSWORD`) dell'amministratore sono nel file `/server/.env` 
