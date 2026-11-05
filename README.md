# Cascais Acessível — Prova de Conceito (PoC)

Aplicação web demonstrativa desenvolvida para uma oficina de **110 minutos**, apresentando o ciclo completo de registo, avaliação preliminar determinística, visualização cartográfica pública e participação cívica sobre a acessibilidade de entradas de estabelecimentos comerciais no concelho de Cascais.

> **Aviso Legal e de Demonstração:**
> - Os **8 estabelecimentos iniciais** e o **reporte inicial** são **dados estritamente fictícios**, criados apenas para demonstração funcional.
> - A classificação preliminar (limiar demonstrativo de **80 cm de largura sem degraus**) **não constitui certificação oficial**, auditoria técnica ao abrigo do Decreto-Lei n.º 163/2006 nem selo legal de conformidade.
> - O **Índice ilustrativo de prontidão documental** e a exportação **CSV** são meramente demonstrativos e **não representam elegibilidade real nem formulários oficiais do programa Portugal 2030**.

---

## Opções Tecnológicas e Sistema de Design

- **Frontend:** React 18 + Vite 6 + TypeScript (`strict`).
- **Sistema de Design (v1.0):** Tipografia **Lato** (`400`, `700`, `900`), paleta acessível (`#00967A` Teal, `#006B59` Dark Teal com contraste ≥ 6.47:1 em botões de texto branco, `#F2C62B` Mustard, `#1A1A1A` Charcoal, `#EDF2F1` Light Gray e `#FF6B5F` Coral apenas como detalhe), cantos arredondados, iconografia geométrica própria (`src/components/Icons.tsx`) e indicadores que nunca dependem apenas da cor.
- **Estilos:** CSS puro responsivo e acessível (`src/styles.css`), sem bibliotecas pesadas de componentes.
- **Estado Partilhado:** React Context (`AppDataContext`) partilhado em tempo real pelas três vistas.
- **Persistência:** Armazenamento exclusivamente local no navegador (`window.localStorage`) através das chaves:
  - `cascais-accessible:establishments:v1`
  - `cascais-accessible:reports:v1`
- **Avaliação:** Motor determinístico puro (`evaluateAccessibility` em `src/lib/accessibility.ts`), sem recurso a modelos de IA/LLM ou APIs externas.
- **Cartografia:** Leaflet + React Leaflet com mosaicos públicos do **OpenStreetMap** (`https://tile.openstreetmap.org/{z}/{x}/{y}.png`) e atribuição visível `© OpenStreetMap contributors`.
- **Captura de Localização:** Seleção explícita por clique direto no mapa (`LocationPicker`), sem geocodificação automática a partir da morada.
- **Exportação:** Geração de ficheiro CSV no navegador com BOM UTF-8 (`\uFEFF`) e escape correto de vírgulas, aspas, pontos e vírgulas e quebras de linha.

---

## Instalação e Execução Local

Pré-requisitos: **Node.js 18+** (verificado em Node.js v24) e **npm**.

```bash
npm install
npm run dev
```

Após iniciar `npm run dev`, abra no navegador o endereço local apresentado no terminal (habitualmente `http://localhost:5173`).

Para validar a compilação TypeScript e gerar o pacote de produção:

```bash
npm run build
npm run preview
```

---

## Persistência Local e Dependência de Ligação à Internet

1. **Dados locais a um único navegador (`localStorage`):**
   - Não existe servidor, base de dados, autenticação nem sincronização entre dispositivos.
   - Os registos criados numa sessão permanecem disponíveis após atualizar a página (**F5**) **no mesmo navegador e origem**, mas não ficam visíveis noutros computadores, noutros navegadores ou em janelas privadas independentes.
   - Os 8 registos fictícios iniciais só são carregados na primeira utilização (quando a chave `cascais-accessible:establishments:v1` ainda não existe).
2. **Dependência de Internet para os mapas:**
   - Os mosaicos cartográficos são carregados em tempo real a partir de `tile.openstreetmap.org`, pelo que é necessária ligação ativa à Internet para visualizar o fundo cartográfico (em conformidade com a política de utilização e atribuição do OpenStreetMap).

---

## Visão Geral da Página Inicial e dos Três Portais

0. **Início — Página de Acolhimento Minimalista (`src/pages/LandingPage.tsx`):**
   - Ilustração principal (`public/hero-illustration.jpg`), seletor interativo de necessidades (com navegação por teclado e rato) que encaminha intuitivamente cada perfil para o respetivo portal, cartões numerados (`01`, `02`, `03`), mapa interativo de Cascais atualizado em tempo real com filtros rápidos por estado e localidade, e faixa de 4 etapas do ciclo de confiança (*Registar → Avaliar → Publicar → Manter*).
1. **02 · Comerciante (`src/pages/MerchantPage.tsx`):**
   - Formulário com validação acessível para nome, morada, localidade, largura útil da entrada (cm), existência explícita de degraus (Sim/Não), fotografia opcional da entrada (redimensionada e comprimida em cliente para segurança de quota) e seleção obrigatória da posição por clique no mapa.
   - Botão **«Avaliar e registar»** que calcula o estado preliminar e atualiza imediatamente o contexto partilhado.
2. **Autarquia (`src/pages/MunicipalityPage.tsx`):**
   - Cartões de indicadores dinâmicos (KPIs):
     1. **Total de espaços registados**
     2. **% com avaliação preliminar acessível**
     3. **Índice ilustrativo de prontidão documental** — calculado explicitamente em `src/lib/metrics.ts` sobre 6 campos/evidências esperados por registo: `(campos preenchidos / (total de estabelecimentos × 6)) × 100`.
     4. **Reportes abertos**
   - Tabela dinâmica de estabelecimentos, lista de reportes comunitários (com opção **«Marcar como resolvido»** sem alterar silenciosamente a avaliação do estabelecimento) e botão **«Exportar relatório CSV»**.
3. **Cidadão (`src/pages/CitizenPage.tsx`):**
   - Mapa interativo Leaflet centrado no concelho de Cascais com marcadores coloridos e simbologia não dependente apenas da cor (`✓` verde para *Acessível — avaliação preliminar*, `!` amarelo para *Requer avaliação*, `?` cinzento para *Pendente*).
   - Legenda visível, filtros (**Todos**, **Acessíveis**, **A avaliar**, **Pendentes**), janela de detalhe (*popup*) com fotografia quando disponível, lista textual acessível complementar e modal **«Reportar inconsistência»**.

---

## Guião de Demonstração («Café da Parede»)

1. Na vista **Comerciante**, preencha:
   - **Nome do estabelecimento:** `Café da Parede`
   - **Morada:** `Avenida da República, n.º 45`
   - **Localidade:** `Parede, Cascais`
   - **Largura útil da entrada (cm):** `85`
   - **Existem degraus na entrada?:** `Não`
   - Clique num ponto sobre a zona da **Parede** no mapa interativo para definir as coordenadas.
2. Clique em **«Avaliar e registar»**. Verifique a confirmação imediata com a etiqueta verde **«Acessível — avaliação preliminar»**.
3. Aceda à vista **Autarquia**: confirme que `Café da Parede` surge no topo da tabela de estabelecimentos e que os KPIs atualizaram (total passa de 8 para 9).
4. Aceda à vista **Cidadão**: localize o novo **marcador verde (`✓`)** na Parede e clique nele para abrir o *popup* de detalhes.
5. Clique em **«Reportar inconsistência»**, escreva:
   `A entrada tem um pequeno degrau não declarado.`
   e submeta o reporte.
6. Regresse à vista **Autarquia**: confirme que surge um novo reporte com estado **Aberto** associado a `Café da Parede` (e que o indicador **Reportes abertos** aumentou sem alterar a avaliação preliminar do estabelecimento).
7. Atualize a página no navegador (**F5**) e confirme que o estabelecimento e o reporte permanecem guardados.

---

## Funcionalidades Implementadas e Limitações / Exclusões Conhecidas

### Implementado
- Navegação integrada entre as vistas **Comerciante**, **Autarquia** e **Cidadão**.
- Motor determinístico `evaluateAccessibility` (`>= 80 cm` e `hasSteps === false` → `accessible`; caso contrário com dados válidos → `needs_review`; dados em falta/inválidos → `pending`).
- 8 registos iniciais fictícios distribuídos por Cascais, Estoril, Parede e Carcavelos, devidamente identificados como **Dados fictícios**.
- Persistência resiliente em `localStorage` com tratamento de JSON inválido e salvaguarda contra excesso de quota (nunca bloqueando a gravação do registo caso uma fotografia exceda o espaço disponível).
- Compressão opcional de imagem em `<canvas>` com alternativa segura de pré-visualização em sessão.
- Painel municipal com 4 KPIs dinâmicos, resolução manual de reportes e exportação CSV demonstrativa com BOM UTF-8.
- Mapa público Leaflet/OpenStreetMap com marcadores diferenciados por cor e símbolo, filtros, *popups* e submissão de reportes de inconsistência.

### Exclusões Explícitas e Limitações Conhecidas
- Sem servidor, base de dados, contas de utilizador, autenticação ou sincronização multi-dispositivo.
- Sem geocodificação automática de moradas, cálculo de rotas/direções, geolocalização GPS do utilizador ou agrupamento (*clustering*) de marcadores.
- Sem reconhecimento de imagem por IA/Visão Computacional.
- Sem auditorias formais de conformidade legal, selos oficiais, candidaturas reais Portugal 2030 ou geração de relatórios PDF.

---

## Estado das Verificações e Testes

### Verificações executadas automaticamente
- `npm install`: concluído com sucesso (0 vulnerabilidades, sem conflitos de dependências entre React 18, Leaflet 1.9 e React Leaflet 4.2).
- `npm run build` (`tsc -b && vite build`): compilação TypeScript estrita e geração do pacote de produção Vite concluídas sem erros.
- Transformação de módulos em Vite e bateria automatizada de verificação lógica sobre os módulos reais (`accessibility.ts`, `seed.ts`, `storage.ts`, `metrics.ts`, `exportCsv.ts`), validando:
  - Casos de fronteira da regra determinística (`85 cm` sem degraus, `80 cm` sem degraus, `79,9 cm`, `75 cm`, presença de degraus e entradas nulas/inválidas).
  - Ciclo de dados fim-a-fim do cenário «Café da Parede», atualização de KPIs, criação de reporte sem mutação da avaliação preliminar e persistência em `localStorage` sem re-sementeira após limpeza.
  - Tratamento de JSON corrompido, proteção de quota de `localStorage` para fotografias e escape RFC 4180 + BOM UTF-8 no CSV.

### Interações não testadas em navegador gráfico automatizado
- Este ambiente de execução não dispõe de pré-visualização de navegador interativo automatizado com acesso externo à rede. Por conseguinte, os cliques visuais sobre o mapa Leaflet, o carregamento visual em tempo real dos mosaicos `tile.openstreetmap.org`, o seletor nativo de ficheiros de imagem e a transferência do ficheiro CSV devem ser confirmados diretamente num navegador local após executar `npm run dev`.
