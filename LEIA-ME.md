# Landing page — Monte Carlo Guarujá

HTML, CSS e JS puros. A única parte que roda em servidor é a função que busca as avaliações do Google.

## Estrutura

```
index.html                     página (todas as seções)
css/style.css                  visual (cores e fontes no topo, em :root)
js/hero.js                     animação de luzes do topo
js/main.js                     menu do celular e abas do cardápio
js/menu-data.js                pratos e preços em destaque (edite aqui)
js/reviews.js                  monta as avaliações na página
netlify/functions/reviews.js   consulta a Google Places API (New)
netlify.toml                   liga /api/reviews à função
assets/img/                    coloque as fotos aqui
```

## Colocar as fotos

Cada espaço de foto é um `<figure class="photo-slot">`. Coloque a imagem dentro dele:

```html
<figure class="photo-slot"><img src="assets/img/arroz-de-camarao.jpg" alt="Arroz de camarão"></figure>
```

Use JPG ou WebP com uns 1600 px no lado maior.

## Publicar na Netlify

1. Crie uma conta em netlify.com e arraste esta pasta (ou ligue um repositório Git).
2. Em **Site configuration → Environment variables**, crie:
   - `GOOGLE_PLACES_KEY`: chave da Google Maps Platform
   - `GOOGLE_PLACE_ID`: o Place ID do restaurante
3. Faça um novo deploy.

## Publicar na Vercel

A função das avaliações para a Vercel fica em `api/reviews.js` (responde em `/api/reviews`).
O `.vercelignore` deixa de fora os arquivos da Netlify.

1. Na pasta do projeto: `npx vercel login` e depois `npx vercel` (cria o projeto e um link de teste).
   Nas perguntas, aceite os padrões: não há comando de build, a pasta de saída é a própria raiz.
2. No painel da Vercel, em **Settings → Environment Variables**, crie `GOOGLE_PLACES_KEY` e `GOOGLE_PLACE_ID`.
3. Publique em produção: `npx vercel --prod`.

## Conseguir a chave e o Place ID

1. No Google Cloud Console, crie um projeto, ative o faturamento e ative a **Places API (New)**.
2. Crie uma chave de API e restrinja-a à Places API (New).
3. Encontre o Place ID em developers.google.com/maps/documentation/places/web-service/place-id
   (busque "Restaurante Pizza Bar Monte Carlo, Guarujá").

Observações:
- O Google devolve no máximo 5 avaliações, escolhidas por ele como as mais relevantes.
- É obrigatório mostrar que as avaliações vêm do Google e o nome do autor (a página já faz isso).
- A resposta fica em cache por 24 h, o que mantém o uso dentro da cota gratuita mensal.

## Agenda musical

A lista "Próximos shows" da seção de música (`js/agenda.js`) lê uma planilha do Google.

1. **Crie a planilha** no Google Sheets com estas colunas na primeira linha:

   | Data       | Hora  | Banda             | Estilo   |
   |------------|-------|-------------------|----------|
   | 24/10/2026 | 20h   | Trio Maresia      | MPB      |
   | 25/10/2026 | 20h30 | Banda Pé na Areia | Pop rock |

   - **Data**: `dd/mm/aaaa` (também aceita `dd/mm` e `dd/mm/aa`).
   - **Hora**: `20h`, `20:30` ou `20h30`.
   - **Estilo** é opcional. Linhas sem data válida ou sem banda são ignoradas.
2. **Publique como CSV**: **Arquivo → Compartilhar → Publicar na Web**, escolha a aba da agenda,
   o formato **Valores separados por vírgula (.csv)** e clique em **Publicar**. Copie o link gerado.
3. **Cole o link** em `js/agenda.js`, na constante do topo:
   ```js
   const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/.../pub?gid=0&single=true&output=csv";
   ```
   Enquanto ela estiver vazia, a página mostra 4 shows de exemplo.
4. **Compartilhe com o cliente**: botão **Compartilhar**, adicione o e-mail dele como **Editor**.
   A partir daí ele mesmo mantém a agenda, sem mexer no site.

Os shows de datas passadas somem sozinhos (vale o dia no horário de Brasília) e aparecem no máximo 6
(`MAX_SHOWS`). Depois de editar a planilha, o site atualiza em até 5 minutos — é o tempo que o Google
leva para republicar o CSV.

## Para conferir antes de publicar
- Horários de funcionamento (seção "Como chegar").
- Preços em `js/menu-data.js` (copiados do cardápio digital em outubro de 2026).
