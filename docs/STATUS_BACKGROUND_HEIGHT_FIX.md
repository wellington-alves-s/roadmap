# Correção da Altura do Status Background

## Problema Identificado

O usuário reportou que ainda conseguia ver os cards de níveis nas "frestras" (gaps) entre o card de status e a Linha do Tempo de Aprendizado, mesmo após a implementação do `.status-background`.

## Análise Técnica

Após análise detalhada da estrutura CSS, identifiquei que havia um **gap** entre o `.status-background` e o `.levels-header`:

### Medidas Anteriores:

- **Desktop**:
    - `.status-background`: `height: 350px` (de `top: 0` até `y: 350`)
    - `.levels-header`: `top: 290px`
    - **Gap**: 60px entre `y: 290` e `y: 350`

- **Mobile**:
    - `.status-background`: `height: 290px` (de `top: 0` até `y: 290`)
    - `.levels-header`: `top: 240px`
    - **Gap**: 50px entre `y: 240` e `y: 290`

### Problema:

Os cards de níveis estavam aparecendo nessa janela/gap porque o `.status-background` não cobria completamente a área até o `.levels-header`.

## Solução Implementada

### 1. Aumento da Altura do Status Background

**Desktop** (`roadmap-app/public/styles.css` linha 315):

```css
.status-background {
	position: fixed;
	top: 0;
	left: 300px;
	right: 20px;
	height: 400px; /* Aumentado de 350px para 400px */
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	z-index: 9999;
	pointer-events: none;
}
```

**Mobile** (`roadmap-app/public/styles.css` linha 1104):

```css
@media (max-width: 768px) {
	.status-background {
		left: 20px;
		right: 20px;
		height: 340px; /* Aumentado de 290px para 340px */
	}
}
```

### 2. Ajuste do Padding do Main Content

Para garantir que o conteúdo comece após o `.status-background`:

**Desktop** (`roadmap-app/public/styles.css` linha 117):

```css
.main-content {
	margin-left: 280px;
	padding: 20px;
	padding-top: 480px; /* Aumentado de 440px para 480px */
	min-height: 100vh;
	transition: all 0.3s ease;
	position: relative;
	z-index: 1;
}
```

**Mobile** (`roadmap-app/public/styles.css` linha 1092):

```css
@media (max-width: 768px) {
	.main-content {
		margin-left: 0;
		padding: 15px;
		padding-top: 430px; /* Aumentado de 390px para 430px */
	}
}
```

## Resultado Esperado

Com essas alterações:

1. **Desktop**: O `.status-background` agora cobre de `top: 0` até `y: 400`, cobrindo completamente o `.levels-header` em `top: 290px`
2. **Mobile**: O `.status-background` agora cobre de `top: 0` até `y: 340`, cobrindo completamente o `.levels-header` em `top: 240px`
3. **Conteúdo**: O `.main-content` agora começa em `padding-top: 480px` (desktop) e `padding-top: 430px` (mobile), garantindo que nenhum card de nível apareça na área coberta

## Stacking Order Final

```
z-index: 10005 - .levels-header (acima de tudo)
z-index: 10001 - .admin-section
z-index: 10000 - .progress-section
z-index: 9999  - .status-background (cama contínua)
z-index: 9998  - .fixed-overlay
z-index: 1     - .main-content, .levels-section, .level-card
```

## Teste

Após essas alterações, os cards de níveis não devem mais aparecer nas "frestras" entre o card de status e a Linha do Tempo de Aprendizado, criando uma cobertura contínua e opaca conforme solicitado pelo usuário.
