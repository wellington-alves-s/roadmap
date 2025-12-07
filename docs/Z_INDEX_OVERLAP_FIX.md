# Correção: Cards de Níveis Sobrepondo o Card de Status

## Problema

O usuário reportou que "Os cards de niveis estão aparecendo sobrepondo o cad de status quando rolo o scrol do mouse para cima, lembra que te pedi para ocultar os cards atrás do card de status e Linha do Tempo de Aprendizado quando rolar o scroll do mouse? Como se tivesse uma cama entre".

## Análise do Problema

### Estrutura HTML Original (Problemática)

```html
<div id="dashboard" class="dashboard">
	<aside class="sidebar">...</aside>
	<main class="main-content">
		<section class="progress-section">...</section>
		<!-- Dentro de main-content -->
		<section class="admin-section">...</section>
		<!-- Dentro de main-content -->
		<section class="levels-section">...</section>
		<!-- Dentro de main-content -->
	</main>
</div>
```

### Problema de Z-Index

- `.main-content` tinha `z-index: 999` e `position: relative`
- `.progress-section` tinha `z-index: 1004` e `position: fixed`
- `.levels-section` tinha `z-index: 999` e `position: relative`
- `.level-card` tinha `z-index: 999`

O problema era que o `.progress-section` estava **dentro** do `.main-content`, criando um contexto de empilhamento onde o `z-index` do `.progress-section` não conseguia sobrescrever adequadamente os elementos do `.levels-section` que também estavam dentro do mesmo contexto.

## Solução Implementada

### 1. Reestruturação HTML

**Arquivo**: `public/index.html`

Movido o `.progress-section` e `.admin-section` para **fora** do `.main-content`, tornando-os filhos diretos do `.dashboard`:

```html
<div id="dashboard" class="dashboard">
	<aside class="sidebar">...</aside>

	<!-- Progress Section - Movido para fora do main-content -->
	<section class="progress-section">...</section>

	<!-- Admin Section - Movido para fora do main-content -->
	<section class="admin-section">...</section>

	<!-- Main Content -->
	<main class="main-content">
		<section class="levels-section">...</section>
	</main>
</div>
```

### 2. Ajuste de Z-Index

**Arquivo**: `public/styles.css`

#### Progress Section

```css
.progress-section {
	position: fixed;
	top: 20px;
	left: 300px;
	right: 20px;
	z-index: 10000; /* Aumentado de 1004 para 10000 */
	margin-bottom: 0;
}
```

#### Admin Section

```css
.admin-section {
	position: fixed;
	top: 20px;
	left: 300px;
	right: 20px;
	z-index: 10001; /* Aumentado de 1006 para 10001 */
	/* ... outras propriedades ... */
}
```

#### Levels Section

```css
.levels-section {
	margin-top: 0;
	padding-top: 20px;
	position: relative;
	z-index: 1; /* Reduzido de 999 para 1 */
}
```

#### Level Cards

```css
.level-card {
	/* ... outras propriedades ... */
	position: relative;
	z-index: 1; /* Reduzido de 999 para 1 */
}
```

#### Main Content

```css
.main-content {
	/* ... outras propriedades ... */
	position: relative;
	z-index: 1; /* Reduzido de 999 para 1 */
}
```

### 3. Responsividade Mobile

Adicionado z-index específico para mobile:

```css
@media (max-width: 768px) {
	.progress-section {
		left: 20px;
		right: 20px;
		top: 10px;
		z-index: 10000; /* Garantir que funcione no mobile */
	}
}
```

## Resultado Esperado

- ✅ O card de status (progress-section) permanece sempre no topo
- ✅ Os cards de níveis passam por baixo do card de status ao rolar
- ✅ O admin-section também fica no topo quando ativo
- ✅ Funciona tanto em desktop quanto em mobile
- ✅ Mantém todas as funcionalidades existentes

## Hierarquia de Z-Index Final

1. **Admin Section**: `z-index: 10001` (mais alto)
2. **Progress Section**: `z-index: 10000` (alto)
3. **Main Content**: `z-index: 1` (baixo)
4. **Levels Section**: `z-index: 1` (baixo)
5. **Level Cards**: `z-index: 1` (baixo)

## Benefícios

- **Separação de Contextos**: Progress e Admin sections agora têm seus próprios contextos de empilhamento
- **Controle Preciso**: Z-index mais alto garante que elementos fixos fiquem sempre no topo
- **Performance**: Redução de conflitos de z-index melhora a performance de renderização
- **Manutenibilidade**: Estrutura mais clara e fácil de manter
- **Responsividade**: Funciona corretamente em todos os dispositivos

## Teste

Para testar se a correção funcionou:

1. Faça login na aplicação
2. Role o scroll para cima e para baixo
3. Verifique que o card de status permanece sempre visível no topo
4. Verifique que os cards de níveis passam por baixo do card de status
5. Teste no painel administrativo e verifique que também fica no topo
6. Teste em diferentes tamanhos de tela

## Arquivos Modificados

1. **`public/index.html`**:
    - Movido `.progress-section` para fora do `.main-content`
    - Movido `.admin-section` para fora do `.main-content`
    - Reorganizada a estrutura HTML

2. **`public/styles.css`**:
    - Aumentado z-index do `.progress-section` para 10000
    - Aumentado z-index do `.admin-section` para 10001
    - Reduzido z-index do `.levels-section` para 1
    - Reduzido z-index do `.level-card` para 1
    - Reduzido z-index do `.main-content` para 1
    - Adicionado z-index específico para mobile
