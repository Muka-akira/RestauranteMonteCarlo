/* Pratos em destaque — edite aqui nomes, descrições e preços.
   Fonte: cardápio digital (monte-carlo-guaruja.goomer.app), outubro de 2026.
   price: número em reais | from: true mostra "a partir de" | price: null mostra "consulte" */
window.MENU = [
  {
    id: "mar",
    label: "Camarão e frutos do mar",
    items: [
      { name: "Arroz de Camarão", desc: "Arroz com molho vermelho e camarão rosa G.", price: 244.5, from: true, tag: "Pedido da casa" },
      { name: "Camarão na Moranga", desc: "Moranga recheada com camarão, acompanha arroz com leite de coco.", price: null },
      { name: "Camarão Rosa", desc: "Camarão rosa em vários preparos. Escolha o seu no cardápio digital.", price: 215.5, from: true },
      { name: "Mix Polvo e Lula Provençal", desc: "Polvo e lula à provençal.", price: 147.2, from: true },
      { name: "Espeto de Camarão à Grega", desc: "5 camarões rosa M, arroz à grega, provolone à milanesa e batata palha.", price: 114, tag: "Individual" }
    ]
  },
  {
    id: "peixes",
    label: "Peixes",
    items: [
      { name: "Pescada à Guanabara", desc: "Arroz com camarão, ervilha e cebola, peixe grelhado por cima e gratinado.", price: 251 },
      { name: "Cambucu à Belle Munier", desc: "Arroz à grega, batata sauté, molho de alcaparras, champignon e camarão.", price: 285 },
      { name: "Moqueca de Cambucu", desc: "Peixe cozido com pimentão, cebola, azeite de dendê e leite de coco.", price: 236.5, from: true },
      { name: "Cambucu à Brasileira", desc: "Arroz branco, peixe grelhado com molho de camarão e pirão.", price: 288 },
      { name: "Pescada à Cubana", desc: "Filé à milanesa, arroz à grega, fritas, bacon e banana à milanesa.", price: 204 },
      { name: "Pescada à Fiorentina", desc: "Arroz branco, peixe com molho branco e espinafre, purê de batata.", price: 226 }
    ]
  },
  {
    id: "carnes",
    label: "Carnes",
    items: [
      { name: "Mignon à Gaúcha", desc: "Com arroz carreteiro, farofa e fritas.", price: 224 },
      { name: "Mignon a Daniel", desc: "Ao molho madeira, arroz no próprio molho e batata corada.", price: 208 },
      { name: "Mignon à Parmeggiana", desc: "Com arroz e fritas.", price: 208 },
      { name: "Mignon à Cubana", desc: "Mignon à milanesa, arroz à grega, fritas, bacon e banana à milanesa.", price: 208 },
      { name: "Chorizo Angus Completo", desc: "Escolha o arroz, fritas, banana à milanesa, farofa e vinagrete.", price: 193.8, from: true }
    ]
  },
  {
    id: "entradas",
    label: "Entradas e porções",
    items: [
      { name: "Pastel de Camarão", desc: "3 ou 6 unidades, com molho de camarão e catupiry.", price: 28, from: true, tag: "Pedido da casa" },
      { name: "Casquinha de Siri", desc: "", price: 28 },
      { name: "Bolinho de Carne Tipo Alemão", desc: "6 unidades, com pão preto, carne moída e linguiça levemente apimentada.", price: 32.5 },
      { name: "Carpaccio", desc: "Molho de alcaparras e mostarda, acompanha torradas.", price: 53 },
      { name: "Lula à Dorê", desc: "Acompanha molho tártaro.", price: 86.3, from: true },
      { name: "Filé Aperitivo com Catupiry", desc: "Tiras de mignon com molho madeira, catupiry e cebola.", price: 146 }
    ]
  },
  {
    id: "individuais",
    label: "Individuais e light",
    items: [
      { name: "Executivo de Massa", desc: "Escolha a massa e o molho.", price: 82, from: true, tag: "Individual" },
      { name: "Executivo de Filé de Pescada", desc: "Escolha o acompanhamento.", price: 98, from: true, tag: "Individual" },
      { name: "Executivo de Mignon Grelhado", desc: "Escolha o acompanhamento.", price: 104, from: true, tag: "Individual" },
      { name: "Filé de Pescada Light", desc: "Pescada grelhada com a salada Monte Carlo individual.", price: 81, tag: "Individual" },
      { name: "Mignon Light", desc: "Tiras de mignon grelhado com a salada Monte Carlo individual.", price: 92, tag: "Individual" }
    ]
  }
];
