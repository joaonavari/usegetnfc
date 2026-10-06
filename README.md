# USEGET

Landing page estática para os modelos USEGET Azul e Preto. HTML semântico, CSS responsivo e JavaScript nativo, sem instalação, compilação ou serviços externos.

## Visualizar

Abra `index.html` no navegador. Todos os caminhos são relativos e funcionam diretamente no disco.

Para uma prévia HTTP opcional, execute nesta pasta:

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

Abra <http://127.0.0.1:8765>. Encerre a prévia com `Ctrl+C` no terminal. O servidor entrega somente os arquivos estáticos neste computador.

## Editar

- `index.html`: textos, seções, fotos, SEO e FAQ nativo.
- `styles.css`: cores em `:root`, tipografia, espaçamentos e layouts responsivos.
- `script.js`: número comercial, mensagens, menu e movimento.
- `assets/images/`: WebP usados pela página, imagem de compartilhamento, símbolo da marca e favicon PNG.
- `assets/images/masters/`: PNG com transparência para edição e exportação.
- `favicon.ico`: ícone da aba do navegador, em 16, 32 e 48 pixels.

O símbolo USEGET aparece ao lado do nome no cabeçalho e no rodapé. O arquivo `assets/images/useget-icon.png` tem fundo transparente e foi extraído da imagem fornecida usando a ferramenta integrada `imagegen`, com a instrução: “Isolar o símbolo U com os três arcos NFC, remover o fundo branco e o texto, preservar o formato e centralizar em uma imagem quadrada transparente”. O mestre está em `assets/images/masters/useget-icon.png`.

O `.gitignore` mantém arquivos locais do sistema, editores, caches, dependências e segredos fora do Git. O código, as imagens do site e este README permanecem disponíveis para publicar no GitHub.

O WhatsApp confirmado é **+55 (44) 99929-7681**. Altere apenas `WHATSAPP_NUMBER` em `script.js`, usando código do país e DDD, somente dígitos. As três mensagens ficam em `WHATSAPP_MESSAGES`. Os links abrem a conversa com o texto preenchido; o visitante decide enviar. Número inválido desativa os links e oculta o número.

As fotos vêm de `IMG_2794.HEIC` e `IMG_2795.HEIC`. Os quatro mestres PNG dos produtos são o modelo Azul, o modelo Preto, a composição dos dois e o detalhe NFC/QR Code. O recorte preserva as inscrições dos produtos. Produtos e composição têm transparência real; sombras são aplicadas pelo CSS. O detalhe e a imagem de compartilhamento têm fundo opaco intencional.

## Design e acessibilidade

Vitrine editorial com os produtos reais, fonte do sistema, superfícies brancas e cinza suave e navegação translúcida.

O movimento usa integração física de mola em `requestAnimationFrame`, com velocidade preservada durante reversões. Botões respondem a hover, foco e pressão; os produtos acompanham discretamente o ponteiro em desktop. O toque continua livre para a rolagem nativa. `prefers-reduced-motion` cancela as molas, revela o conteúdo e desativa a rolagem suave, inclusive quando a preferência muda com a página aberta.

O menu oferece estado `aria-expanded`, Escape e navegação por teclado; links ocultos ficam `hidden` e `inert`. FAQ usa `details` e `summary` sem depender de JavaScript. O conteúdo permanece visível quando o JavaScript está desabilitado; o telefone comercial aparece na seção de contato.

## Dados ainda não confirmados

Preços, disponibilidade, condições de pagamento e entrega, medidas, material, garantia e configuração do produto; Instagram oficial. Esses dados foram omitidos. O contato pelo WhatsApp está funcional.

A imagem de compartilhamento está preparada localmente. Uma futura publicação precisará de URL absoluta em `og:image`, baseada no domínio que for escolhido. Esta entrega é exclusivamente local.
