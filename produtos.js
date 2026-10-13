/*
 * CATÁLOGO USEGET
 * ----------------
 * Para adicionar uma placa nova:
 *   1. Coloque as fotos em assets/images/produtos/ com os nomes
 *      placa-NOME-600.webp e placa-NOME-1143.webp (ou ajuste o tamanho abaixo).
 *   2. Copie um bloco { ... } da lista e troque os textos.
 *   3. Se a placa tiver mais de uma cor, liste cada cor em "variantes".
 *
 * "categoria" precisa ser uma das chaves de USEGET_CATEGORIAS.
 * Para criar uma categoria nova, basta adicioná-la em USEGET_CATEGORIAS.
 */
window.USEGET_CATEGORIAS = {
  avaliacoes: 'Avaliações',
  redes: 'Redes e contato',
  cardapio: 'Cardápio'
};

window.USEGET_PRODUTOS = [
  {
    id: 'google',
    nome: 'Avaliação no Google',
    categoria: 'avaliacoes',
    descricao: 'Convide quem gostou do atendimento a deixar uma avaliação e ganhe destaque no Google e no Maps.',
    variantes: [
      { nome: 'Azul', cor: '#1f6fe5', imagem: 'placa-google-azul' },
      { nome: 'Preta', cor: '#1d1d1f', imagem: 'placa-google-preta' }
    ]
  },
  {
    id: 'instagram',
    nome: 'Instagram',
    categoria: 'redes',
    descricao: 'Ganhe seguidores direto do balcão: um toque e o cliente já está no seu perfil.',
    variantes: [{ nome: 'Padrão', imagem: 'placa-instagram' }]
  },
  {
    id: 'whatsapp',
    nome: 'WhatsApp',
    categoria: 'redes',
    descricao: 'Abre uma conversa com o seu negócio na hora, para pedidos, reservas e atendimento.',
    variantes: [{ nome: 'Padrão', imagem: 'placa-whatsapp' }]
  },
  {
    id: 'cardapio',
    nome: 'Cardápio',
    categoria: 'cardapio',
    descricao: 'Seu cardápio digital na mesa: o cliente aproxima o celular e já vê tudo.',
    variantes: [{ nome: 'Padrão', imagem: 'placa-cardapio' }]
  }
];
