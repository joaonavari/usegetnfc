# USEGET

Landing page estática das placas NFC USEGET (Avaliação no Google, Instagram, WhatsApp e Cardápio). HTML, CSS e JavaScript puros, sem instalação nem compilação.

## Visualizar

Abra `index.html` no navegador. Para uma prévia HTTP opcional:

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

e acesse <http://127.0.0.1:8765>.

## Onde editar

- `produtos.js`: **catálogo de placas**. Para adicionar uma placa nova, copie um bloco da lista e troque nome, categoria, descrição e imagem. Placas com mais de uma cor usam `variantes`. Os filtros aparecem sozinhos quando há mais de uma categoria.
- `assets/images/produtos/`: fotos das placas. Cada foto tem duas versões: `placa-NOME-600.webp` e `placa-NOME-1143.webp`. Os originais ficam em `assets/images/masters/`.
- `index.html`: textos das seções (hero, destaques, material, ativação, segmentos, quantidade, FAQ, contato).
- `styles.css`: cores em `:root`, tipografia e layouts responsivos.
- `script.js`: número do WhatsApp (`WHATSAPP_NUMBER`), mensagens prontas (`WHATSAPP_MESSAGES`), menu, catálogo e animações.

## WhatsApp

Número: **+55 (44) 99929-7681**. Troque só `WHATSAPP_NUMBER` em `script.js` (código do país + DDD, só dígitos). Cada botão "Quero esta placa" abre o WhatsApp com uma mensagem já citando a placa e a cor escolhida. O botão verde flutuante aparece depois que o visitante passa do topo e some na seção de contato.

## Instagram

Perfil: [@usegetnfc](https://www.instagram.com/usegetnfc/), linkado no contato e no rodapé.

## Estrutura da página

1. Hero com as placas em leque e a proposta: "Um toque. E o cliente chega lá."
2. Destaques: 10×10 cm, NFC + QR, zero apps, ativação em 1 minuto.
3. Catálogo com filtros e troca de cor.
4. Seção escura de material (acrílico cristal, impressão UV), com foto real do produto.
5. Como ativar: entregue configurada ou ativação pelo próprio cliente.
6. Segmentos: mercados, conveniências, bares, restaurantes, lojas de roupa, salões.
7. Pedidos em quantidade.
8. Perguntas frequentes.
9. Contato (WhatsApp + Instagram).

## Acessibilidade e movimento

Menu com `aria-expanded` e Escape; troca de cor com `role="radio"`; FAQ com `details/summary`. As animações respeitam `prefers-reduced-motion`.

## Pendências

- `og:image` precisa de URL absoluta quando o domínio estiver definido.
- Fotos das placas em uso (balcão, caixa, mesa) deixariam a página ainda mais forte.
